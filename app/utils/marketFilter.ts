/**
 * Market-data filter — the "backend filter" from docs/live-data-backend.md.
 * Pure, side-effect-free transforms over CoinGecko /coins/markets rows.
 *
 * Rules implemented here (see the doc for full justification):
 *  1. Asset universe — top N by market cap, stablecoins excluded.
 *  2. Metric selection — keep only what is rendered (price, 24h %, 7d %, volume).
 *  3. Significance threshold — only surface |24h %| ≥ minAbs24hPct as a "mover".
 *  6. Sanitization — coerce to number, drop NaN/Infinity/≤0 price.
 *  8. Denormalized snapshot — output flat, storable rows (not raw API JSON).
 *
 * Rules 4 (idempotent upsert), 5 (freshness TTL) and 7 (rate-limit/cache) are
 * infrastructure concerns handled by the ingest job / DB, not this pure module.
 */

export interface RawCoin {
  id: string
  symbol: string
  current_price: number | null
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency?: number | null
  total_volume: number | null
  market_cap: number | null
}

export interface MarketSnapshot {
  asset_id: string
  symbol: string
  price_usd: number
  change_24h_pct: number
  change_7d_pct: number | null
  volume_24h_usd: number
}

/** Pegged assets that (by design) never move — they would only add noise. */
const STABLECOINS = new Set([
  'tether',
  'usd-coin',
  'dai',
  'binance-usd',
  'usdd',
  'first-digital-usd',
  'frax',
  'ethena-usde',
  'paypal-usd',
])

export interface FilterOptions {
  topN?: number
  minAbs24hPct?: number
}

function toNum(v: number | null | undefined): number | null {
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function sanitize(c: RawCoin): MarketSnapshot | null {
  const price = toNum(c.current_price)
  const ch24 = toNum(c.price_change_percentage_24h)
  const ch7 = toNum(c.price_change_percentage_7d_in_currency)
  const vol = toNum(c.total_volume)

  // Rule 6: reject un-priceable rows (missing price or NaN/Infinity).
  if (price == null || price <= 0 || ch24 == null) return null

  return {
    asset_id: c.id,
    symbol: c.symbol,
    price_usd: price,
    change_24h_pct: ch24,
    change_7d_pct: ch7,
    volume_24h_usd: vol ?? 0,
  }
}

/**
 * Rule 1 + 2 + 6 + 8: take raw CoinGecko rows, drop stablecoins, keep the top-N
 * by market cap, and reduce each to a sanitized, denormalized snapshot.
 */
export function filterMarketData(raw: RawCoin[], options: FilterOptions = {}): MarketSnapshot[] {
  const { topN = 10 } = options
  return raw
    .filter((c) => !STABLECOINS.has(c.id))
    .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0))
    .slice(0, topN)
    .map(sanitize)
    .filter((s): s is MarketSnapshot => s !== null)
}

/**
 * Rule 3: from a set of snapshots, return only the "movers" — assets whose
 * 24h change meets the significance threshold. This is what the live feed shows.
 */
export function significantMovers(snapshots: MarketSnapshot[], minAbs24hPct = 1): MarketSnapshot[] {
  return snapshots
    .filter((s) => Math.abs(s.change_24h_pct) >= minAbs24hPct)
    .sort((a, b) => Math.abs(b.change_24h_pct) - Math.abs(a.change_24h_pct))
}
