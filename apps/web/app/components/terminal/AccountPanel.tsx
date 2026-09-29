"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useClosePosition, useOrderHistory, useStats, useTransactions } from "../../hooks/useAccount";
import { api } from "../../lib/api";
import type { Order } from "../../lib/types";
import { fmtDateTime, fmtPct, fmtPrice, fmtQty, fmtSignedUsd, fmtUsd, pnlClass } from "../../lib/format";
import { cn } from "../../lib/cn";
import { MarketIcon } from "../MarketIcon";
import { markPrice, unrealizedPnl, useAccountMetrics } from "./useAccountMetrics";
import type { AssetSymbol } from "../../lib/markets";

type Tab = "positions" | "history" | "ledger" | "performance";

const REASON_LABEL: Record<string, { label: string; className: string }> = {
  TakeProfit: { label: "Take profit", className: "bg-up/15 text-up" },
  StopLoss: { label: "Stop loss", className: "bg-down/15 text-down" },
  Liquidation: { label: "Liquidated", className: "bg-warn/15 text-warn" },
  Manual: { label: "Manual", className: "bg-panel-2 text-muted" },
};

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return <th className={cn("whitespace-nowrap px-2 py-2 font-normal", right && "text-right")}>{children}</th>;
}
function Td({ children, right, className }: { children?: React.ReactNode; right?: boolean; className?: string }) {
  return <td className={cn("whitespace-nowrap px-2 py-2", right && "text-right font-mono tabular", className)}>{children}</td>;
}

function SideTag({ side }: { side: Order["side"] }) {
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium", side === "long" ? "bg-up/15 text-up" : "bg-down/15 text-down")}>
      {side === "long" ? "Long" : "Short"}
    </span>
  );
}

function Market({ symbol, leverage }: { symbol: AssetSymbol; leverage: number }) {
  return (
    <span className="flex items-center gap-2">
      <MarketIcon symbol={symbol} className="h-5 w-5" />
      <span className="font-medium">{symbol}/USDC</span>
      <span className="font-mono text-[11px] text-muted">{leverage}×</span>
    </span>
  );
}

/** Notifies the trader when the engine closes a position (TP, SL or liquidation). */
function usePositionAlerts(positions: Order[] | undefined) {
  const qc = useQueryClient();
  const prev = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!positions) return;
    const current = new Set(positions.map((p) => p.id));
    const removed = prev.current ? [...prev.current].filter((id) => !current.has(id)) : [];
    prev.current = current;

    for (const id of removed) {
      api
        .get<{ order: Order }>(`/trade/orders/${id}`)
        .then(({ data: { order } }) => {
          if (!order.closeReason || order.closeReason === "Manual") return;
          const text = `${order.asset} ${order.side} · ${REASON_LABEL[order.closeReason]!.label} · P&L ${fmtSignedUsd(order.pnl)}`;
          if (order.closeReason === "TakeProfit") toast.success(text, { duration: 6000 });
          else toast.error(text, { duration: 8000 });
          qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === "account" });
        })
        .catch(() => {});
    }
  }, [positions, qc]);
}

function Positions({ onSelect }: { onSelect: (s: AssetSymbol) => void }) {
  const { positions, quotes, unrealizedPnl: total, usedMargin } = useAccountMetrics();
  const close = useClosePosition();
  const [closingAll, setClosingAll] = useState(false);

  const closeAll = async () => {
    setClosingAll(true);
    for (const p of positions) await close.mutateAsync(p.id).catch(() => {});
    setClosingAll(false);
  };

  if (positions.length === 0) {
    return <div className="flex h-full items-center justify-center text-xs text-muted">No open positions</div>;
  }

  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-panel text-left text-[11px] text-dim">
        <tr>
          <Th>Market</Th>
          <Th right>Size</Th>
          <Th right>Entry</Th>
          <Th right>Mark</Th>
          <Th right>Liq. price</Th>
          <Th right>TP / SL</Th>
          <Th right>Margin</Th>
          <Th right>P&amp;L (ROE)</Th>
          <Th right>
            <button
              onClick={closeAll}
              disabled={closingAll}
              className="rounded border border-line-2 px-2 py-0.5 text-[11px] text-muted hover:text-fg disabled:opacity-50"
            >
              {closingAll ? "Closing…" : "Close all"}
            </button>
          </Th>
        </tr>
      </thead>
      <tbody>
        {positions.map((p) => {
          const q = quotes[p.asset];
          const pnl = unrealizedPnl(p, q);
          return (
            <tr key={p.id} className="border-t border-line hover:bg-panel-2/60">
              <Td>
                <button onClick={() => onSelect(p.asset)} className="flex items-center gap-2">
                  <Market symbol={p.asset} leverage={p.leverage} />
                  <SideTag side={p.side} />
                </button>
              </Td>
              <Td right>{fmtQty(p.asset, p.qty)}</Td>
              <Td right>{fmtPrice(p.asset, p.openingPrice)}</Td>
              <Td right>{fmtPrice(p.asset, markPrice(p, q))}</Td>
              <Td right className="text-warn">{fmtPrice(p.asset, p.liquidationPrice)}</Td>
              <Td right>
                <span className="text-up">{p.takeProfit ? fmtPrice(p.asset, p.takeProfit) : "—"}</span>
                {" / "}
                <span className="text-down">{p.stopLoss ? fmtPrice(p.asset, p.stopLoss) : "—"}</span>
              </Td>
              <Td right>{fmtUsd(p.margin)}</Td>
              <Td right className={pnlClass(pnl)}>
                {fmtSignedUsd(pnl)}{" "}
                <span className="text-[11px] opacity-80">({pnl !== undefined ? fmtPct((pnl / p.margin) * 100) : "—"})</span>
              </Td>
              <Td right>
                <button
                  onClick={() => close.mutate(p.id)}
                  disabled={close.isPending && close.variables === p.id}
                  className="rounded border border-line-2 px-2 py-0.5 text-[11px] hover:border-down hover:text-down disabled:opacity-50"
                >
                  Close
                </button>
              </Td>
            </tr>
          );
        })}
        <tr className="border-t border-line text-muted">
          <Td>Total</Td>
          <Td /><Td /><Td /><Td /><Td />
          <Td right>{fmtUsd(usedMargin)}</Td>
          <Td right className={pnlClass(total)}>{fmtSignedUsd(total)}</Td>
          <Td />
        </tr>
      </tbody>
    </table>
  );
}

