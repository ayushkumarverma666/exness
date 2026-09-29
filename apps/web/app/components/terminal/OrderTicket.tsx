"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePlaceOrder } from "../../hooks/useAccount";
import { useQuotes } from "../../hooks/useMarket";
import { LEVERAGE_OPTIONS, MARKET_BY_SYMBOL, liquidationPrice, pnlAt, type AssetSymbol } from "../../lib/markets";
import { floorToStep, fmtPct, fmtPrice, fmtQty, fmtSignedUsd, fmtUsd } from "../../lib/format";
import { cn } from "../../lib/cn";
import { useAccountMetrics } from "./useAccountMetrics";

type Side = "long" | "short";

function Row({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center justify-between py-[3px] text-xs">
      <span className="text-muted">{label}</span>
      <span className={cn("font-mono tabular", className)}>{value}</span>
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] text-muted">
        <span>{label}</span>
        {hint}
      </span>
      <input
        inputMode="decimal"
        placeholder="Not set"
        value={value}
        onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && onChange(e.target.value)}
        className={cn(
          "w-full rounded-md border bg-bg px-3 py-2 font-mono text-sm outline-none placeholder:text-dim",
          error ? "border-down" : "border-line-2 focus:border-accent"
        )}
      />
      {error && <span className="mt-1 block text-[11px] text-down">{error}</span>}
    </label>
  );
}

