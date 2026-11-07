# TradingBot — Real Live Market Data (backend filter) — Recommendation

Replace the fabricated "live activity feed" with a **real** market-data feed:
**free public API → backend filter → DB → frontend**. Nothing in this design fabricates data.

## Data source: CoinGecko (crypto)

- **Free, no API key** for `/coins/markets` (public tier ~10–30 req/min).
- Crypto trades **24/7**, so a "live" feed has genuine, frequent, meaningful price moves
  (vs. stocks, which close) — a real ticker actually *looks* live.
- Stable JSON, CORS-friendly, well-known.

*Alternatives:* Binance public API (spot prices, no key, but thinner metadata); Finnhub or
Alpha Vantage (stocks/crypto, both need a key and have tighter free limits).

## Architecture

```
[CoinGecko /coins/markets]
        │  scheduled fetch (every 5–15 min)
        ▼
[Ingest function]   (Netlify Scheduled Function  OR  Supabase pg_cron)
        │
        ▼
[FILTER]   ◄── the core (8 rules below)
        │
        ▼
[Supabase  market_snapshots]   (Postgres — user already runs Supabase for trades-app)
        │
        ▼
[Frontend]   GET /api/market/activity  (or Supabase PostgREST directly)
        │
        ▼
[OLiveActivityFeed]   renders REAL rows
```

TradingBot is currently a static `nuxi generate` deploy, so the **frontend read is a direct
browser → Supabase (or Netlify Function) call** — no SSR switch required.

## The filter — 8 rules, with justification

1. **Asset universe: top N by market cap, stablecoins excluded.**
   *Why:* USDT/USDC/DAI barely move, so they'd flood the feed with "no change" rows. Top-N
   keeps the feed relevant and bounds the payload + the API rate-limit budget.

2. **Metric selection: price, 24h change %, 7d change %, 24h volume — store only what's rendered.**
   *Why:* these are the figures that actually inform a money decision; a minimal schema means
   cheap reads and no schema drift from unused columns.

3. **Significance threshold: emit a feed row only when |24h %| ≥ 1% (or |7d %| ≥ 3%).**
   *Why:* "BTC +0.02%" is noise, not a signal. Thresholding turns a raw ticker into a curated
   "what actually moved" feed — the honest equivalent of the old fake "someone signed up" feed.

4. **Dedup / idempotency: upsert keyed on `(asset_id, bucket_ts)`.**
   *Why:* scheduled jobs overlap and retry; a unique key guarantees no duplicate rows.

5. **Freshness TTL: serve only rows younger than 15 min, and label stale rows.**
   *Why:* the anti-spoof guarantee — the feed must never present old data as current, and must
   say so when the data goes stale.

6. **Sanitization: coerce to number, drop NaN/Infinity/≤0 price, clamp absurd deltas.**
   *Why:* a public API returns garbage under load; never render a raw string or NaN into the UI.

7. **Rate-limit + cache: the DB is the cache; back off on HTTP 429; never call upstream from the browser.**
   *Why:* stays inside the free tier and makes the backend the single choke point (no exposed key).

8. **Denormalized snapshot: store filtered rows, not raw API JSON.**
   *Why:* the filter runs once at ingest; the feed read becomes a trivial indexed SELECT.

## DB schema (Supabase)

```sql
create table market_snapshots (
  id             bigint generated always as identity primary key,
  asset_id       text    not null,          -- 'bitcoin'
  symbol         text    not null,          -- 'btc'
  price_usd      numeric not null,
  change_24h_pct numeric not null,
  change_7d_pct  numeric,
  volume_24h_usd numeric,
  bucket_ts      timestamptz not null,
  created_at     timestamptz default now(),
  unique (asset_id, bucket_ts)
);
create index on market_snapshots (bucket_ts desc);
```

## To wire it (blocked on credentials / a decision)

- **Supabase** project URL + anon/service key (dedicated schema/project for TradingBot).
- **Scheduled host:** Netlify Scheduled Functions (TradingBot is already on Netlify) **or**
  Supabase `pg_cron`.
- No SSR switch needed (feed read is browser → Supabase / Netlify Function).

## Recommendation

Adopt **CoinGecko + Supabase + the 8-rule filter**. It makes the feed genuinely live and honest,
replacing spoofed rows with real, filtered market movement — zero fabricated data points.