function History() {
  const { data, isLoading } = useOrderHistory();
  if (isLoading) return <div className="p-4 text-xs text-muted">Loading…</div>;
  if (!data?.length) return <div className="flex h-full items-center justify-center text-xs text-muted">No closed trades yet</div>;
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-panel text-left text-[11px] text-dim">
        <tr>
          <Th>Market</Th>
          <Th>Side</Th>
          <Th right>Size</Th>
          <Th right>Entry</Th>
          <Th right>Exit</Th>
          <Th right>Realized P&amp;L</Th>
          <Th>Closed by</Th>
          <Th>Opened</Th>
          <Th>Closed</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((o) => {
          const reason = REASON_LABEL[o.closeReason ?? "Manual"]!;
          return (
            <tr key={o.id} className="border-t border-line">
              <Td><Market symbol={o.asset} leverage={o.leverage} /></Td>
              <Td><SideTag side={o.side} /></Td>
              <Td right>{fmtQty(o.asset, o.qty)}</Td>
              <Td right>{fmtPrice(o.asset, o.openingPrice)}</Td>
              <Td right>{fmtPrice(o.asset, o.closingPrice)}</Td>
              <Td right className={pnlClass(o.pnl)}>
                {fmtSignedUsd(o.pnl)} <span className="text-[11px] opacity-80">({fmtPct((o.pnl / o.margin) * 100)})</span>
              </Td>
              <Td><span className={cn("rounded px-1.5 py-0.5 text-[11px]", reason.className)}>{reason.label}</span></Td>
              <Td className="text-muted">{fmtDateTime(o.createdAt)}</Td>
              <Td className="text-muted">{o.closedAt ? fmtDateTime(o.closedAt) : "—"}</Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Ledger() {
  const { data, isLoading } = useTransactions();
  if (isLoading) return <div className="p-4 text-xs text-muted">Loading…</div>;
  if (!data?.length) return <div className="flex h-full items-center justify-center text-xs text-muted">No transactions yet</div>;
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-panel text-left text-[11px] text-dim">
        <tr>
          <Th>Time</Th>
          <Th>Type</Th>
          <Th right>Amount</Th>
          <Th right>Balance after</Th>
          <Th>Reference</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((t) => (
          <tr key={t.id} className="border-t border-line">
            <Td className="text-muted">{fmtDateTime(t.createdAt)}</Td>
            <Td>{t.type === "Deposit" ? "Deposit" : "Realized P&L"}</Td>
            <Td right className={pnlClass(t.amount)}>{fmtSignedUsd(t.amount)}</Td>
            <Td right>{fmtUsd(t.balanceAfter)}</Td>
            <Td className="font-mono text-[11px] text-dim">{t.orderId ? t.orderId.slice(0, 8) : "—"}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Performance() {
  const { data } = useStats();
  const cards: [string, React.ReactNode, string?][] = [
    ["Closed trades", data?.trades ?? "—"],
    ["Win rate", data ? fmtPct(data.winRate * 100, 1, false) : "—"],
    ["Realized P&L", data ? fmtSignedUsd(data.realizedPnl) : "—", pnlClass(data?.realizedPnl)],
    ["Average win", data ? fmtSignedUsd(data.avgWin) : "—", "text-up"],
    ["Average loss", data ? fmtSignedUsd(data.avgLoss) : "—", "text-down"],
    ["Profit factor", data?.profitFactor != null ? data.profitFactor.toFixed(2) : "—"],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map(([label, value, className]) => (
        <div key={label} className="rounded-md border border-line bg-bg/50 p-3">
          <div className="text-[11px] text-muted">{label}</div>
          <div className={cn("mt-1 font-mono text-lg tabular", className)}>{value}</div>
        </div>
      ))}
    </div>
  );
}

export function AccountPanel({ onSelect }: { onSelect: (s: AssetSymbol) => void }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { positions } = useAccountMetrics();
  const [tab, setTab] = useState<Tab>("positions");
  usePositionAlerts(isAuthenticated ? positions : undefined);

  const tabs: [Tab, string][] = [
    ["positions", `Positions (${positions.length})`],
    ["history", "Trade history"],
    ["ledger", "Transactions"],
    ["performance", "Performance"],
  ];

  return (
    <div className="flex h-full min-h-0 flex-col bg-panel">
      <div className="flex h-9 shrink-0 items-center gap-5 overflow-x-auto border-b border-line px-3 text-xs">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "h-full whitespace-nowrap border-b-2",
              tab === key ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {!isAuthenticated ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-xs text-muted">
            {isLoading ? "Loading…" : (
              <>
                Log in to see your positions and account history.
                <Link href="/login?next=/trade" className="rounded-md bg-accent px-4 py-1.5 text-white">Log in</Link>
              </>
            )}
          </div>
        ) : tab === "positions" ? (
          <Positions onSelect={onSelect} />
        ) : tab === "history" ? (
          <History />
        ) : tab === "ledger" ? (
          <Ledger />
        ) : (
          <Performance />
        )}
      </div>
    </div>
  );
}
