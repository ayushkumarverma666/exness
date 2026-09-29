import dotenv from "dotenv";
dotenv.config();

import { createRedis, addToStream, ENGINE_STREAM, CALLBACK_QUEUE } from "@repo/redis";
import { prisma } from "@repo/prisma";
import {
  MARKETS,
  MAX_LEVERAGE,
  MAX_DEMO_BALANCE,
  PRICE_STALE_MS,
  liquidationPrice,
  positionPnl,
  type AssetSymbol,
  type CloseReason,
  type EngineReply,
  type EngineRequest,
  type Side,
} from "@repo/types";

/**
 * The engine is the single writer of balances and positions. Every request is
 * processed sequentially from the Redis stream, so there are no races between
 * price-triggered closes, manual closes, new orders and deposits.
 */

interface Position {
  id: string;
  userId: string;
  asset: AssetSymbol;
  side: Side;
  qty: number;
  leverage: number;
  openingPrice: number;
  margin: number;
  liquidationPrice: number;
  takeProfit?: number;
  stopLoss?: number;
  createdAt: number;
}

interface Quote {
  bid: number;
  ask: number;
  ts: number;
}

/** Requests older than this were already timed out by the API and must not execute. */
const REQUEST_TTL_MS = 5_000;

const reader = createRedis();
const writer = createRedis();

const quotes = new Map<AssetSymbol, Quote>();
const balances = new Map<string, number>();
const positions = new Map<string, Position>();

const round8 = (n: number) => Math.round(n * 1e8) / 1e8;
const dec = (n: number) => round8(n).toFixed(8);

function reply(r: EngineReply) {
  return addToStream(writer, CALLBACK_QUEUE, "data", JSON.stringify(r)).catch((e) =>
    console.error("[engine] failed to send reply:", e)
  );
}

function freshQuote(asset: AssetSymbol): Quote | undefined {
  const q = quotes.get(asset);
  return q && Date.now() - q.ts < PRICE_STALE_MS ? q : undefined;
}

async function getBalance(userId: string): Promise<number> {
  const cached = balances.get(userId);
  if (cached !== undefined) return cached;
  const row = await prisma.asset.findUnique({
    where: { user_symbol_unique: { userId, symbol: "USDC" } },
  });
  const value = row ? Number(row.balance) : 0;
  balances.set(userId, value);
  return value;
}

function positionFromRow(o: any): Position {
  const openingPrice = Number(o.openingPrice);
  return {
    id: o.id,
    userId: o.userId,
    asset: o.asset as AssetSymbol,
    side: o.side as Side,
    qty: Number(o.qty),
    leverage: o.leverage,
    openingPrice,
    margin: Number(o.margin),
    liquidationPrice: liquidationPrice(o.side, openingPrice, o.leverage),
    takeProfit: o.takeProfit != null ? Number(o.takeProfit) : undefined,
    stopLoss: o.stopLoss != null ? Number(o.stopLoss) : undefined,
    createdAt: o.createdAt.getTime(),
  };
}

async function loadState() {
  const [assets, open] = await Promise.all([
    prisma.asset.findMany({ where: { symbol: "USDC" } }),
    prisma.order.findMany({ where: { status: "open" } }),
  ]);
  balances.clear();
  positions.clear();
  for (const a of assets) balances.set(a.userId, Number(a.balance));
  for (const o of open) positions.set(o.id, positionFromRow(o));
  console.log(`[engine] restored ${balances.size} accounts and ${positions.size} open positions`);
}

// ---------------------------------------------------------------------------
// Handlers

type CreateOrder = Extract<EngineRequest, { kind: "create-order" }>["payload"];

