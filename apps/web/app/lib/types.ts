import type { AssetSymbol } from "./markets";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  asset: AssetSymbol;
  side: "long" | "short";
  qty: number;
  leverage: number;
  openingPrice: number;
  closingPrice: number | null;
  margin: number;
  pnl: number;
  takeProfit: number | null;
  stopLoss: number | null;
  liquidationPrice: number;
  status: "open" | "closed";
  closeReason: "TakeProfit" | "StopLoss" | "Manual" | "Liquidation" | null;
  createdAt: string;
  closedAt: string | null;
}

export interface BalanceResponse {
  currency: "USDC";
  balance: number;
  usedMargin: number;
}

export interface Transaction {
  id: string;
  type: "Deposit" | "RealizedPnl";
  symbol: string;
  amount: number;
  balanceAfter: number;
  orderId: string | null;
  createdAt: string;
}

export interface Stats {
  trades: number;
  winRate: number;
  realizedPnl: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number | null;
}

export interface Ticker {
  symbol: AssetSymbol;
  bid: number | null;
  ask: number | null;
  lastPrice: number | null;
  open24h: number | null;
  high24h: number | null;
  low24h: number | null;
  change24h: number | null;
  volume24h: number | null;
  quoteVolume24h: number | null;
}

export interface Depth {
  bids: [number, number][];
  asks: [number, number][];
  ts: number;
}

export interface Trade {
  id: string;
  price: number;
  qty: number;
  side: "buy" | "sell";
  ts: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
