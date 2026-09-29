import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { redis } from "@repo/redis";
import { prisma } from "@repo/prisma";
import { config } from "./lib/config";
import tradeRouter from "./routes/trade.route";
import authRouter from "./routes/auth.route";
import balanceRouter from "./routes/balance.route";
import marketRouter from "./routes/market.route";
import { getCandles } from "./controllers/market.controller";
import { asyncHandler } from "./lib/http";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

app.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const [db, status] = await Promise.all([
      prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      redis.get("engine:status").catch(() => null),
    ]);
    const engine = status ? JSON.parse(status) : null;
    const engineUp = !!engine && Date.now() - engine.ts < 10_000;
    res.status(db && engineUp ? 200 : 503).json({
      status: db && engineUp ? "ok" : "degraded",
      database: db,
      engine: engineUp,
      markets: engine ? Object.keys(engine.quotes) : [],
      time: new Date().toISOString(),
    });
  })
);

app.use("/auth", authRouter);
app.use("/balance", balanceRouter);
app.use("/trade", tradeRouter);
app.use("/market", marketRouter);
// Backwards-compatible alias.
app.get("/candles", asyncHandler(getCandles));

app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] unhandled error:", err);
  const upstream = /Market data provider|fetch failed|aborted|timeout/i.test(String(err?.message));
  res.status(upstream ? 502 : 500).json({
    error: upstream ? "Market data is temporarily unavailable" : "Internal server error",
  });
});

app.listen(config.port, () => {
  console.log(`[api] listening on :${config.port}`);
});
