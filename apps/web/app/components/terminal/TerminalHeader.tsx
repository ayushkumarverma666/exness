"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { Logo } from "../Logo";
import { MarketIcon } from "../MarketIcon";
import { MARKETS, MARKET_BY_SYMBOL, type AssetSymbol } from "../../lib/markets";
import { useTickers } from "../../hooks/useMarket";
import { useAuth } from "../../hooks/useAuth";
import { useMarketStream } from "../../lib/stream";
import { fmtCompact, fmtPct, fmtPrice, fmtSignedUsd, fmtUsd, pnlClass } from "../../lib/format";
import { cn } from "../../lib/cn";
import { useAccountMetrics } from "./useAccountMetrics";
import { DepositModal } from "./DepositModal";

function Stat({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] text-dim">{label}</span>
      <span className={cn("font-mono text-xs tabular", className)}>{value}</span>
    </div>
  );
}

function MarketSelector({ symbol, onChange }: { symbol: AssetSymbol; onChange: (s: AssetSymbol) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: tickers } = useTickers();
  const stream = useMarketStream();

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-panel-2"
      >
        <MarketIcon symbol={symbol} />
        <span className="font-semibold">{symbol}/USDC</span>
        <ChevronDown size={16} className="text-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-line-2 bg-panel p-1 shadow-2xl">
          {MARKETS.map((m) => {
            const t = tickers?.find((x) => x.symbol === m.symbol);
            return (
              <button
                key={m.symbol}
                onClick={() => {
                  onChange(m.symbol);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left hover:bg-panel-2",
                  m.symbol === symbol && "bg-panel-2"
                )}
              >
                <span className="flex items-center gap-2">
                  <MarketIcon symbol={m.symbol} />
                  <span>
                    <span className="block text-sm font-medium">{m.symbol}/USDC</span>
                    <span className="block text-xs text-muted">{m.name}</span>
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-sm tabular">
                    {fmtPrice(m.symbol, stream.last[m.symbol] ?? t?.lastPrice)}
                  </span>
                  <span className={cn("block font-mono text-xs", pnlClass(t?.change24h))}>{fmtPct(t?.change24h)}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LastPrice({ symbol }: { symbol: AssetSymbol }) {
  const stream = useMarketStream();
  const { data: tickers } = useTickers();
  const price = stream.last[symbol] ?? tickers?.find((t) => t.symbol === symbol)?.lastPrice ?? null;
  const prev = useRef<number | null>(null);
  const [dir, setDir] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price != null && prev.current != null && price !== prev.current) setDir(price > prev.current ? "up" : "down");
    prev.current = price;
  }, [price]);

  return (
    <span className={cn("font-mono text-lg font-medium tabular", dir === "up" ? "text-up" : dir === "down" ? "text-down" : "text-fg")}>
      {fmtPrice(symbol, price)}
    </span>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent"
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-line-2 bg-panel p-1 shadow-2xl">
          <div className="border-b border-line px-3 py-2">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-muted">{user.email}</div>
          </div>
          <Link href="/help" className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-panel-2 hover:text-fg">
            Help center
          </Link>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted hover:bg-panel-2 hover:text-fg"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function TerminalHeader({ symbol, onSymbol }: { symbol: AssetSymbol; onSymbol: (s: AssetSymbol) => void }) {
  const { isAuthenticated } = useAuth();
  const { data: tickers } = useTickers();
  const t = tickers?.find((x) => x.symbol === symbol);
  const m = useAccountMetrics();
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-panel px-3 sm:gap-4">
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="hidden h-6 w-px bg-line md:block" />
      <MarketSelector symbol={symbol} onChange={onSymbol} />
      <LastPrice symbol={symbol} />

      <div className="hidden items-center gap-5 lg:flex">
        <Stat label="24h change" value={fmtPct(t?.change24h)} className={pnlClass(t?.change24h)} />
        <Stat label="24h high" value={fmtPrice(symbol, t?.high24h)} />
        <Stat label="24h low" value={fmtPrice(symbol, t?.low24h)} />
        <Stat label={`24h vol (${MARKET_BY_SYMBOL[symbol].symbol})`} value={fmtCompact(t?.volume24h)} />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            <div className="hidden items-center gap-5 xl:flex">
              <Stat label="Balance" value={fmtUsd(m.balance)} />
              <Stat label="Equity" value={fmtUsd(m.equity)} />
              <Stat label="Used margin" value={fmtUsd(m.usedMargin)} />
              <Stat label="Unrealized P&L" value={fmtSignedUsd(m.unrealizedPnl)} className={pnlClass(m.unrealizedPnl)} />
              <Stat
                label="Margin level"
                value={m.marginLevel == null ? "—" : `${m.marginLevel.toFixed(0)}%`}
                className={m.marginLevel != null && m.marginLevel < 150 ? "text-warn" : undefined}
              />
            </div>
            <span className="hidden rounded bg-warn/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-warn sm:inline">
              DEMO
            </span>
            <button
              onClick={() => setDepositOpen(true)}
              className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90"
            >
              <Wallet size={15} /> <span className="hidden sm:inline">Deposit</span>
            </button>
            <UserMenu />
          </>
        ) : (
          <>
            <Link href="/login?next=/trade" className="text-sm text-muted hover:text-fg">
              Log in
            </Link>
            <Link href="/register?next=/trade" className="hidden rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white sm:inline-block">
              Sign up
            </Link>
          </>
        )}
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} balance={m.balance} />
    </header>
  );
}
