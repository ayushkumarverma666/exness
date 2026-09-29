import Link from "next/link";
import { Activity, Gauge, ShieldCheck, Target, ReceiptText, Zap } from "lucide-react";
import { SiteHeader } from "./components/site/SiteHeader";
import { SiteFooter } from "./components/site/SiteFooter";
import { LiveMarketCards } from "./components/site/LiveMarkets";
import { BRAND } from "./lib/brand";

const FEATURES = [
  {
    icon: Activity,
    title: "Live exchange pricing",
    body: "Bid and ask stream in real time from a public order book. Longs fill at the ask, shorts at the bid, exactly like a real market.",
  },
  {
    icon: Gauge,
    title: "Risk preview before every trade",
    body: "See required margin, liquidation price, the move that would wipe you out and your reward-to-risk ratio before you click buy.",
  },
  {
    icon: ShieldCheck,
    title: "Isolated margin, capped loss",
    body: "Each position has its own margin. The most you can ever lose on a trade is the margin you put up for it.",
  },
  {
    icon: Target,
    title: "Server-side TP, SL & liquidation",
    body: "Take-profit, stop-loss and liquidation run in the matching engine on every tick, even when your browser is closed.",
  },
  {
    icon: ReceiptText,
    title: "Complete account ledger",
    body: "Every deposit and realized P&L is recorded with the balance after it, so your account history always adds up.",
  },
  {
    icon: Zap,
    title: "Up to 100× leverage",
    body: "Trade BTC, ETH and SOL against USDC with leverage from 1× to 100×. Start with conservative settings and scale up.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(91,130,255,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-6 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-panel px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up" /> Markets open 24/7
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted md:text-lg">
              A professional margin-trading terminal for Bitcoin, Ethereum and Solana. Every account starts with
              10,000 USDC in demo funds, so you can learn with real prices and no real money.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-accent/90">
                Open free demo account
              </Link>
              <Link href="/trade" className="rounded-md border border-line-2 px-6 py-3 font-medium hover:bg-panel-2">
                Explore the terminal
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <LiveMarketCards />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Built around risk, not hype</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Most retail platforms hide the numbers that matter. {BRAND.name} puts them in front of you.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-panel p-6">
                <f.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-3 md:px-6">
          {[
            ["1", "Create an account", "Sign up in seconds. Your demo account is funded with 10,000 USDC immediately."],
            ["2", "Plan the trade", "Pick a market, set size, leverage, take-profit and stop-loss, and check the risk preview."],
            ["3", "Execute & manage", "Orders fill instantly at the live price. Track P&L, close positions or let TP/SL work for you."],
          ].map(([n, title, body]) => (
            <div key={n}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line-2 font-mono text-sm">{n}</div>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-line bg-gradient-to-r from-panel to-panel-2 p-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold">Ready to place your first trade?</h3>
              <p className="mt-1 text-sm text-muted">No card, no deposit, no risk to your savings.</p>
            </div>
            <Link href="/register" className="rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-accent/90">
              Get started
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
