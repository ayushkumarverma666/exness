"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useDeposit } from "../../hooks/useAccount";
import { fmtUsd } from "../../lib/format";

const PRESETS = [1_000, 5_000, 10_000, 50_000];

export function DepositModal({ open, onClose, balance }: { open: boolean; onClose: () => void; balance: number }) {
  const [amount, setAmount] = useState("10000");
  const deposit = useDeposit();
  if (!open) return null;

  const value = Number(amount);
  const valid = value > 0 && value <= 100_000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-line-2 bg-panel p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top up demo funds</h2>
          <button onClick={onClose} className="text-muted hover:text-fg" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted">
          Virtual USDC for practice trading. Current balance {fmtUsd(balance)}.
        </p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`rounded-md border py-2 font-mono text-sm ${
                Number(amount) === p ? "border-accent bg-accent/10 text-fg" : "border-line-2 text-muted hover:text-fg"
              }`}
            >
              {p >= 1000 ? `${p / 1000}k` : p}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm text-muted">Amount</span>
          <div className="flex items-center rounded-md border border-line-2 bg-bg focus-within:border-accent">
            <input
              type="number"
              min={1}
              max={100000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 font-mono outline-none"
            />
            <span className="px-3 text-sm text-muted">USDC</span>
          </div>
          <span className="mt-1 block text-xs text-dim">Up to 100,000 per top-up and 1,000,000 in total.</span>
        </label>

        <button
          disabled={!valid || deposit.isPending}
          onClick={() => deposit.mutate(value, { onSuccess: onClose })}
          className="mt-6 w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {deposit.isPending ? "Processing…" : `Add ${valid ? value.toLocaleString("en-US") : ""} USDC`}
        </button>
      </div>
    </div>
  );
}
