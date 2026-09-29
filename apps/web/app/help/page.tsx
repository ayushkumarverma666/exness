import type { Metadata } from "next";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { BRAND } from "../lib/brand";

export const metadata: Metadata = { title: "Help center" };

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "getting-started",
    title: "Getting started",
    body: (
      <>
        <p>
          Create an account and your demo wallet is credited with 10,000 USDC. Open the{" "}
          <a href="/trade" className="text-accent">trading terminal</a>, choose BTC, ETH or SOL, set your size and
          leverage, and press <strong>Buy</strong> (go long) or <strong>Sell</strong> (go short).
        </p>
        <p>
          You can top up your demo balance from the terminal at any time, up to a total of 1,000,000 USDC.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "How prices and fills work",
    body: (
      <>
        <p>
          Quotes are streamed live from a public crypto exchange order book. A buy (long) fills at the current
          <strong> ask</strong>; a sell (short) fills at the current <strong>bid</strong>. The difference between the
          two is the spread, which is the only trading cost. There is no commission.
        </p>
        <p>
          Open positions are valued at the price you could close them at: longs at the bid, shorts at the ask. If the
          live price feed is interrupted for more than 30 seconds, new orders are rejected until it recovers.
        </p>
      </>
    ),
  },
  {
    id: "margin",
    title: "Margin and leverage",
    body: (
      <>
        <p>
          Required margin = position size × entry price ÷ leverage. At 10× leverage, a 10,000 USDC position needs
          1,000 USDC of margin. The margin is locked while the position is open and returned, plus or minus your
          profit or loss, when it closes.
        </p>
        <p>
          Every position uses <strong>isolated margin</strong>: a losing trade can never take more than the margin
          allocated to it, and it never touches your other positions.
        </p>
      </>
    ),
  },
  {
    id: "liquidation",
    title: "Liquidation",
    body: (
      <>
        <p>
          A position is liquidated automatically when its remaining margin falls to 5% of the initial margin. The
          liquidation price is shown in the order ticket before you trade and on every open position.
        </p>
        <p>
          As a rule of thumb, at 100× leverage a move of just 0.95% against you liquidates the position; at 10× it
          takes a 9.5% move. Setting a stop-loss before the liquidation price limits the loss to less than your full
          margin.
        </p>
      </>
    ),
  },
  {
    id: "tpsl",
    title: "Take-profit and stop-loss",
    body: (
      <p>
        Take-profit and stop-loss levels are monitored by the matching engine on every price tick, even when you are
        offline. When the closing price (bid for longs, ask for shorts) reaches your level, the position is closed at
        the market price at that moment. In fast markets this can be slightly better or worse than your level.
      </p>
    ),
  },
  {
    id: "account",
    title: "Balance, equity and free margin",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Balance</strong>: cash that is not currently used as margin.</li>
        <li><strong>Used margin</strong>: margin locked in open positions.</li>
        <li><strong>Unrealized P&amp;L</strong>: profit or loss on open positions at current prices.</li>
        <li><strong>Equity</strong>: balance + used margin + unrealized P&amp;L. This is your account value.</li>
        <li><strong>Margin level</strong>: equity ÷ used margin × 100%.</li>
      </ul>
    ),
  },
  {
    id: "risk",
    title: "Risk disclosure",
    body: (
      <>
        <p>
          Leveraged trading carries a high level of risk. Small market movements can have a large impact on your
          position, and you can lose all of the margin committed to a trade. Past performance is not a guide to future
          results.
        </p>
        <p>
          {BRAND.name} currently offers demo accounts only. Balances are virtual USDC with no monetary value and cannot
          be withdrawn. Nothing on this platform is investment advice.
        </p>
      </>
    ),
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="md:sticky md:top-24 md:self-start">
          <h1 className="text-2xl font-semibold tracking-tight">Help center</h1>
          <nav className="mt-6 flex flex-col gap-2 text-sm">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-muted hover:text-fg">
                {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="max-w-3xl space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted [&_strong]:text-fg">{s.body}</div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
