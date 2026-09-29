export type AssetSymbol = "BTC" | "ETH" | "SOL";

export interface Market {
  symbol: AssetSymbol;
  pair: string;
  name: string;
  priceDp: number;
  qtyDp: number;
  minQty: number;
  maxQty: number;
  step: number;
  color: string;
}

// Must stay in sync with MARKETS in packages/types.
export const MARKETS: Market[] = [
  { symbol: "BTC", pair: "BTC_USDC", name: "Bitcoin", priceDp: 1, qtyDp: 4, minQty: 0.0001, maxQty: 50, step: 0.0001, color: "#f7931a" },
  { symbol: "ETH", pair: "ETH_USDC", name: "Ethereum", priceDp: 2, qtyDp: 3, minQty: 0.001, maxQty: 1000, step: 0.001, color: "#8c9eff" },
  { symbol: "SOL", pair: "SOL_USDC", name: "Solana", priceDp: 2, qtyDp: 2, minQty: 0.01, maxQty: 20000, step: 0.01, color: "#19fb9b" },
];

export const MARKET_BY_SYMBOL = Object.fromEntries(MARKETS.map((m) => [m.symbol, m])) as Record<AssetSymbol, Market>;

export const LEVERAGE_OPTIONS = [1, 2, 5, 10, 20, 50, 100];
export const MAINTENANCE_MARGIN_RATIO = 0.05;

export function liquidationPrice(side: "long" | "short", entry: number, leverage: number) {
  const move = (1 - MAINTENANCE_MARGIN_RATIO) / leverage;
  return side === "long" ? entry * (1 - move) : entry * (1 + move);
}

export function pnlAt(side: "long" | "short", entry: number, exit: number, qty: number) {
  return side === "long" ? (exit - entry) * qty : (entry - exit) * qty;
}

export function isAssetSymbol(s: string | null | undefined): s is AssetSymbol {
  return !!s && s in MARKET_BY_SYMBOL;
}
