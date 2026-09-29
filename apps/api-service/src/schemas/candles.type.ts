import { z } from "zod";

export const INTERVALS = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d", "1w"] as const;

export const GetCandlesQuerySchema = z.object({
  asset: z.string().min(1),
  ts: z.enum(INTERVALS).default("1h"),
});