async function createOrder(p: CreateOrder) {
  const market = MARKETS[p.asset];
  const qty = Number(p.qty);
  const leverage = Math.trunc(Number(p.leverage));
  if (
    !market ||
    (p.side !== "long" && p.side !== "short") ||
    !Number.isFinite(qty) ||
    qty < market.minQty ||
    qty > market.maxQty ||
    !(leverage >= 1 && leverage <= MAX_LEVERAGE)
  ) {
    return reply({ id: p.id, status: "invalid_order", message: "Invalid order parameters" });
  }
  if (positions.has(p.id)) return reply({ id: p.id, status: "created" });

  const quote = freshQuote(p.asset);
  if (!quote) {
    return reply({ id: p.id, status: "no_price", message: `No live price for ${p.asset}` });
  }

  const openingPrice = p.side === "long" ? quote.ask : quote.bid;
  const margin = round8((openingPrice * qty) / leverage);
  const liq = liquidationPrice(p.side, openingPrice, leverage);
  const tp = p.takeProfit && p.takeProfit > 0 ? Number(p.takeProfit) : undefined;
  const sl = p.stopLoss && p.stopLoss > 0 ? Number(p.stopLoss) : undefined;

  const wrongSide = (level: number | undefined, mustBeAbove: boolean) =>
    level !== undefined && (mustBeAbove ? level <= openingPrice : level >= openingPrice);
  if (wrongSide(tp, p.side === "long") || wrongSide(sl, p.side === "short")) {
    return reply({
      id: p.id,
      status: "invalid_order",
      message: `Take profit / stop loss is on the wrong side of the fill price ${openingPrice}`,
    });
  }

  const balance = await getBalance(p.userId);
  if (balance < margin) {
    return reply({
      id: p.id,
      status: "insufficient_balance",
      message: `Required margin ${margin.toFixed(2)} USDC, free balance ${balance.toFixed(2)} USDC`,
    });
  }

  const newBalance = round8(balance - margin);
  const createdAt = new Date();
  try {
    await prisma.$transaction([
      prisma.asset.upsert({
        where: { user_symbol_unique: { userId: p.userId, symbol: "USDC" } },
        create: { userId: p.userId, symbol: "USDC", balance: dec(newBalance) },
        update: { balance: dec(newBalance) },
      }),
      prisma.order.create({
        data: {
          id: p.id,
          userId: p.userId,
          asset: p.asset,
          side: p.side,
          qty: dec(qty),
          leverage,
          openingPrice: dec(openingPrice),
          margin: dec(margin),
          takeProfit: tp !== undefined ? dec(tp) : null,
          stopLoss: sl !== undefined ? dec(sl) : null,
          status: "open",
          createdAt,
        },
      }),
    ]);
  } catch (e) {
    console.error("[engine] failed to persist order", p.id, e);
    return reply({ id: p.id, status: "error", message: "Could not persist order" });
  }

  balances.set(p.userId, newBalance);
  positions.set(p.id, {
    id: p.id,
    userId: p.userId,
    asset: p.asset,
    side: p.side,
    qty,
    leverage,
    openingPrice,
    margin,
    liquidationPrice: liq,
    takeProfit: tp,
    stopLoss: sl,
    createdAt: createdAt.getTime(),
  });
  console.log(`[engine] opened ${p.side} ${qty} ${p.asset} @ ${openingPrice} x${leverage} (${p.id})`);
  return reply({
    id: p.id,
    status: "created",
    data: { openingPrice, margin, liquidationPrice: liq },
  });
}

async function closePosition(pos: Position, price: number, reason: CloseReason) {
  // Isolated margin: a position can never lose more than the margin put up for it.
  const pnl = round8(Math.max(positionPnl(pos.side, pos.openingPrice, price, pos.qty), -pos.margin));
  const balance = await getBalance(pos.userId);
  const newBalance = round8(balance + pos.margin + pnl);

  await prisma.$transaction([
    prisma.order.update({
      where: { id: pos.id },
      data: {
        status: "closed",
        closingPrice: dec(price),
        pnl: dec(pnl),
        closeReason: reason,
        closedAt: new Date(),
      },
    }),
    prisma.asset.upsert({
      where: { user_symbol_unique: { userId: pos.userId, symbol: "USDC" } },
      create: { userId: pos.userId, symbol: "USDC", balance: dec(newBalance) },
      update: { balance: dec(newBalance) },
    }),
    prisma.transaction.create({
      data: {
        userId: pos.userId,
        type: "RealizedPnl",
        symbol: "USDC",
        amount: dec(pnl),
        balanceAfter: dec(newBalance),
        orderId: pos.id,
      },
    }),
  ]);

  balances.set(pos.userId, newBalance);
  positions.delete(pos.id);
  console.log(`[engine] closed ${pos.id} (${reason}) @ ${price}, pnl ${pnl.toFixed(2)}`);
  return { pnl, closingPrice: price };
}

async function closeOrder(p: { id: string; orderId: string; userId: string }) {
  const pos = positions.get(p.orderId);
  if (!pos || pos.userId !== p.userId) {
    return reply({ id: p.id, status: "order_not_found", message: "Position not found or already closed" });
  }
  const quote = freshQuote(pos.asset);
  if (!quote) return reply({ id: p.id, status: "no_price", message: `No live price for ${pos.asset}` });

  try {
    const result = await closePosition(pos, pos.side === "long" ? quote.bid : quote.ask, "Manual");
    return reply({ id: p.id, status: "closed", data: result });
  } catch (e) {
    console.error("[engine] failed to close", pos.id, e);
    return reply({ id: p.id, status: "error", message: "Could not close position" });
  }
}

