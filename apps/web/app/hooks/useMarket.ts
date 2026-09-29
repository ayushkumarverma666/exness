"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Candle, Depth, Ticker, Trade } from "../lib/types";
import type { AssetSymbol } from "../lib/markets";
import { useMarketStream, type LiveQuote } from "../lib/stream";

export function useTickers() {
  return useQuery({
    queryKey: ["market", "tickers"],
    queryFn: async () => (await api.get<{ tickers: Ticker[] }>("/market/tickers")).data.tickers,
    refetchInterval: 5_000,
    staleTime: 3_000,
  });
}

export function useDepth(symbol: AssetSymbol) {
  return useQuery({
    queryKey: ["market", "depth", symbol],
    queryFn: async () => (await api.get<Depth>(`/market/depth/${symbol}`)).data,
    refetchInterval: 1_000,
    staleTime: 500,
  });
}

export function useRecentTrades(symbol: AssetSymbol) {
  return useQuery({
    queryKey: ["market", "trades", symbol],
    queryFn: async () => (await api.get<{ trades: Trade[] }>(`/market/trades/${symbol}`)).data.trades,
    staleTime: 60_000,
  });
}

export function useCandles(symbol: AssetSymbol, interval: string) {
  return useQuery({
    queryKey: ["market", "candles", symbol, interval],
    queryFn: async () =>
      (await api.get<{ data: Candle[] }>(`/market/candles?asset=${symbol}&ts=${interval}`)).data.data,
    staleTime: 30_000,
  });
}

/**
 * Best available bid/ask: the live exchange stream when fresh, otherwise the
 * engine's own quotes from the tickers endpoint (the prices orders execute at).
 */
export function useQuotes(): Partial<Record<AssetSymbol, LiveQuote>> {
  const stream = useMarketStream();
  const { data: tickers } = useTickers();
  const out: Partial<Record<AssetSymbol, LiveQuote>> = {};
  for (const t of tickers ?? []) {
    if (t.bid && t.ask) out[t.symbol] = { bid: t.bid, ask: t.ask, ts: 0 };
  }
  const now = Date.now();
  for (const [s, q] of Object.entries(stream.quotes)) {
    if (q && now - q.ts < 15_000) out[s as AssetSymbol] = q;
  }
  return out;
}
