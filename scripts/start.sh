#!/usr/bin/env bash
# Starts every service in one container. If any process exits, the container
# exits too, so the platform (Hugging Face, Docker, ...) restarts it cleanly.
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?DATABASE_URL must be set (e.g. a Neon Postgres connection string)}"
: "${JWT_SECRET:?JWT_SECRET must be set to a random string of at least 32 characters}"

export REDIS_HOST=127.0.0.1 REDIS_PORT=6379
WEB_PORT="${PORT:-7860}"

echo "[start] redis"
redis-server --port 6379 --bind 127.0.0.1 --save "" --appendonly no --dir /tmp --daemonize yes
until redis-cli ping >/dev/null 2>&1; do sleep 0.2; done

echo "[start] database migrations"
(cd packages/prisma && npx prisma migrate deploy)

echo "[start] engine, price feed, api"
node apps/engine-service/dist/index.js &
node apps/price-poller-service/dist/index.js &
PORT=3001 node apps/api-service/dist/index.js &

echo "[start] web on :$WEB_PORT"
(cd apps/web && exec npx next start -p "$WEB_PORT" -H 0.0.0.0) &

wait -n
echo "[start] a service exited; shutting down"
exit 1
