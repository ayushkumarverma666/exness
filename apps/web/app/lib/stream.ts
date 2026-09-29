"use client";

import { useSyncExternalStore } from "react";
import { MARKETS, type AssetSymbol } from "./markets";
import type { Trade } from "./types";

const WS_URL = process.env.NEXT_PUBLIC_MARKET_WS_URL || "wss://ws.backpack.exchange";
const MAX_TRADES = 60;
const NOTIFY_MS = 200;

export interface LiveQuote {
  bid: number;
  ask: number;
  ts: number;
}

export interface StreamSnapshot {
  status: "connecting" | "live" | "offline";
  quotes: Partial<Record<AssetSymbol, LiveQuote>>;
  last: Partial<Record<AssetSymbol, number>>;
  trades: Partial<Record<AssetSymbol, Trade[]>>;
}

const pairToSymbol = Object.fromEntries(MARKETS.map((m) => [m.pair, m.symbol])) as Record<string, AssetSymbol>;

/**
 * One shared WebSocket to the exchange for the whole app. Updates are batched and
 * published at most every NOTIFY_MS so a busy tape does not re-render React per tick.
 */
class MarketStream {
  private ws: WebSocket | null = null;
  private listeners = new Set<() => void>();
  private tradeListeners = new Set<(symbol: AssetSymbol, trade: Trade) => void>();
  private snapshot: StreamSnapshot = { status: "connecting", quotes: {}, last: {}, trades: {} };
  private draft: StreamSnapshot = { ...this.snapshot };
  private timer: ReturnType<typeof setTimeout> | null = null;
  private attempts = 0;
  private started = false;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    this.start();
    return () => this.listeners.delete(fn);
  };

  onTrade(fn: (symbol: AssetSymbol, trade: Trade) => void) {
    this.tradeListeners.add(fn);
    this.start();
    return () => {
      this.tradeListeners.delete(fn);
    };
  }

  getSnapshot = () => this.snapshot;

  private start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    this.connect();
  }

  private schedule() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.snapshot = { ...this.draft };
      this.listeners.forEach((l) => l());
    }, NOTIFY_MS);
  }

  private setStatus(status: StreamSnapshot["status"]) {
    this.draft = { ...this.draft, status };
    this.schedule();
  }

  private connect() {
    this.setStatus("connecting");
    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    ws.onopen = () => {
      this.attempts = 0;
      this.setStatus("live");
      ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: MARKETS.flatMap((m) => [`bookTicker.${m.pair}`, `trade.${m.pair}`]),
          id: 1,
        })
      );
    };

    ws.onmessage = (event) => {
      let d: Record<string, string | number | boolean> | undefined;
      try {
        d = JSON.parse(event.data)?.data;
      } catch {
        return;
      }
      if (!d) return;
      const symbol: AssetSymbol | undefined = pairToSymbol[String(d.s)];
      if (!symbol) return;

      if (d.e === "bookTicker") {
        const bid = Number(d.b);
        const ask = Number(d.a);
        if (bid > 0 && ask > 0) {
          this.draft = {
            ...this.draft,
            quotes: { ...this.draft.quotes, [symbol]: { bid, ask, ts: Date.now() } },
          };
          this.schedule();
        }
      } else if (d.e === "trade") {
        const trade: Trade = {
          id: String(d.t),
          price: Number(d.p),
          qty: Number(d.q),
          side: d.m ? "sell" : "buy",
          // Exchange timestamps are in microseconds.
          ts: Math.floor(Number(d.T) / 1000) || Date.now(),
        };
        const prev = this.draft.trades[symbol] ?? [];
        this.draft = {
          ...this.draft,
          last: { ...this.draft.last, [symbol]: trade.price },
          trades: { ...this.draft.trades, [symbol]: [trade, ...prev].slice(0, MAX_TRADES) },
        };
        this.tradeListeners.forEach((l) => l(symbol, trade));
        this.schedule();
      }
    };

    ws.onclose = () => {
      this.setStatus("offline");
      const delay = Math.min(15_000, 1000 * 2 ** this.attempts++);
      setTimeout(() => this.connect(), delay);
    };
    ws.onerror = () => ws.close();
  }
}

export const marketStream = new MarketStream();

const serverSnapshot: StreamSnapshot = { status: "connecting", quotes: {}, last: {}, trades: {} };

export function useMarketStream() {
  return useSyncExternalStore(marketStream.subscribe, marketStream.getSnapshot, () => serverSnapshot);
}
