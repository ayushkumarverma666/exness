"use client";

import { MARKETS, type AssetSymbol } from "../../lib/markets";
import { useQuotes, useTickers } from "../../hooks/useMarket";
import { useMarketStream } from "../../lib/stream";
import { fmtPct, fmtPrice, pnlClass } from "../../lib/format";
import { MarketIcon } from "../MarketIcon";
import { cn } from "../../lib/cn";

export function Watchlist({ symbol, onSelect }: { symbol: AssetSymbol; onSelect: (s: AssetSymbol) => void }) {
  const { data: tickers } = useTickers();
  const quotes = useQuotes();
  const stream = useMarketStream();

  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3 text-xs">
        <span className="text-fg">Markets</span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stream.status === "live" ? "bg-up" : stream.status === "connecting" ? "bg-warn" : "bg-down"
            )}
          />
          {stream.status === "live" ? "Live" : stream.status === "connecting" ? "Connecting" : "Reconnecting"}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto] px-3 py-1.5 text-[11px] text-dim">
        <span>Symbol</span>
        <span className="text-right">Bid / Ask</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {MARKETS.map((m) => {
          const t = tickers?.find((x) => x.symbol === m.symbol);
          const q = quotes[m.symbol];
          return (
            <button
              key={m.symbol}
              onClick={() => onSelect(m.symbol)}
              className={cn(
                "grid w-full grid-cols-[1fr_auto] items-center gap-2 border-l-2 px-3 py-2.5 text-left hover:bg-panel-2",
                m.symbol === symbol ? "border-accent bg-panel-2" : "border-transparent"
              )}
            >
              <span className="flex items-center gap-2">
                <MarketIcon symbol={m.symbol} className="h-7 w-7" />
                <span>
                  <span className="block text-sm font-medium">{m.symbol}</span>
                  <span className={cn("block font-mono text-[11px]", pnlClass(t?.change24h))}>{fmtPct(t?.change24h)}</span>
                </span>
              </span>
              <span className="text-right font-mono text-[11px] tabular">
                <span className="block text-down">{fmtPrice(m.symbol, q?.bid)}</span>
                <span className="block text-up">{fmtPrice(m.symbol, q?.ask)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