export function OrderTicket({ symbol }: { symbol: AssetSymbol }) {
  const market = MARKET_BY_SYMBOL[symbol];
  const { isAuthenticated } = useAuth();
  const quotes = useQuotes();
  const account = useAccountMetrics();
  const place = usePlaceOrder();

  const [side, setSide] = useState<Side>("long");
  const [qtyStr, setQtyStr] = useState(String(market.minQty * 10));
  const [leverage, setLeverage] = useState(10);
  const [tpStr, setTpStr] = useState("");
  const [slStr, setSlStr] = useState("");

  // Reset size and levels when switching markets.
  useEffect(() => {
    setQtyStr(String(Number((market.minQty * 10).toFixed(market.qtyDp))));
    setTpStr("");
    setSlStr("");
  }, [market]);

  const q = quotes[symbol];
  const fill = q ? (side === "long" ? q.ask : q.bid) : undefined;
  const qty = Number(qtyStr);
  const tp = tpStr ? Number(tpStr) : undefined;
  const sl = slStr ? Number(slStr) : undefined;

  const preview = useMemo(() => {
    if (!fill || !(qty > 0)) return null;
    const notional = fill * qty;
    const margin = notional / leverage;
    const liq = liquidationPrice(side, fill, leverage);
    const tpPnl = tp ? pnlAt(side, fill, tp, qty) : undefined;
    const slPnl = sl ? Math.max(pnlAt(side, fill, sl, qty), -margin) : undefined;
    const spreadCost = q ? (q.ask - q.bid) * qty : 0;
    return {
      notional,
      margin,
      liq,
      liqMovePct: (Math.abs(fill - liq) / fill) * 100,
      tpPnl,
      slPnl,
      maxLoss: slPnl ?? -margin,
      rr: tpPnl !== undefined && slPnl !== undefined && slPnl < 0 ? tpPnl / Math.abs(slPnl) : undefined,
      spreadCost,
      pctOfEquity: account.equity > 0 ? (margin / account.equity) * 100 : undefined,
    };
  }, [fill, qty, leverage, side, tp, sl, q, account.equity]);

  const long = side === "long";
  const qtyError =
    qtyStr === "" || !(qty > 0)
      ? "Enter a size"
      : qty < market.minQty
        ? `Minimum size is ${market.minQty} ${symbol}`
        : qty > market.maxQty
          ? `Maximum size is ${market.maxQty} ${symbol}`
          : undefined;
  const tpError =
    tp !== undefined && fill && (long ? tp <= fill : tp >= fill)
      ? `Must be ${long ? "above" : "below"} ${fmtPrice(symbol, fill)}`
      : undefined;
  const slError =
    sl !== undefined && fill && (long ? sl >= fill : sl <= fill)
      ? `Must be ${long ? "below" : "above"} ${fmtPrice(symbol, fill)}`
      : undefined;
  const slBeyondLiq = sl !== undefined && preview && !slError && (long ? sl <= preview.liq : sl >= preview.liq);
  const insufficient = isAuthenticated && account.ready && preview && preview.margin > account.balance;

  const disabledReason = !q
    ? "Waiting for price"
    : qtyError || tpError || slError || (insufficient ? "Insufficient balance" : undefined);

  const step = (dir: 1 | -1) => {
    const next = Math.min(market.maxQty, Math.max(market.minQty, (qty || 0) + dir * market.step));
    setQtyStr(String(Number(next.toFixed(market.qtyDp))));
  };

  const sizeFromPct = (pct: number) => {
    if (!fill) return;
    const raw = (account.balance * pct * leverage) / fill;
    const sized = Math.min(market.maxQty, floorToStep(raw * 0.999, market.step));
    if (sized >= market.minQty) setQtyStr(String(sized));
  };

  const submit = () => {
    if (disabledReason) return;
    place.mutate(
      { asset: symbol, side, qty, leverage, takeProfit: tp, stopLoss: sl },
      {
        onSuccess: () => {
          setTpStr("");
          setSlStr("");
        },
      }
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3 text-xs">
        <span>Market order</span>
        <span className="text-muted">Isolated · {symbol}/USDC</span>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {/* Sell / Buy quote buttons */}
        <div className="relative grid grid-cols-2 gap-2">
          {(["short", "long"] as const).map((s) => {
            const isLong = s === "long";
            const price = q ? (isLong ? q.ask : q.bid) : undefined;
            const active = side === s;
            return (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left transition-colors",
                  active
                    ? isLong
                      ? "border-up bg-up/15"
                      : "border-down bg-down/15"
                    : "border-line-2 hover:bg-panel-2",
                  isLong && "text-right"
                )}
              >
                <span className={cn("block text-[11px]", isLong ? "text-up" : "text-down")}>{isLong ? "Buy / Long" : "Sell / Short"}</span>
                <span className="block font-mono text-base tabular">{fmtPrice(symbol, price)}</span>
              </button>
            );
          })}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-line-2 bg-panel px-1.5 font-mono text-[10px] text-muted">
            {q ? (q.ask - q.bid).toFixed(market.priceDp) : "—"}
          </span>
        </div>

        {/* Size */}
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted">
            <span>Size</span>
            <span>
              ≈ {fmtUsd(preview?.notional)}
            </span>
          </div>
          <div className={cn("flex items-center rounded-md border bg-bg", qtyError && qtyStr !== "" ? "border-down" : "border-line-2 focus-within:border-accent")}>
            <button onClick={() => step(-1)} className="px-2.5 py-2 text-muted hover:text-fg" aria-label="Decrease size">
              <Minus size={14} />
            </button>
            <input
              inputMode="decimal"
              value={qtyStr}
              onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setQtyStr(e.target.value)}
              onBlur={() => qty > 0 && setQtyStr(String(floorToStep(qty, market.step)))}
              className="w-full bg-transparent py-2 text-center font-mono text-sm outline-none"
            />
            <span className="pr-1 text-xs text-muted">{symbol}</span>
            <button onClick={() => step(1)} className="px-2.5 py-2 text-muted hover:text-fg" aria-label="Increase size">
              <Plus size={14} />
            </button>
          </div>
          {isAuthenticated && (
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[0.1, 0.25, 0.5, 1].map((p) => (
                <button
                  key={p}
                  onClick={() => sizeFromPct(p)}
                  className="rounded border border-line-2 py-1 font-mono text-[11px] text-muted hover:text-fg"
                >
                  {p * 100}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leverage */}
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted">
            <span>Leverage</span>
            <span className={cn("font-mono", leverage >= 50 ? "text-warn" : "text-fg")}>1:{leverage}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {LEVERAGE_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => setLeverage(l)}
                className={cn(
                  "rounded border py-1 font-mono text-[11px]",
                  leverage === l ? "border-accent bg-accent/15 text-fg" : "border-line-2 text-muted hover:text-fg"
                )}
              >
                {l}×
              </button>
            ))}
          </div>
        </div>

        {/* TP / SL */}
        <div className="grid grid-cols-2 gap-2">
          <PriceInput
            label="Take profit"
            value={tpStr}
            onChange={setTpStr}
            error={tpError}
            hint={preview?.tpPnl !== undefined && !tpError ? <span className="text-up">{fmtSignedUsd(preview.tpPnl)}</span> : undefined}
          />
          <PriceInput
            label="Stop loss"
            value={slStr}
            onChange={setSlStr}
            error={slError}
            hint={preview?.slPnl !== undefined && !slError ? <span className="text-down">{fmtSignedUsd(preview.slPnl)}</span> : undefined}
          />
        </div>

        {/* Risk preview */}
        <div className="rounded-md border border-line bg-bg/60 p-3">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-dim">Risk preview</div>
          <Row label={`Fill price (${long ? "ask" : "bid"})`} value={fmtPrice(symbol, fill)} />
          <Row label="Position value" value={fmtUsd(preview?.notional)} />
          <Row label="Required margin" value={fmtUsd(preview?.margin)} className={insufficient ? "text-down" : undefined} />
          <Row
            label="Liquidation price"
            value={preview ? `${fmtPrice(symbol, preview.liq)} (${long ? "−" : "+"}${preview.liqMovePct.toFixed(2)}%)` : "—"}
            className="text-warn"
          />
          <Row label="Max loss" value={fmtSignedUsd(preview?.maxLoss)} className="text-down" />
          <Row label="Reward : risk" value={preview?.rr !== undefined ? `${preview.rr.toFixed(2)} : 1` : "—"} />
          <Row label="Spread cost" value={fmtUsd(preview?.spreadCost)} className="text-muted" />
          {isAuthenticated && <Row label="Margin / equity" value={fmtPct(preview?.pctOfEquity, 1, false)} />}
        </div>

        {preview && (leverage >= 50 || slBeyondLiq || !sl || (preview.pctOfEquity ?? 0) > 25) && (
          <div className="flex gap-2 rounded-md border border-warn/30 bg-warn/10 p-2.5 text-[11px] leading-relaxed text-warn">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              {slBeyondLiq
                ? "Your stop loss is beyond the liquidation price. The position will be liquidated first."
                : !sl
                  ? `No stop loss: a ${preview.liqMovePct.toFixed(2)}% move against you loses the full ${fmtUsd(preview.margin)} margin.`
                  : (preview.pctOfEquity ?? 0) > 25
                    ? `This trade commits ${preview.pctOfEquity!.toFixed(0)}% of your equity as margin.`
                    : `High leverage: a ${preview.liqMovePct.toFixed(2)}% move liquidates this position.`}
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-line p-3">
        {isAuthenticated ? (
          <>
            <button
              onClick={submit}
              disabled={!!disabledReason || place.isPending}
              className={cn(
                "w-full rounded-md py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
                long ? "bg-up hover:bg-up/90" : "bg-down hover:bg-down/90"
              )}
            >
              {place.isPending
                ? "Placing order…"
                : disabledReason && qtyStr !== ""
                  ? disabledReason
                  : `${long ? "Buy" : "Sell"} ${fmtQty(symbol, qty)} ${symbol}`}
            </button>
            <div className="mt-2 flex justify-between text-[11px] text-muted">
              <span>Available</span>
              <span className="font-mono">{fmtUsd(account.balance)}</span>
            </div>
          </>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(`/trade?symbol=${symbol}`)}`}
            className="block w-full rounded-md bg-accent py-3 text-center text-sm font-semibold text-white"
          >
            Log in to trade
          </Link>
        )}
        <p className="mt-2 text-center text-[10px] text-dim">
          Market orders fill instantly at the live {long ? "ask" : "bid"}.
        </p>
      </div>
    </div>
  );
}
