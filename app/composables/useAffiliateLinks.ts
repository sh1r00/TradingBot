interface AffiliateLinkSource {
  key?: string
  url: string
  trackingUrl?: string
}

/**
 * Affiliate-link resolution.
 *
 * Every outward resource link (card click, leaderboard row, guide CTA) goes
 * through `hrefFor()` so that affiliate / tracking URLs can be supplied from
 * environment variables (`NUXT_PUBLIC_AFFILIATE_*`) at build time. When an
 * affiliate URL is empty, the link falls back to the official, non-tracking
 * URL — so the site is fully wired today and the owner only has to set the
 * env vars (and rebuild) to switch every link over to the tracking URL.
 */
export function useAffiliateLinks() {
  const config = useRuntimeConfig()
  const affiliates = (config.public.affiliates ?? {}) as Record<string, string>

  /**
   * Resolve the click-through href for a resource:
   * 1. Seeded resources (`key`) prefer `NUXT_PUBLIC_AFFILIATE_<KEY>` from env.
   * 2. Admin-created links (no `key`) use their stored `trackingUrl`.
   * 3. Fall back to the official `url`.
   */
  function hrefFor(link: AffiliateLinkSource): string {
    if (link.key) {
      const affiliate = affiliates[link.key]
      if (affiliate && affiliate.trim().length > 0) return affiliate.trim()
    }
    return link.trackingUrl || link.url
  }

  return { hrefFor, affiliates }
}
