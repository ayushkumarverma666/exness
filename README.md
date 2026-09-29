# Velora — crypto margin trading platform

A full-stack margin-trading platform for **BTC, ETH and SOL** against USDC:

- **Live pricing:** bid/ask streamed from Backpack Exchange's public order book.
- **Matching engine:** market orders, isolated margin, 1–100× leverage, and server-side take-profit, stop-loss and liquidation.
- **Web terminal:** live chart with position lines, order book, recent trades, and an order ticket with a pre-trade risk preview.

Accounts are **demo accounts**. Every new user gets 10,000 virtual USDC, and no real money is involved.
The platform name and copy live in `apps/web/app/lib/brand.ts`.

## Architecture

```
                 ┌────────────── one container / one port (7860) ──────────────┐
 Browser ──HTTP──▶ Next.js web ──/api/*──▶ API service ──┐                      │
    │            │                                        │ Redis Streams        │
    │            │   Price feed ──bookTicker quotes──▶ engine-stream ──▶ Engine │
    │            │   (Backpack WS)                        ◀── callback-queue ──┘ │
    │            └───────────────────────────────────────────┬──────────────────┘
    └──WebSocket (live ticks for the UI)──▶ Backpack          │
                                                          PostgreSQL (Neon)
```

| Service | Path | Role |
|---|---|---|
| Web | `apps/web` | Next.js 15 terminal and marketing site. Proxies `/api/*` to the API so everything is served from one origin. |
| API | `apps/api-service` | Express: auth (bcrypt and JWT, via cookie or bearer token), orders, balances, ledger, and cached market data (tickers, depth, trades, candles). |
| Engine | `apps/engine-service` | Single writer of balances and positions. Processes requests sequentially from a Redis stream and checks TP/SL/liquidation on every tick. Restores open positions and balances from Postgres on start. |
| Price feed | `apps/price-poller-service` | Subscribes to `bookTicker` for every market, reconnects with backoff and publishes quotes to the engine. |
| Shared | `packages/*` | Prisma schema and migrations, Redis helpers, and market specs and types shared by the engine and API. |

### Trading rules

- Longs fill at the **ask**, shorts at the **bid**. Positions are valued at the price they can be closed at.
- Required margin = size × price ÷ leverage. Each position's margin is **isolated**, so a trade can never lose more than its margin.
- A position is liquidated when its remaining margin falls to 5% of the initial margin: liquidation price = entry × (1 ∓ 0.95 ÷ leverage).
- If a price is more than 30 seconds old, the engine rejects new orders.
- P&L is always computed by the engine; the client never supplies it.

## Local development

Requirements: Node 22+, pnpm 9, Postgres and Redis (or Docker).

```bash
pnpm install
cp .env.example apps/api-service/.env      # repeat for engine-service and price-poller-service
pnpm db:migrate
pnpm build

# in separate terminals
pnpm dev:engine
pnpm dev:price-poller                       # PRICE_FEED=simulated if the exchange is unreachable
pnpm dev:api
pnpm dev:web                                # http://localhost:3200
```

Or run the production image locally, with Postgres included: `docker compose up --build`, then open http://localhost:7860.

## Deploy for free (no credit card)

The recommended free setup has three parts: **Vercel** hosts the website, **Render** hosts the backend and **Neon**
hosts the database. None of them asks for a card.

### 1. Database: Neon

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Copy the connection string, e.g. `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`.

Migrations run automatically every time the backend starts.

### 2. Backend: Render (free web service)

1. Sign up at [render.com](https://render.com) with GitHub.
2. Click **New → Blueprint** and pick this repository. Render reads `render.yaml` and creates the `velora-api` service.
   It uses `Dockerfile.backend` and runs the API, engine, price feed and Redis in one container.
3. When asked, paste your Neon string as `DATABASE_URL`. `JWT_SECRET` is generated for you.
4. Wait for the deploy, then open `https://velora-api-xxxx.onrender.com/health`. It should show `"status":"ok"`.

### 3. Website: Vercel (Hobby plan)

1. Sign up at [vercel.com](https://vercel.com) with GitHub and click **Add New → Project**. Import this repository.
2. Set **Root Directory** to `apps/web`. Vercel detects Next.js and pnpm.
3. Add the environment variable `API_INTERNAL_URL` = your Render URL (e.g. `https://velora-api-xxxx.onrender.com`).
4. Deploy. Your site is at `https://<project>.vercel.app`.

Vercel proxies `/api/*` to Render, so the browser only talks to your Vercel domain and login cookies are first-party.

**Good to know**
- Render's free service sleeps after about 15 minutes without requests. The first visit after that takes about a
  minute while it wakes. All state lives in Postgres and the engine restores open positions on start, so nothing is
  lost. Take-profit, stop-loss and liquidation are not checked while the backend is asleep.
- Every push to `main` redeploys both Vercel and Render automatically.

### Alternative: one container (Hugging Face Spaces, any VPS)

The root `Dockerfile` runs everything, website included, in one container on port 7860. On a VPS, run
`docker compose up --build`. For a Hugging Face Docker Space, add `DATABASE_URL` and `JWT_SECRET` as Space secrets.
Then add the GitHub secret `HF_TOKEN` (a write token) and the variable `HF_SPACE` (`user/space`), and
`.github/workflows/deploy-huggingface.yml` deploys every push to `main`. Some Hugging Face accounts have a free CPU
quota of 0; in that case the Space stays paused until Hugging Face raises it.

## Environment variables

| Variable | Service | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | api, engine | — | Postgres connection string |
| `JWT_SECRET` | api | dev secret | **Required in production** (≥ 32 chars) |
| `REDIS_URL` / `REDIS_HOST` / `REDIS_PORT` | all | `127.0.0.1:6379` | Redis connection |
| `PRICE_FEED` | price feed | `backpack` | `simulated` for offline development only |
| `MARKET_DATA_API` | api | Backpack REST | Upstream for tickers, depth, trades, candles |
| `CORS_ORIGINS` | api | localhost | Extra allowed origins (comma-separated) |
| `COOKIE_SAMESITE` / `COOKIE_SECURE` | api | `lax` / on in prod | Session cookie flags |
| `API_INTERNAL_URL` | web (build) | `http://127.0.0.1:3001` | Where `/api/*` is proxied |
| `NEXT_PUBLIC_API_URL` | web (build) | `/api` | API base URL when it's on another domain |
| `SITE_URL` | web | — | Public URL for social preview images |

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | — | Session management (sets cookie and returns token) |
| GET | `/auth/me` | ✓ | Current user |
| GET | `/balance` | ✓ | Free balance and used margin |
| POST | `/balance/deposit` | ✓ | Demo top-up (≤ 100k per request, ≤ 1M total) |
| GET | `/balance/transactions` | ✓ | Account ledger |
| POST | `/trade/open` | ✓ | `{ asset, side, qty, leverage, takeProfit?, stopLoss? }` |
| POST | `/trade/close/:orderId` | ✓ | Close at market |
| GET | `/trade/orders?status=open\|closed` | ✓ | Positions and history |
| GET | `/trade/stats` | ✓ | Win rate, profit factor, realized P&L |
| GET | `/market/tickers` | — | Quotes and 24h stats for all markets |
| GET | `/market/candles?asset=BTC&ts=1h` | — | OHLCV history |
| GET | `/market/depth/:symbol`, `/market/trades/:symbol` | — | Order book and recent trades |
| GET | `/health` | — | Database and engine status |

## Risk disclaimer

This software is for education and demonstration. Operating a platform that takes real deposits or offers leveraged
trading to the public requires financial licences in most countries.
