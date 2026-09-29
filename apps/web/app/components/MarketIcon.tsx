import { SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";
import { MARKET_BY_SYMBOL, type AssetSymbol } from "../lib/markets";
import { cn } from "../lib/cn";

const ICONS = { BTC: SiBitcoin, ETH: SiEthereum, SOL: SiSolana };

export function MarketIcon({ symbol, className }: { symbol: AssetSymbol; className?: string }) {
  const Icon = ICONS[symbol];
  const color = MARKET_BY_SYMBOL[symbol].color;
  return (
    <span
      className={cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full", className)}
      style={{ background: `${color}22`, color }}
    >
      <Icon className="h-[55%] w-[55%]" />
    </span>
  );
}
