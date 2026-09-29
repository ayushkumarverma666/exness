import { MARKET_BY_SYMBOL, type AssetSymbol } from "./markets";

const cache = new Map<string, Intl.NumberFormat>();
function nf(min: number, max: number, extra: Intl.NumberFormatOptions = {}) {
  const key = `${min}:${max}:${JSON.stringify(extra)}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-US", { minimumFractionDigits: min, maximumFractionDigits: max, ...extra });
    cache.set(key, f);
  }
  return f;
}

const isNum = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n);

export const fmtPrice = (symbol: AssetSymbol, n: number | null | undefined) => {
  if (!isNum(n)) return "—";
  const dp = MARKET_BY_SYMBOL[symbol].priceDp;
  return nf(dp, dp).format(n);
};

export const fmtQty = (symbol: AssetSymbol, n: number | null | undefined) =>
  isNum(n) ? nf(0, MARKET_BY_SYMBOL[symbol].qtyDp).format(n) : "—";

export const fmtUsd = (n: number | null | undefined, dp = 2) => (isNum(n) ? `$${nf(dp, dp).format(n)}` : "—");

export const fmtSignedUsd = (n: number | null | undefined, dp = 2) =>
  isNum(n) ? `${n > 0 ? "+" : n < 0 ? "−" : ""}$${nf(dp, dp).format(Math.abs(n))}` : "—";

export const fmtPct = (n: number | null | undefined, dp = 2, signed = true) =>
  isNum(n) ? `${signed && n > 0 ? "+" : ""}${nf(dp, dp).format(n)}%` : "—";

export const fmtCompact = (n: number | null | undefined) =>
  isNum(n) ? nf(0, 2, { notation: "compact" }).format(n) : "—";

export const fmtTime = (iso: string | number) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour12: false });

export const fmtDateTime = (iso: string | number) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });

export const pnlClass = (n: number | null | undefined) =>
  !isNum(n) || n === 0 ? "text-fg" : n > 0 ? "text-up" : "text-down";

export function floorToStep(n: number, step: number) {
  const dp = Math.max(0, -Math.floor(Math.log10(step)));
  return Number((Math.floor(n / step + 1e-9) * step).toFixed(dp));
}
