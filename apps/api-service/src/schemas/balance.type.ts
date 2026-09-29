import { z } from "zod";

export const DepositBalanceBodySchema = z.object({
  amount: z.coerce.number().positive().max(100_000, "Maximum single top-up is 100,000 USDC"),
});
