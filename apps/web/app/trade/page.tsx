"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAssetSymbol, type AssetSymbol } from "../lib/markets";
import { TerminalHeader } from "../components/terminal/TerminalHeader";
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

      {/*
        One tree, rearranged with grid areas:
        mobile  chart / ticket / book / panel (stacked)
        lg      chart+panel on the left, ticket full height on the right (book hidden)
        xl      chart | book | ticket on top, panel under chart and book
      */}
      <div
        className={[
          "grid flex-1 gap-1 bg-bg p-1",
          "grid-cols-[minmax(0,1fr)] [grid-template-areas:'chart'_'ticket'_'book'_'panel']",
          "lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-[minmax(0,1fr)_clamp(220px,34vh,340px)]",
          "lg:[grid-template-areas:'chart_ticket'_'panel_ticket']",
          "xl:grid-cols-[minmax(0,1fr)_280px_320px] xl:[grid-template-areas:'chart_book_ticket'_'panel_panel_ticket']",
        ].join(" ")}
      >
        <div className="h-[55vh] min-h-[360px] [grid-area:chart] overflow-hidden rounded-lg border border-line lg:h-auto lg:min-h-0">
          <PriceChart symbol={symbol} />
        </div>
        <div className="h-[420px] [grid-area:book] overflow-hidden rounded-lg border border-line lg:hidden xl:block xl:h-auto xl:min-h-0">
          <MarketDepth symbol={symbol} />
        </div>
        <div className="h-[380px] [grid-area:panel] overflow-hidden rounded-lg border border-line lg:h-auto lg:min-h-0">
          <AccountPanel onSelect={select} />
        </div>
        <div className="[grid-area:ticket] overflow-hidden rounded-lg border border-line lg:min-h-0">
          <OrderTicket symbol={symbol} />
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
