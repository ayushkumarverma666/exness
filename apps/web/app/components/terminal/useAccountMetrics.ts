"use client";

import { useBalance, useOpenPositions } from "../../hooks/useAccount";
import { useQuotes } from "../../hooks/useMarket";
import { pnlAt } from "../../lib/markets";
import type { Order } from "../../lib/types";
import type { LiveQuote } from "../../lib/stream";

/** Price an open position can be closed at: longs sell at the bid, shorts buy at the ask. */
export function markPrice(o: Pick<Order, "side">, q: LiveQuote | undefined) {
  if (!q) return undefined;
  return o.side === "long" ? q.bid : q.ask;
}

export function unrealizedPnl(o: Order, q: LiveQuote | undefined) {
  const mark = markPrice(o, q);
  if (mark === undefined) return undefined;
  // Isolated margin: losses are capped at the position's margin.
  return Math.max(pnlAt(o.side, o.openingPrice, mark, o.qty), -o.margin);
}

export function useAccountMetrics() {
  const balance = useBalance();
  const positions = useOpenPositions();
  const quotes = useQuotes();

  const open = positions.data ?? [];
  const usedMargin = open.reduce((s, o) => s + o.margin, 0);
  const upnl = open.reduce((s, o) => s + (unrealizedPnl(o, quotes[o.asset]) ?? 0), 0);
  const cash = balance.data?.balance ?? 0;
  const equity = cash + usedMargin + upnl;

  return {
    ready: balance.isSuccess,
    balance: cash,
    usedMargin,
    unrealizedPnl: upnl,
    equity,
    marginLevel: usedMargin > 0 ? (equity / usedMargin) * 100 : null,
    positions: open,
    quotes,
  };
}
