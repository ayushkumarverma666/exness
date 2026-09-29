"use client";

import { useMemo, useState } from "react";
import { useDepth, useQuotes, useRecentTrades } from "../../hooks/useMarket";
import { useMarketStream } from "../../lib/stream";
import { MARKET_BY_SYMBOL, type AssetSymbol } from "../../lib/markets";
import { fmtPrice, fmtQty, fmtTime } from "../../lib/format";
import { cn } from "../../lib/cn";

const LEVELS = 14;

function OrderBook({ symbol }: { symbol: AssetSymbol }) {
  const { data, isError } = useDepth(symbol);
  const quotes = useQuotes();
  const q = quotes[symbol];

  const { asks, bids, max } = useMemo(() => {
    const withTotals = (rows: [number, number][]) => {
      let total = 0;
      return rows.slice(0, LEVELS).map(([price, size]) => ({ price, size, total: (total += size) }));
    };
    const asks = withTotals(data?.asks ?? []);
    const bids = withTotals(data?.bids ?? []);
    return { asks: asks.reverse(), bids, max: Math.max(asks[0]?.total ?? 0, bids.at(-1)?.total ?? 0, 1e-9) };
  }, [data]);

  const spread = q ? q.ask - q.bid : undefined;
  const Row = ({ price, size, total, side }: { price: number; size: number; total: number; side: "ask" | "bid" }) => (
    <div className="relative grid grid-cols-3 px-3 py-[2px] font-mono text-[11px] tabular">
      <div
        className={cn("absolute inset-y-0 right-0", side === "ask" ? "bg-down/10" : "bg-up/10")}
        style={{ width: `${(total / max) * 100}%` }}
      />
      <span className={cn("relative", side === "ask" ? "text-down" : "text-up")}>{fmtPrice(symbol, price)}</span>
      <span className="relative text-right">{fmtQty(symbol, size)}</span>
      <span className="relative text-right text-muted">{fmtQty(symbol, total)}</span>
    </div>
  );

  if (isError) return <div className="p-4 text-center text-xs text-muted">Order book unavailable</div>;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-3 px-3 py-1.5 text-[11px] text-dim">
        <span>Price (USDC)</span>
        <span className="text-right">Size ({symbol})</span>
        <span className="text-right">Total</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
        {asks.map((r) => <Row key={`a${r.price}`} {...r} side="ask" />)}
      </div>
      <div className="flex items-center justify-between border-y border-line px-3 py-1.5">
        <span className="font-mono text-sm tabular">{fmtPrice(symbol, q ? (q.bid + q.ask) / 2 : undefined)}</span>
        <span className="font-mono text-[11px] text-muted">
          Spread {spread !== undefined ? spread.toFixed(MARKET_BY_SYMBOL[symbol].priceDp) : "—"}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {bids.map((r) => <Row key={`b${r.price}`} {...r} side="bid" />)}
      </div>
    </div>
  );
}

function Trades({ symbol }: { symbol: AssetSymbol }) {
  const { data: initial } = useRecentTrades(symbol);
  const stream = useMarketStream();
  const trades = useMemo(() => {
    const live = stream.trades[symbol] ?? [];
    const seen = new Set(live.map((t) => t.id));
    return [...live, ...(initial ?? []).filter((t) => !seen.has(t.id))].slice(0, 60);
  }, [stream.trades, symbol, initial]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-3 px-3 py-1.5 text-[11px] text-dim">
        <span>Price (USDC)</span>
        <span className="text-right">Size ({symbol})</span>
        <span className="text-right">Time</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {trades.map((t) => (
          <div key={t.id} className="grid grid-cols-3 px-3 py-[2px] font-mono text-[11px] tabular">
            <span className={t.side === "buy" ? "text-up" : "text-down"}>{fmtPrice(symbol, t.price)}</span>
            <span className="text-right">{fmtQty(symbol, t.qty)}</span>
            <span className="text-right text-muted">{fmtTime(t.ts)}</span>
          </div>
        ))}
        {trades.length === 0 && <div className="p-4 text-center text-xs text-muted">Waiting for trades…</div>}
      </div>
    </div>
  );
}

export function MarketDepth({ symbol }: { symbol: AssetSymbol }) {
  const [tab, setTab] = useState<"book" | "trades">("book");
  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center gap-4 border-b border-line px-3 text-xs">
        {(["book", "trades"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("h-full border-b-2", tab === t ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}
          >
            {t === "book" ? "Order book" : "Recent trades"}
          </button>
        ))}
      </div>
      {tab === "book" ? <OrderBook symbol={symbol} /> : <Trades symbol={symbol} />}
    </div>
  );
}
