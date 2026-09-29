import { randomUUID } from "crypto";
import { createRedis, addToStream, ENGINE_STREAM, CALLBACK_QUEUE } from "@repo/redis";
import type { EngineReply, EngineRequest } from "@repo/types";

const REPLY_TIMEOUT_MS = 5000;

type Pending = { resolve: (r: EngineReply) => void; timer: NodeJS.Timeout };

/** Sends requests to the engine over Redis Streams and waits for the matching reply. */
class EngineClient {
  private reader = createRedis();
  private writer = createRedis();
  private pending = new Map<string, Pending>();
  private lastId = "$";

  constructor() {
    this.loop();
  }

  private async loop() {
    while (true) {
      try {
        const res = await this.reader.xread("BLOCK", 5000, "STREAMS", CALLBACK_QUEUE, this.lastId);
        if (!res) continue;
        for (const [id, fields] of res[0]![1]) {
          this.lastId = id;
          const raw = fields[fields.indexOf("data") + 1];
          if (!raw) continue;
          const reply = JSON.parse(raw) as EngineReply;
          const waiter = this.pending.get(reply.id);
          if (waiter) {
            clearTimeout(waiter.timer);
            this.pending.delete(reply.id);
            waiter.resolve(reply);
          }
        }
      } catch (e) {
        console.error("[engine-client] read error:", e);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  async send<K extends Exclude<EngineRequest["kind"], "price-update">>(
    kind: K,
    payload: Omit<Extract<EngineRequest, { kind: K }>["payload"], "id">
  ): Promise<EngineReply> {
    const id = randomUUID();
    const result = new Promise<EngineReply>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        resolve({ id, status: "error", message: "The trading engine did not respond in time" });
      }, REPLY_TIMEOUT_MS);
      this.pending.set(id, { resolve, timer });
    });
    await addToStream(
      this.writer,
      ENGINE_STREAM,
      "data",
      JSON.stringify({ kind, payload: { ...payload, id }, sentAt: Date.now() })
    );
    return result;
  }
}

export const engine = new EngineClient();
