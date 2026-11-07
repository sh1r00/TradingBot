import { describe, it, expect } from 'vitest'
import { filterMarketData, significantMovers, type RawCoin } from '~/utils/marketFilter'

const coin = (over: Partial<RawCoin>): RawCoin => ({
  id: 'bitcoin',
  symbol: 'btc',
  current_price: 60000,
  price_change_percentage_24h: 0,
  price_change_percentage_7d_in_currency: 0,
  total_volume: 1_000_000_000,
  market_cap: 1_000_000_000_000,
  ...over,
})

describe('marketFilter', () => {
  it('excludes stablecoins from the universe', () => {
    const raw = [
      coin({ id: 'bitcoin', symbol: 'btc', current_price: 60000, market_cap: 1e12, price_change_percentage_24h: 2 }),
      coin({ id: 'tether', symbol: 'usdt', current_price: 1, market_cap: 9e11, price_change_percentage_24h: 0.01 }),
      coin({ id: 'usd-coin', symbol: 'usdc', current_price: 1, market_cap: 3e11, price_change_percentage_24h: 0 }),
    ]
    const ids = filterMarketData(raw).map((s) => s.asset_id)
    expect(ids).not.toContain('tether')
    expect(ids).not.toContain('usd-coin')
    expect(ids).toContain('bitcoin')
  })

  it('keeps top-N by market cap', () => {
    const raw = [
      coin({ id: 'a', market_cap: 100, current_price: 10, price_change_percentage_24h: 1 }),
      coin({ id: 'b', market_cap: 300, current_price: 20, price_change_percentage_24h: 1 }),
      coin({ id: 'c', market_cap: 200, current_price: 30, price_change_percentage_24h: 1 }),
    ]
    expect(filterMarketData(raw, { topN: 2 }).map((s) => s.asset_id)).toEqual(['b', 'c'])
  })

  it('drops rows with NaN / missing / non-positive price', () => {
    const raw = [
      coin({ id: 'bad-nan', current_price: Number.NaN, price_change_percentage_24h: 5 }),
      coin({ id: 'bad-null', current_price: null, price_change_percentage_24h: 5 }),
      coin({ id: 'bad-zero', current_price: 0, price_change_percentage_24h: 5 }),
      coin({ id: 'good', current_price: 100, price_change_percentage_24h: 5 }),
    ]
    const ids = filterMarketData(raw).map((s) => s.asset_id)
    expect(ids).toEqual(['good'])
  })

  it('significantMovers only returns |24h%| >= threshold, sorted by magnitude', () => {
    const snaps = [
      { asset_id: 'a', symbol: 'a', price_usd: 1, change_24h_pct: 0.4, change_7d_pct: 0, volume_24h_usd: 1 },
      { asset_id: 'b', symbol: 'b', price_usd: 2, change_24h_pct: -3.5, change_7d_pct: 0, volume_24h_usd: 1 },
      { asset_id: 'c', symbol: 'c', price_usd: 3, change_24h_pct: 1.2, change_7d_pct: 0, volume_24h_usd: 1 },
    ]
    const movers = significantMovers(snaps, 1)
    expect(movers.map((m) => m.asset_id)).toEqual(['b', 'c'])
  })

  it('denormalizes to a flat snapshot shape', () => {
    const [s] = filterMarketData([coin({ price_change_percentage_24h: 2.5 })])
    expect(s).toMatchObject({
      asset_id: 'bitcoin',
      symbol: 'btc',
      price_usd: 60000,
      change_24h_pct: 2.5,
      volume_24h_usd: 1_000_000_000,
    })
  })
})
