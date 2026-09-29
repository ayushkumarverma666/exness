import { z } from "zod";
import { ASSET_SYMBOLS, MAX_LEVERAGE } from "@repo/types";

const optionalPrice = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce.number().positive().optional()
);

export const CreateOrderBodySchema = z.object({
  asset: z
    .string()
    .transform((s) => s.toUpperCase().split("_")[0])
    .pipe(z.enum(ASSET_SYMBOLS as [string, ...string[]])),
  side: z.enum(["long", "short"]),
  qty: z.coerce.number().positive(),
  leverage: z.coerce.number().int().min(1).max(MAX_LEVERAGE).default(1),
  takeProfit: optionalPrice,
  stopLoss: optionalPrice,
});

export const OrdersQuerySchema = z.object({
  status: z.enum(["open", "closed"]).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});
