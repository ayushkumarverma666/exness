import dotenv from "dotenv";
dotenv.config();

import { WebSocket } from "ws";
import { redis, addToStream, ENGINE_STREAM } from "@repo/redis";
import { MARKETS, ASSET_SYMBOLS, pairToSymbol, type AssetSymbol } from "@repo/types";

const WS_URL = process.env.PRICE_FEED_URL || "wss://ws.backpack.exchange";
// "simulated" is for local development only, when the exchange is unreachable.
const FEED = process.env.PRICE_FEED === "simulated" ? "simulated" : "backpack";

redis.on("error", (err) => console.error("[poller] redis error:", err.message));

async function publish(symbol: AssetSymbol, bid: number, ask: number) {
  if (!(bid > 0) || !(ask > 0) || ask < bid) return;
  await addToStream(
    redis,
    ENGINE_STREAM,
    "data",
    JSON.stringify({ kind: "price-update", payload: { symbol, bid, ask, ts: Date.now() } })
  );
}

function connectBackpack(attempt = 0) {
  const ws = new WebSocket(WS_URL);
  let heartbeat: NodeJS.Timeout | undefined;
  let lastMessageAt = Date.now();

  ws.on("open", () => {
    attempt = 0;
    console.log(`[poller] connected to ${WS_URL}`);
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: ASSET_SYMBOLS.map((s) => `bookTicker.${MARKETS[s].pair}`),
        id: 1,
      })
    );
    // If the feed goes silent the socket is probably half-open: recycle it.
    heartbeat = setInterval(() => {
      if (Date.now() - lastMessageAt > 30_000) {
        console.warn("[poller] no data for 30s, reconnecting");
        ws.terminate();
      }
    }, 10_000);
  });

  ws.on("message", (raw) => {
    lastMessageAt = Date.now();
    try {
      const msg = JSON.parse(raw.toString());
      const d = msg?.data;
      if (!d || d.e !== "bookTicker") return;
      const symbol = pairToSymbol(String(d.s));
      if (!symbol) return;
      publish(symbol, Number(d.b), Number(d.a)).catch((e) =>
        console.error("[poller] publish failed:", e.message)
      );
    } catch (e) {
      console.error("[poller] bad message:", e);
    }
  });

  ws.on("close", () => {
    clearInterval(heartbeat);
    const delay = Math.min(30_000, 1000 * 2 ** attempt);
    console.warn(`[poller] disconnected, retrying in ${delay}ms`);
    setTimeout(() => connectBackpack(attempt + 1), delay);
  });

  ws.on("error", (err) => console.error("[poller] ws error:", err.message));
}

function runSimulatedFeed() {
  console.warn("[poller] PRICE_FEED=simulated: publishing synthetic prices (development only)");
  const mids: Record<AssetSymbol, number> = { BTC: 112000, ETH: 4100, SOL: 210 };
  setInterval(() => {
    for (const s of ASSET_SYMBOLS) {
      mids[s] *= 1 + (Math.random() - 0.5) * 0.0008;
      const spread = mids[s] * 0.00005;
      publish(s, mids[s] - spread, mids[s] + spread).catch(() => {});
    }
  }, 500);
}

console.log(`[poller] starting price feed (${FEED})`);
if (FEED === "simulated") runSimulatedFeed();
else connectBackpack();
