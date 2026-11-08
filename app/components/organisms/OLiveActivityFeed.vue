<script setup lang="ts">
/**
 * Live Market Movers — REAL CoinGecko data, no fabricated events.
 *
 * Fetches `/api/market/activity` (server route `server/api/market/activity.get.ts`),
 * which proxies the free CoinGecko `/coins/markets` endpoint and applies the
 * market filter (`app/utils/marketFilter.ts`) to surface only "significant movers"
 * (|24h change| >= 1%, stablecoins excluded).
 *
 * On a static host (e.g. the Netlify SSG deploy) the server route does not run,
 * so the request 404s — in that case we hide this section entirely instead of
 * showing an empty "unavailable" box. Only a *transient* upstream outage on an
 * SSR-capable runtime surfaces the honest "unavailable"/stale message.
 */

interface MarketMover {
  asset_id: string
  symbol: string
  price_usd: number
  change_24h_pct: number
  change_7d_pct: number | null
  volume_24h_usd: number
}

interface MarketActivityResponse {
  movers: MarketMover[]
  snapshots: MarketMover[]
  stale: boolean
  source: string
  fetchedAt?: string
}

const { t } = useI18n()

const movers = ref<MarketMover[]>([])
const isLoading = ref(true)
const isUnavailable = ref(false)
const isStale = ref(false)
// Static host (no server route) → render nothing, not an empty box.
const hideSection = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | null = null

async function load(): Promise<void> {
  try {
    const data = await $fetch<MarketActivityResponse>('/api/market/activity')
    movers.value = Array.isArray(data?.movers) ? data.movers : []
    isStale.value = Boolean(data?.stale)
    // A stale response with no data = transient upstream outage (honest text).
    isUnavailable.value = Boolean(data?.stale) && movers.value.length === 0
    hideSection.value = false
  } catch {
    // Fetch failed (e.g. static host with no API route) — hide the section.
    movers.value = []
    isStale.value = false
    isUnavailable.value = false
    hideSection.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  load()
  // Periodically re-fetch the REAL feed (60s). No simulated events are generated.
  refreshTimer = setInterval(load, 60_000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

function formatPrice(v: number): string {
  if (v >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (v >= 1) return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return v.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

function formatPct(v: number): string {
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}

function moverClass(v: number): string {
  return v >= 0 ? 'text-market-up' : 'text-market-down'
}
</script>

<template>
  <section
    v-if="!hideSection"
    class="py-12 px-4 bg-surface-container"
    aria-labelledby="market-heading"
  >
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <h2
            id="market-heading"
            class="text-2xl font-bold text-on-surface"
          >
            {{ $t('market.title') }}
          </h2>
          <!-- Live indicator (fresh data only) -->
          <span
            v-if="!isStale && !isLoading"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-market-up"
            role="img"
            :aria-label="$t('market.live')"
          >
            <span class="live-dot" aria-hidden="true" />
            {{ $t('market.live') }}
          </span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-full text-sm font-medium bg-surface-variant text-on-surface-variant hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :disabled="isLoading"
          @click="load"
        >
          {{ $t('market.refresh') }}
        </button>
      </div>

      <!-- Screen reader live region -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        {{ isLoading
          ? t('common.loading')
          : isUnavailable
            ? t('market.unavailable')
            : movers.length > 0
              ? t('market.title')
              : t('market.empty') }}
      </div>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="space-y-3"
        aria-busy="true"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-start gap-3 bg-surface rounded-xl p-4 animate-pulse"
          aria-hidden="true"
        >
          <div class="w-2 h-2 rounded-full bg-surface-variant mt-2" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-surface-variant rounded w-3/4" />
            <div class="h-3 bg-surface-variant rounded w-1/4" />
          </div>
        </div>
      </div>

      <!-- Unavailable state (transient upstream outage — honest, no fabricated fallback) -->
      <div
        v-else-if="isUnavailable"
        class="text-center py-10 bg-surface rounded-xl"
        role="status"
      >
        <p class="text-on-surface-variant">{{ $t('market.unavailable') }}</p>
      </div>

      <!-- Empty state (real data fetched, no significant movers) -->
      <div
        v-else-if="movers.length === 0"
        class="text-center py-10 bg-surface rounded-xl"
        role="status"
      >
        <p class="text-on-surface-variant">{{ $t('market.empty') }}</p>
      </div>

      <!-- Mover list -->
      <ul
        v-else
        class="space-y-3"
        role="list"
        :aria-label="$t('market.title')"
      >
        <li
          v-for="mover in movers"
          :key="mover.asset_id"
          class="flex items-center justify-between gap-4 bg-surface rounded-xl p-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-sm font-bold text-on-primary-container uppercase"
              aria-hidden="true"
            >
              {{ mover.symbol.slice(0, 3) }}
            </div>
            <div>
              <p class="font-semibold text-on-surface uppercase">{{ mover.symbol }}</p>
              <p class="text-xs text-on-surface-variant">${{ formatPrice(mover.price_usd) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p
              class="font-semibold inline-flex items-center justify-end gap-1"
              :class="moverClass(mover.change_24h_pct)"
            >
              <AIcon
                :name="mover.change_24h_pct >= 0 ? 'trending_up' : 'trending_down'"
                size="xs"
                aria-hidden="true"
              />
              {{ formatPct(mover.change_24h_pct) }}
            </p>
            <p class="text-xs text-on-surface-variant">{{ $t('market.change24h') }}</p>
          </div>
        </li>
      </ul>

      <p
        v-if="isStale && movers.length > 0"
        class="text-xs text-on-surface-variant text-center mt-4"
      >
        {{ $t('market.stale') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.live-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: currentColor;
  animation: live-dot-pulse 1.6s ease-in-out infinite;
}
@keyframes live-dot-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation: none;
  }
}
</style>
