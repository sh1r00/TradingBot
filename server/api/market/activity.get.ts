import { filterMarketData, significantMovers } from '~~/app/utils/marketFilter'

// CoinGecko free public endpoint — no API key required (public tier rate-limits apply).
const COINGECKO_MARKETS = 'https://api.coingecko.com/api/v3/coins/markets'

interface RawCoin {
  id: string
  symbol: string
  current_price: number | null
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency?: number | null
  total_volume: number | null
  market_cap: number | null
}

export default defineEventHandler(async () => {
  // Fetch top-50 by market cap (the filter narrows to top-N, stablecoins excluded).
  const url = `${COINGECKO_MARKETS}?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h,7d&sparkline=false`

  let raw: RawCoin[]
  try {
    const res = await $fetch<RawCoin[]>(url, { timeout: 10_000 })
    raw = Array.isArray(res) ? res : []
  } catch {
    // Upstream unavailable — return an empty feed (never fabricate movement).
    return { movers: [], snapshots: [], stale: true, source: 'coingecko' }
  }

  const snapshots = filterMarketData(raw, { topN: 10 })
  const movers = significantMovers(snapshots, 1)

  return {
    movers,
    snapshots,
    stale: false,
    source: 'coingecko',
    fetchedAt: new Date().toISOString(),
  }
})