async function deposit(p: { id: string; userId: string; amount: number }) {
  const amount = round8(Number(p.amount));
  if (!(amount > 0)) return reply({ id: p.id, status: "invalid_order", message: "Invalid amount" });

  const balance = await getBalance(p.userId);
  const newBalance = round8(balance + amount);
  if (newBalance > MAX_DEMO_BALANCE) {
    return reply({
      id: p.id,
      status: "limit_exceeded",
      message: `Demo accounts are limited to ${MAX_DEMO_BALANCE.toLocaleString("en-US")} USDC`,
    });
  }

  try {
    await prisma.$transaction([
      prisma.asset.upsert({
        where: { user_symbol_unique: { userId: p.userId, symbol: "USDC" } },
        create: { userId: p.userId, symbol: "USDC", balance: dec(newBalance) },
        update: { balance: dec(newBalance) },
      }),
      prisma.transaction.create({
        data: {
          userId: p.userId,
          type: "Deposit",
          symbol: "USDC",
          amount: dec(amount),
          balanceAfter: dec(newBalance),
        },
      }),
    ]);
  } catch (e) {
    console.error("[engine] failed to persist deposit", e);
    return reply({ id: p.id, status: "error", message: "Could not persist deposit" });
  }
  balances.set(p.userId, newBalance);
  return reply({ id: p.id, status: "deposited", data: { balance: newBalance } });
}

/** Checks take-profit, stop-loss and liquidation for every position on this market. */
async function onPrice(asset: AssetSymbol) {
  const quote = quotes.get(asset);
  if (!quote) return;
  for (const pos of [...positions.values()]) {
    if (pos.asset !== asset) continue;
    const mark = pos.side === "long" ? quote.bid : quote.ask;
    const long = pos.side === "long";

    let reason: CloseReason | undefined;
    if (pos.takeProfit !== undefined && (long ? mark >= pos.takeProfit : mark <= pos.takeProfit)) {
      reason = "TakeProfit";
    } else if (pos.stopLoss !== undefined && (long ? mark <= pos.stopLoss : mark >= pos.stopLoss)) {
      reason = "StopLoss";
    } else if (long ? mark <= pos.liquidationPrice : mark >= pos.liquidationPrice) {
      reason = "Liquidation";
    }
    if (!reason) continue;

    try {
      await closePosition(pos, mark, reason);
    } catch (e) {
      console.error(`[engine] failed to auto-close ${pos.id} (${reason})`, e);
    }
  }
}

// ---------------------------------------------------------------------------
// Main loop

async function publishStatus() {
  const status = {
    ts: Date.now(),
    positions: positions.size,
    accounts: balances.size,
    quotes: Object.fromEntries(quotes),
  };
  await writer.set("engine:status", JSON.stringify(status), "EX", 15).catch(() => {});
}

async function handle(msg: EngineRequest & { sentAt?: number }) {
  if (msg.kind !== "price-update" && msg.sentAt && Date.now() - msg.sentAt > REQUEST_TTL_MS) {
    const id = (msg.payload as { id: string }).id;
    console.warn(`[engine] dropping expired ${msg.kind} request ${id}`);
    return;
  }
  switch (msg.kind) {
    case "create-order":
      return createOrder(msg.payload);
    case "close-order":
      return closeOrder(msg.payload);
    case "deposit":
      return deposit(msg.payload);
  }
}

async function run() {
  // Start after the current tail so requests from before a restart are never replayed.
  const tail = await reader.xrevrange(ENGINE_STREAM, "+", "-", "COUNT", 1);
  let lastId = tail[0]?.[0] ?? "0-0";

  await loadState();
  setInterval(publishStatus, 2000);
  console.log("[engine] ready");

  while (true) {
    try {
      const res = await reader.xread("COUNT", 500, "BLOCK", 5000, "STREAMS", ENGINE_STREAM, lastId);
      if (!res) continue;
      const touched = new Set<AssetSymbol>();

      for (const [id, fields] of res[0]![1]) {
        lastId = id;
        const raw = fields[fields.indexOf("data") + 1];
        if (!raw) continue;
        let msg: EngineRequest & { sentAt?: number };
        try {
          msg = JSON.parse(raw);
        } catch {
          continue;
        }

        if (msg.kind === "price-update") {
          const { symbol, bid, ask, ts } = msg.payload;
          if (MARKETS[symbol] && bid > 0 && ask >= bid) {
            quotes.set(symbol, { bid, ask, ts: ts || Date.now() });
            touched.add(symbol);
          }
          continue;
        }

        // Evaluate triggers on the latest prices before acting on a user request.
        for (const s of touched) await onPrice(s);
        touched.clear();
        await handle(msg);
      }

      for (const s of touched) await onPrice(s);
    } catch (e) {
      console.error("[engine] loop error:", e);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

run().catch((e) => {
  console.error("[engine] fatal:", e);
  process.exit(1);
});
