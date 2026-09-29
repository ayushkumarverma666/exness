import { Request, Response } from "express";
import { prisma } from "@repo/prisma";
import { DepositBalanceBodySchema } from "../schemas/balance.type";
import { engine } from "../lib/engineClient";
import { engineStatusCode, num, validationError } from "../lib/http";

export const getBalance = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const [assets, locked] = await Promise.all([
    prisma.asset.findMany({ where: { userId }, select: { symbol: true, balance: true } }),
    prisma.order.aggregate({ where: { userId, status: "open" }, _sum: { margin: true } }),
  ]);
  const usdc = assets.find((a) => a.symbol === "USDC");
  res.json({
    currency: "USDC",
    // Free balance: cash not currently locked as margin in open positions.
    balance: usdc ? Number(usdc.balance) : 0,
    usedMargin: num(locked._sum.margin) ?? 0,
    balances: assets.map((a) => ({ symbol: a.symbol, balance: Number(a.balance) })),
  });
};

export const depositBalance = async (req: Request, res: Response) => {
  const result = DepositBalanceBodySchema.safeParse(req.body);
  if (!result.success) return validationError(res, result.error);

  const reply = await engine.send("deposit", { userId: req.user!.id, amount: result.data.amount });
  if (reply.status !== "deposited") {
    return res.status(engineStatusCode[reply.status]).json({ error: reply.message || reply.status });
  }
  res.json({ message: "Deposit complete", balance: reply.data?.balance });
};

export const getTransactions = async (req: Request, res: Response) => {
  const rows = await prisma.transaction.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json({
    transactions: rows.map((t) => ({
      id: t.id,
      type: t.type,
      symbol: t.symbol,
      amount: Number(t.amount),
      balanceAfter: Number(t.balanceAfter),
      orderId: t.orderId,
      createdAt: t.createdAt.toISOString(),
    })),
  });
};
