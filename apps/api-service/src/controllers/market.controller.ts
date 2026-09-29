import { Request, Response } from "express";
import { redis } from "@repo/redis";
import { MARKETS, ASSET_SYMBOLS, type AssetSymbol } from "@repo/types";
import { config } from "../lib/config";
import { validationError } from "../lib/http";
import { GetCandlesQuerySchema, INTERVALS } from "../schemas/candles.type";

/** Small TTL cache so many clients share one upstream request. */
const cache = new Map<string, { at: number; value: Promise<unknown> }>();

function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { at: Date.now(), value });
  value.catch(() => cache.delete(key));
  return value;
}

async function upstream(path: string) {
  const res = await fetch(`${config.upstreamApi}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Market data provider returned ${res.status}`);
  return res.json();
}

function resolveMarket(raw: unknown): AssetSymbol | undefined {
  const s = String(raw ?? "").toUpperCase().split(/[_/-]/)[0]!.replace(/USD[CT]?$/, "");
  return s in MARKETS ? (s as AssetSymbol) : undefined;
}

// Backpack reports candle times as "YYYY-MM-DD HH:mm:ss" in UTC.
const toUnixSeconds = (t: string | number) =>
  typeof t === "number" ? Math.floor(t > 1e12 ? t / 1000 : t) : Math.floor(Date.parse(t.replace(" ", "T") + "Z") / 1000);

const INTERVAL_SECONDS: Record<(typeof INTERVALS)[number], number> = {
  "1m": 60, "3m": 180, "5m": 300, "15m": 900, "30m": 1800, "1h": 3600, "2h": 7200,
  "4h": 14400, "6h": 21600, "12h": 43200, "1d": 86400, "1w": 604800,
};

export const getCandles = async (req: Request, res: Response) => {
  const result = GetCandlesQuerySchema.safeParse(req.query);
  if (!result.success) return validationError(res, result.error);
  const asset = resolveMarket(result.data.asset);
  if (!asset) return res.status(400).json({ error: "Unknown market" });
  const interval = result.data.ts;

  // ~500 candles of history for every timeframe.
  const start = Math.floor(Date.now() / 1000) - INTERVAL_SECONDS[interval] * 500;
  const pair = MARKETS[asset].pair;
  const ttl = Math.min(INTERVAL_SECONDS[interval] * 1000, 15_000);
  const data = await cached(`klines:${pair}:${interval}`, ttl, () =>
    upstream(`/klines?symbol=${pair}&interval=${interval}&startTime=${start}`)
  );
  const candles = (data as any[])
    .map((c) => ({
      time: toUnixSeconds(c.start),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume),
    }))
    .filter((c) => Number.isFinite(c.time) && c.open > 0)
    .sort((a, b) => a.time - b.time);
  res.set("Cache-Control", "public, max-age=5").json({ symbol: asset, interval, data: candles });
};

export const getTickers = async (_req: Request, res: Response) => {
  let tickers: any[] = [];
  try {
    tickers = (await cached("tickers", 5000, () => upstream("/tickers"))) as any[];
  } catch (e) {
    console.warn("[market] tickers unavailable:", (e as Error).message);
  }
  const status = await redis.get("engine:status").catch(() => null);
  const quotes = status ? JSON.parse(status).quotes ?? {} : {};

  res.set("Cache-Control", "public, max-age=3").json({
    tickers: ASSET_SYMBOLS.map((symbol) => {
      const t = tickers.find((x) => x.symbol === MARKETS[symbol].pair);
      const q = quotes[symbol];
      return {
        symbol,
        pair: MARKETS[symbol].pair,
        bid: q?.bid ?? null,
        ask: q?.ask ?? null,
        lastPrice: t ? Number(t.lastPrice) : q ? (q.bid + q.ask) / 2 : null,
        open24h: t ? Number(t.firstPrice) : null,
        high24h: t ? Number(t.high) : null,
        low24h: t ? Number(t.low) : null,
        change24h: t ? Number(t.priceChangePercent) * 100 : null,
        volume24h: t ? Number(t.volume) : null,
        quoteVolume24h: t ? Number(t.quoteVolume) : null,
      };
    }),
  });
};

export const getDepth = async (req: Request, res: Response) => {
  const asset = resolveMarket(req.params.symbol);
  if (!asset) return res.status(400).json({ error: "Unknown market" });
  const pair = MARKETS[asset].pair;
  const data: any = await cached(`depth:${pair}`, 700, () => upstream(`/depth?symbol=${pair}`));
  const levels = (rows: [string, string][]) => rows.map(([p, q]) => [Number(p), Number(q)] as [number, number]);
  res.json({
    symbol: asset,
    bids: levels(data.bids ?? []).sort((a, b) => b[0] - a[0]).slice(0, 50),
    asks: levels(data.asks ?? []).sort((a, b) => a[0] - b[0]).slice(0, 50),
    ts: Date.now(),
  });
};

export const getTrades = async (req: Request, res: Response) => {
  const asset = resolveMarket(req.params.symbol);
  if (!asset) return res.status(400).json({ error: "Unknown market" });
  const pair = MARKETS[asset].pair;
  const data = (await cached(`trades:${pair}`, 1000, () => upstream(`/trades?symbol=${pair}&limit=60`))) as any[];
  res.json({
    symbol: asset,
    trades: data
      .map((t) => ({
        id: String(t.id),
        price: Number(t.price),
        qty: Number(t.quantity),
        side: t.isBuyerMaker ? "sell" : "buy",
        ts: Number(t.timestamp),
      }))
      .sort((a, b) => b.ts - a.ts),
  });
};
