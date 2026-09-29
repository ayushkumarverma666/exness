"use client";

import Link from "next/link";
import { MARKETS } from "../../lib/markets";
import { useQuotes, useTickers } from "../../hooks/useMarket";
import { useMarketStream } from "../../lib/stream";
import { fmtCompact, fmtPct, fmtPrice, pnlClass } from "../../lib/format";
import { MarketIcon } from "../MarketIcon";
import { cn } from "../../lib/cn";

export function LiveMarketCards() {
  const { data: tickers } = useTickers();
  const quotes = useQuotes();
  const stream = useMarketStream();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {MARKETS.map((m) => {
        const t = tickers?.find((x) => x.symbol === m.symbol);
        const q = quotes[m.symbol];
        const price = stream.last[m.symbol] ?? (q ? (q.bid + q.ask) / 2 : t?.lastPrice);
        return (
          <Link
            key={m.symbol}
            href={`/trade?symbol=${m.symbol}`}
            className="group rounded-xl border border-line bg-panel p-5 transition-colors hover:border-line-2 hover:bg-panel-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MarketIcon symbol={m.symbol} className="h-9 w-9" />
                <div>
                  <div className="font-medium">{m.symbol}/USDC</div>
                  <div className="text-xs text-muted">{m.name}</div>
                </div>
              </div>
              <span className={cn("rounded px-2 py-1 font-mono text-xs", pnlClass(t?.change24h), "bg-panel-2")}>
                {fmtPct(t?.change24h)}
              </span>
            </div>
            <div className="mt-5 font-mono text-2xl tabular">{fmtPrice(m.symbol, price)}</div>
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>24h vol {fmtCompact(t?.quoteVolume24h)} USDC</span>
              <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100">Trade →</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function MarketsTable() {
  const { data: tickers, isLoading } = useTickers();
  const quotes = useQuotes();

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-panel text-left text-xs text-muted">
          <tr>
            <th className="px-5 py-3 font-normal">Market</th>
            <th className="px-5 py-3 text-right font-normal">Bid</th>
            <th className="px-5 py-3 text-right font-normal">Ask</th>
            <th className="px-5 py-3 text-right font-normal">24h change</th>
            <th className="px-5 py-3 text-right font-normal">24h high / low</th>
            <th className="px-5 py-3 text-right font-normal">24h volume</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {MARKETS.map((m) => {
            const t = tickers?.find((x) => x.symbol === m.symbol);
            const q = quotes[m.symbol];
            return (
              <tr key={m.symbol} className="border-t border-line">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <MarketIcon symbol={m.symbol} />
                    <span className="font-medium">{m.symbol}/USDC</span>
                    <span className="text-muted">{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-mono tabular text-down">{fmtPrice(m.symbol, q?.bid)}</td>
                <td className="px-5 py-4 text-right font-mono tabular text-up">{fmtPrice(m.symbol, q?.ask)}</td>
                <td className={cn("px-5 py-4 text-right font-mono tabular", pnlClass(t?.change24h))}>
                  {isLoading ? "…" : fmtPct(t?.change24h)}
                </td>
                <td className="px-5 py-4 text-right font-mono tabular text-muted">
                  {fmtPrice(m.symbol, t?.high24h)} / {fmtPrice(m.symbol, t?.low24h)}
                </td>
                <td className="px-5 py-4 text-right font-mono tabular text-muted">{fmtCompact(t?.quoteVolume24h)}</td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/trade?symbol=${m.symbol}`} className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white">
                    Trade
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
