import Redis, { RedisOptions } from "ioredis";

export const ENGINE_STREAM = "engine-stream";
export const CALLBACK_QUEUE = "callback-queue";
// Streams are capped so a long-running deployment does not grow Redis without bound.
export const STREAM_MAXLEN = 20000;

const options: RedisOptions = { maxRetriesPerRequest: null };

export function createRedis(): Redis {
  if (process.env.REDIS_URL) return new Redis(process.env.REDIS_URL, options);
  const host = process.env.REDIS_HOST || "127.0.0.1";
  const port = Number(process.env.REDIS_PORT || 6379);
  return new Redis({ host, port, ...options });
}

export const redis = createRedis();

export function addToStream(client: Redis, stream: string, ...fields: string[]) {
  return client.xadd(stream, "MAXLEN", "~", String(STREAM_MAXLEN), "*", ...fields);
}
