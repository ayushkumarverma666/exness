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

## Deploy for free

The whole platform (web, API, engine, price feed and Redis) runs in **one Docker container** built by the root
`Dockerfile`. The only external dependency is Postgres.

### 1. Database: Neon (free)

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Copy the connection string, e.g. `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`.

Migrations run automatically every time the container starts.

### 2. App: Hugging Face Spaces (free CPU: 2 vCPU, 16 GB RAM)

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space) and choose **Docker**, then **Blank**, on the free **CPU basic** hardware.
2. In the Space's **Settings → Variables and secrets**, add these **secrets**:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string |
   | `JWT_SECRET` | a random string of 32+ characters (`openssl rand -hex 32`) |
   | `SITE_URL` | optional: `https://<user>-<space>.hf.space` |

3. Push the code to the Space. You can either:
   - **Automatic (recommended):** in this GitHub repo, add the secret `HF_TOKEN` (a Hugging Face *write* token) and the
     variable `HF_SPACE` (`your-name/your-space`). Every push to `main` then deploys through
     `.github/workflows/deploy-huggingface.yml`.
   - **Manual:** add the Space as a git remote and push. The Space's README must start with the front matter below,
     which the workflow adds for you:

     ```yaml
     ---
     title: Velora
     sdk: docker
     app_port: 7860
     ---
     ```

4. The Space builds the image (~5 minutes) and serves the app at `https://<user>-<space>.hf.space`.

**Good to know**
- Free Spaces go to sleep after about 48 hours without visitors and wake on the next visit. All state lives in Postgres,
  and the engine restores open positions when it starts, so nothing is lost. Take-profit, stop-loss and liquidation are
  not checked while the Space is asleep.
- The Space's disk is temporary. That's fine here, because Redis only carries in-flight messages.
- Use the direct `*.hf.space` URL rather than the embedded huggingface.co page. Inside the iframe, the app falls back
  to bearer tokens because browsers block third-party cookies.

### Alternative: web on Vercel, API elsewhere

The web app also works on Vercel with `NEXT_PUBLIC_API_URL=https://your-api-host`. On the API, set
`CORS_ORIGINS=https://your-app.vercel.app` and `COOKIE_SAMESITE=none`.

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
