import { Request, Response } from "express";
import { prisma } from "@repo/prisma";
import { MARKETS, liquidationPrice, type AssetSymbol, type Side } from "@repo/types";
import { CreateOrderBodySchema, OrdersQuerySchema } from "../schemas/trade.type";
import { engine } from "../lib/engineClient";
import { engineStatusCode, num, validationError } from "../lib/http";

function serializeOrder(o: any) {
  const openingPrice = Number(o.openingPrice);
  return {
    id: o.id,
    asset: o.asset,
    side: o.side,
    qty: Number(o.qty),
    leverage: o.leverage,
    openingPrice,
    closingPrice: num(o.closingPrice),
    margin: Number(o.margin),
    pnl: Number(o.pnl),
    takeProfit: num(o.takeProfit),
    stopLoss: num(o.stopLoss),
    liquidationPrice: liquidationPrice(o.side as Side, openingPrice, o.leverage),
    status: o.status,
    closeReason: o.closeReason,
    createdAt: o.createdAt.toISOString(),
    closedAt: o.closedAt?.toISOString() ?? null,
  };
}

export const createOrder = async (req: Request, res: Response) => {
  const result = CreateOrderBodySchema.safeParse(req.body);
  if (!result.success) return validationError(res, result.error);
  const { asset, side, qty, leverage, takeProfit, stopLoss } = result.data;

  const market = MARKETS[asset as AssetSymbol];
  if (qty < market.minQty || qty > market.maxQty) {
    return res
      .status(400)
      .json({ error: `${asset} order size must be between ${market.minQty} and ${market.maxQty}` });
  }

  const reply = await engine.send("create-order", {
    userId: req.user!.id,
    asset: asset as AssetSymbol,
    side,
    qty,
    leverage,
    takeProfit,
    stopLoss,
  });
  if (reply.status !== "created") {
    return res.status(engineStatusCode[reply.status]).json({ error: reply.message || reply.status });
  }
  const order = await prisma.order.findUnique({ where: { id: reply.id } });
  res.status(201).json({ message: "Order filled", order: order ? serializeOrder(order) : null });
};

export const closeOrder = async (req: Request, res: Response) => {
  const orderId = String(req.params.orderId);
  const reply = await engine.send("close-order", { orderId, userId: req.user!.id });
  if (reply.status !== "closed") {
    return res.status(engineStatusCode[reply.status]).json({ error: reply.message || reply.status });
  }
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  res.json({ message: "Position closed", order: order ? serializeOrder(order) : null });
};

export const getOrders = async (req: Request, res: Response) => {
  const result = OrdersQuerySchema.safeParse(req.query);
  if (!result.success) return validationError(res, result.error);
  const { status, limit } = result.data;

  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id, ...(status ? { status } : {}) },
    orderBy: status === "closed" ? { closedAt: "desc" } : { createdAt: "desc" },
    take: limit,
  });
  res.json({ orders: orders.map(serializeOrder) });
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: String(req.params.orderId), userId: req.user!.id },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order: serializeOrder(order) });
};

export const getStats = async (req: Request, res: Response) => {
  const closed = await prisma.order.findMany({
    where: { userId: req.user!.id, status: "closed" },
    select: { pnl: true },
  });
  const pnls = closed.map((o) => Number(o.pnl));
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
  res.json({
    trades: pnls.length,
    winRate: pnls.length ? wins.length / pnls.length : 0,
    realizedPnl: sum(pnls),
    avgWin: wins.length ? sum(wins) / wins.length : 0,
    avgLoss: losses.length ? sum(losses) / losses.length : 0,
    profitFactor: losses.length ? sum(wins) / Math.abs(sum(losses)) : null,
  });
};
