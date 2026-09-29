"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api, apiError } from "../lib/api";
import type { BalanceResponse, Order, Stats, Transaction } from "../lib/types";
import type { AssetSymbol } from "../lib/markets";
import { useAuth } from "./useAuth";

const invalidateAccount = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === "account" });

export function useBalance() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["account", "balance"],
    queryFn: async () => (await api.get<BalanceResponse>("/balance")).data,
    enabled: isAuthenticated,
    refetchInterval: 5_000,
  });
}

export function useOpenPositions() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["account", "orders", "open"],
    queryFn: async () => (await api.get<{ orders: Order[] }>("/trade/orders?status=open")).data.orders,
    enabled: isAuthenticated,
    refetchInterval: 2_000,
  });
}

export function useOrderHistory(enabled = true) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["account", "orders", "closed"],
    queryFn: async () => (await api.get<{ orders: Order[] }>("/trade/orders?status=closed")).data.orders,
    enabled: isAuthenticated && enabled,
    refetchInterval: 5_000,
  });
}

export function useTransactions(enabled = true) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["account", "transactions"],
    queryFn: async () => (await api.get<{ transactions: Transaction[] }>("/balance/transactions")).data.transactions,
    enabled: isAuthenticated && enabled,
  });
}

export function useStats(enabled = true) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["account", "stats"],
    queryFn: async () => (await api.get<Stats>("/trade/stats")).data,
    enabled: isAuthenticated && enabled,
  });
}

export interface NewOrder {
  asset: AssetSymbol;
  side: "long" | "short";
  qty: number;
  leverage: number;
  takeProfit?: number;
  stopLoss?: number;
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: NewOrder) => (await api.post<{ order: Order }>("/trade/open", order)).data.order,
    onSuccess: (order) => {
      invalidateAccount(qc);
      if (order) {
        toast.success(
          `${order.side === "long" ? "Bought" : "Sold"} ${order.qty} ${order.asset} @ ${order.openingPrice.toLocaleString("en-US")}`
        );
      }
    },
    onError: (e) => toast.error(apiError(e, "Order rejected")),
  });
}

export function useClosePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post<{ order: Order }>(`/trade/close/${id}`)).data.order,
    onSuccess: (order) => {
      invalidateAccount(qc);
      if (order) {
        const pnl = order.pnl;
        toast.success(`Closed ${order.asset} ${order.side} · P&L ${pnl >= 0 ? "+" : "−"}$${Math.abs(pnl).toFixed(2)}`);
      }
    },
    onError: (e) => toast.error(apiError(e, "Could not close position")),
  });
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => (await api.post("/balance/deposit", { amount })).data,
    onSuccess: (_d, amount) => {
      invalidateAccount(qc);
      toast.success(`Added ${amount.toLocaleString("en-US")} USDC to your demo account`);
    },
    onError: (e) => toast.error(apiError(e, "Top-up failed")),
  });
}
