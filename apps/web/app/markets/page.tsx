import type { Metadata } from "next";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { MarketsTable } from "../components/site/LiveMarkets";
import { MARKETS, LEVERAGE_OPTIONS } from "../lib/markets";

export const metadata: Metadata = { title: "Markets" };

export default function MarketsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="mt-2 text-muted">Live quotes for every instrument available on the platform.</p>
        <div className="mt-8">
          <MarketsTable />
        </div>

        <h2 className="mt-16 text-xl font-semibold">Contract specifications</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-panel text-left text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-normal">Instrument</th>
                <th className="px-5 py-3 font-normal">Settlement</th>
                <th className="px-5 py-3 font-normal">Min size</th>
                <th className="px-5 py-3 font-normal">Max size</th>
                <th className="px-5 py-3 font-normal">Size step</th>
                <th className="px-5 py-3 font-normal">Leverage</th>
                <th className="px-5 py-3 font-normal">Margin mode</th>
                <th className="px-5 py-3 font-normal">Trading hours</th>
              </tr>
            </thead>
            <tbody>
              {MARKETS.map((m) => (
                <tr key={m.symbol} className="border-t border-line">
                  <td className="px-5 py-3 font-medium">{m.symbol}/USDC</td>
                  <td className="px-5 py-3 text-muted">USDC</td>
                  <td className="px-5 py-3 font-mono">{m.minQty} {m.symbol}</td>
                  <td className="px-5 py-3 font-mono">{m.maxQty.toLocaleString("en-US")} {m.symbol}</td>
                  <td className="px-5 py-3 font-mono">{m.step}</td>
                  <td className="px-5 py-3 font-mono">1× – {LEVERAGE_OPTIONS.at(-1)}×</td>
                  <td className="px-5 py-3 text-muted">Isolated</td>
                  <td className="px-5 py-3 text-muted">24/7</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-dim">
          Positions are liquidated when remaining margin falls to 5% of initial margin. No commission is charged; the
          cost of trading is the live bid/ask spread.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
