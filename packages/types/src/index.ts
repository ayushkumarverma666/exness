export type AssetSymbol = "BTC" | "ETH" | "SOL";
export type Side = "long" | "short";
export type CloseReason = "TakeProfit" | "StopLoss" | "Manual" | "Liquidation";

export interface MarketSpec {
  symbol: AssetSymbol;
  /** Symbol on the upstream exchange (Backpack). */
  pair: string;
  minQty: number;
  maxQty: number;
  qtyStep: number;
}

export const MARKETS: Record<AssetSymbol, MarketSpec> = {
  BTC: { symbol: "BTC", pair: "BTC_USDC", minQty: 0.0001, maxQty: 50, qtyStep: 0.0001 },
  ETH: { symbol: "ETH", pair: "ETH_USDC", minQty: 0.001, maxQty: 1000, qtyStep: 0.001 },
  SOL: { symbol: "SOL", pair: "SOL_USDC", minQty: 0.01, maxQty: 20000, qtyStep: 0.01 },
};

export const ASSET_SYMBOLS = Object.keys(MARKETS) as AssetSymbol[];
export const MAX_LEVERAGE = 100;
/** A position is liquidated once its remaining margin falls to this fraction of the initial margin. */
export const MAINTENANCE_MARGIN_RATIO = 0.05;
/** Prices older than this are considered stale and new orders are rejected. */
export const PRICE_STALE_MS = 30_000;
/** Demo accounts can top up to at most this much USDC in total. */
export const MAX_DEMO_BALANCE = 1_000_000;

export function pairToSymbol(pair: string): AssetSymbol | undefined {
  const base = pair.toUpperCase().split("_")[0];
  return base && base in MARKETS ? (base as AssetSymbol) : undefined;
}

/** Price at which an isolated-margin position is liquidated. */
export function liquidationPrice(side: Side, entry: number, leverage: number) {
  const move = (1 - MAINTENANCE_MARGIN_RATIO) / leverage;
  return side === "long" ? entry * (1 - move) : entry * (1 + move);
}

export function positionPnl(side: Side, entry: number, exit: number, qty: number) {
  return side === "long" ? (exit - entry) * qty : (entry - exit) * qty;
}

export type EngineRequest =
  | { kind: "price-update"; payload: { symbol: AssetSymbol; bid: number; ask: number; ts: number } }
  | {
      kind: "create-order";
      payload: {
        id: string;
        userId: string;
        asset: AssetSymbol;
        side: Side;
        qty: number;
        leverage: number;
        takeProfit?: number;
        stopLoss?: number;
      };
    }
  | { kind: "close-order"; payload: { id: string; orderId: string; userId: string } }
  | { kind: "deposit"; payload: { id: string; userId: string; amount: number } };

export type EngineStatus =
  | "created"
  | "closed"
  | "deposited"
  | "invalid_order"
  | "no_price"
  | "insufficient_balance"
  | "order_not_found"
  | "limit_exceeded"
  | "error";

export interface EngineReply {
  id: string;
  status: EngineStatus;
  message?: string;
  data?: Record<string, unknown>;
}
