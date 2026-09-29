"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAssetSymbol, type AssetSymbol } from "../lib/markets";
import { TerminalHeader } from "../components/terminal/TerminalHeader";
import { Watchlist } from "../components/terminal/Watchlist";
import { PriceChart } from "../components/terminal/PriceChart";
import { MarketDepth } from "../components/terminal/MarketDepth";
import { OrderTicket } from "../components/terminal/OrderTicket";
import { AccountPanel } from "../components/terminal/AccountPanel";

function Terminal() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get("symbol")?.toUpperCase();
  const symbol: AssetSymbol = isAssetSymbol(raw) ? raw : "BTC";

  const select = useCallback((s: AssetSymbol) => router.replace(`/trade?symbol=${s}`, { scroll: false }), [router]);

  return (
    <div className="flex min-h-screen flex-col bg-bg lg:h-screen lg:overflow-hidden">
      <TerminalHeader symbol={symbol} onSymbol={select} />
      <div
        className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-px bg-line lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_260px_300px] min-[1800px]:grid-cols-[230px_minmax(0,1fr)_270px_310px]"
      >
        <div className="hidden min-h-0 min-[1800px]:block">
          <Watchlist symbol={symbol} onSelect={select} />
        </div>

        <div className="flex min-h-0 flex-col gap-px">
          <div className="h-[420px] lg:h-auto lg:min-h-0 lg:flex-1">
            <PriceChart symbol={symbol} />
          </div>
          <div className="hidden h-[260px] shrink-0 lg:block">
            <AccountPanel onSelect={select} />
          </div>
        </div>

        <div className="hidden min-h-0 xl:block">
          <MarketDepth symbol={symbol} />
        </div>

        <div className="min-h-0">
          <OrderTicket symbol={symbol} />
        </div>

        {/* Stacked panels for smaller screens */}
        <div className="h-[420px] xl:hidden lg:hidden">
          <MarketDepth symbol={symbol} />
        </div>
        <div className="h-[360px] lg:hidden">
          <AccountPanel onSelect={select} />
        </div>
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense>
      <Terminal />
    </Suspense>
  );
}
