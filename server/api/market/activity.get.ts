import { setResponseStatus } from 'h3'
import { filterMarketData, significantMovers, type MarketSnapshot } from '~~/app/utils/marketFilter'

// CoinGecko free public endpoint — no API key required (public tier rate-limits apply).
const COINGECKO_MARKETS = 'https://api.coingecko.com/api/v3/coins/markets'

// Server-side caching + rate-limit tuning. Kept short so the feed stays fresh but
// does not hammer CoinGecko (or hang) during an outage or a burst of clients.
const CACHE_TTL_MS = 30_000
const FETCH_TIMEOUT_MS = 10_000
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

interface RawCoin {
  id: string
  symbol: string
  current_price: number | null
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency?: number | null
  total_volume: number | null
  market_cap: number | null
}

interface MarketActivityResponse {
  movers: MarketSnapshot[]
  snapshots: MarketSnapshot[]
  stale: boolean
  source: string
  fetchedAt?: string
  cached?: boolean
  rateLimited?: boolean
}

// In-memory TTL cache — a single slot per server process. On a serverless host
// each isolate has its own cache, which is fine: it still collapses bursts.
let cache: { data: MarketActivityResponse; at: number } | null = null

// In-memory sliding-window rate limiter keyed by client IP.
const hits = new Map<string, { count: number; resetAt: number }>()

function getClientIp(event: { node?: { req?: { headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } } } }): string {
  const req = event?.node?.req
  if (!req) return 'unknown'
  const fwd = req.headers?.['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function emptyFeed(extra: Partial<MarketActivityResponse> = {}): MarketActivityResponse {
  return { movers: [], snapshots: [], stale: true, source: 'coingecko', ...extra }
}

export default defineEventHandler(async (event) => {
  // ── Rate limit ──────────────────────────────────────────────────────────────
  const now = Date.now()
  const ip = getClientIp(event)
  let rec = hits.get(ip)
  if (!rec || now >= rec.resetAt) {
    rec = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }
  }
  rec.count += 1
  hits.set(ip, rec)

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 10_000) {
    for (const [key, value] of hits) {
      if (now >= value.resetAt) hits.delete(key)
    }
  }

  if (rec.count > RATE_LIMIT_MAX) {
    setResponseStatus(event, 429)
    // Cached fallback when available, otherwise an honest empty feed.
    if (cache) return { ...cache.data, cached: true, rateLimited: true }
    return emptyFeed({ rateLimited: true })
  }

  // ── Serve cache when still fresh ────────────────────────────────────────────
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return { ...cache.data, cached: true }
  }

  // Fetch top-50 by market cap (the filter narrows to top-N, stablecoins excluded).
  const url = `${COINGECKO_MARKETS}?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h,7d&sparkline=false`

  let raw: RawCoin[]
  try {
    const res = await $fetch<RawCoin[]>(url, { timeout: FETCH_TIMEOUT_MS })
    raw = Array.isArray(res) ? res : []
  } catch {
    // Upstream unavailable — return an empty feed (never fabricate movement).
    // Not cached so the next request retries fresh.
    return emptyFeed()
  }

  const snapshots = filterMarketData(raw, { topN: 10 })
  const movers = significantMovers(snapshots, 1)

  const data: MarketActivityResponse = {
    movers,
    snapshots,
    stale: false,
    source: 'coingecko',
    fetchedAt: new Date().toISOString(),
  }
  cache = { data, at: Date.now() }

  return data
})
