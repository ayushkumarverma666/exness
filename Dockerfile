# Single-container image: Redis, the trading engine, the price feed, the API and
# the Next.js web app. Built for Hugging Face Docker Spaces (one public port),
# but runs anywhere Docker does. Postgres is external (e.g. Neon free tier).
FROM node:22-bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends redis-server openssl ca-certificates tini \
 && rm -rf /var/lib/apt/lists/* \
 && corepack enable && corepack prepare pnpm@9.0.0 --activate

ENV NEXT_TELEMETRY_DISABLED=1 TURBO_TELEMETRY_DISABLED=1
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/api-service/package.json apps/api-service/
COPY apps/engine-service/package.json apps/engine-service/
COPY apps/price-poller-service/package.json apps/price-poller-service/
COPY apps/web/package.json apps/web/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/prisma/package.json packages/prisma/
COPY packages/redis/package.json packages/redis/
COPY packages/types/package.json packages/types/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm turbo run build --filter=web --filter=api-service --filter=engine-service --filter=price-poller-service \
 && chown -R node:node /app

ENV NODE_ENV=production PORT=7860
USER node
EXPOSE 7860
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["bash", "scripts/start.sh"]
