# Money Conversion SPA (TradingBot) — Documentation

A Nuxt 4 statically-generated PWA that curates and explains legitimate, vetted
money-making resources in three languages (English, Español, አማርኛ). This file is the
case-study-ready reference: product, architecture, the resources feature, the live
market-data feed, every pitfall we hit and its fix, and how to run/build/deploy.

---

## 1. Product

**What it is:** a public, SEO-friendly, installable (PWA) single-page app that lists six
curated money-making methods (gaming rewards, commission-free investing, AI-work
platforms, freelancing, affiliate marketing, and reselling). Each method has a translated
title, description, and a short blog-style guide (how it works / how to start / realistic
expectations). The homepage also carries a **real** "Live Market Movers" feed and an income
calculator, plus standard conversion/engagement sections.

**What it is not:** it is not a trading engine, a broker, or a financial advisor. It makes no
earnings promises. All fabricated or placeholder marketing claims are flagged in
`TODO_POST_DEPLOY.md` and must be replaced with real, verifiable content before go-live.

**Audience:** anyone researching low-friction ways to earn online, in three locales.

---

## 2. Architecture

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (`compatibilityVersion: 4`), Vue 3 Composition API (`<script setup lang="ts">`) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) + Material Design 3 tokens (`@material/material-color-utilities`) |
| State | Pinia (`app/stores/`) |
| i18n | `@nuxtjs/i18n` — lazy-loaded JSON in `i18n/locales/{en,es,am}.json`, `prefix_except_default` |
| SEO | `@nuxtjs/seo` — sitemap, robots, OG image, schema.org (WebSite + Organization) |
| PWA | `@vite-pwa/nuxt` — autoUpdate service worker, offline fallback, manifest icons |
| Security | `nuxt-security` — CSP, `X-Frame-Options: DENY`, `nosniff`, referrer policy |
| Data (market feed) | Nitro server route → free CoinGecko public API → pure filter (`app/utils/marketFilter.ts`) |
| Deploy | Netlify (static) — `nuxi generate` → `.output/public` |

**Component model:** atomic design — `atoms/` → `molecules/` → `organisms/`, with
`pathPrefix: false` so components auto-import by their own name (see Pitfalls).

**i18n model:** all user-facing strings live in the three locale JSON files, which are kept
in **lockstep** (identical key sets). A script `scripts/check-i18n-lockstep.cjs` verifies this:
it flattens each locale and asserts every key exists in all three.

**Market-feed architecture (the honest "live" feed):**

```
[CoinGecko /coins/markets]  (free, no API key)
        │  GET on request (server route)
        ▼
[server/api/market/activity.get.ts]
        │  filters: top-N by market cap, stablecoins excluded,
        │  sanitize NaN/≤0, keep only |24h%| ≥ 1% "movers"
        ▼
[app/utils/marketFilter.ts]  (pure, unit-tested)
        │
        ▼
[OLiveActivityFeed.vue]  renders REAL movers (symbol, price, 24h %)
```

The feed is 100% real data. The previous implementation fabricated "someone signed up"
events on a timer — that code (`app/data/liveActivity.ts`) and the fake `setInterval` were
removed. When the API is unreachable the feed shows a truthful "unavailable" message; it
never invents movement. (For a full scheduled-ingest → Supabase version, see
`docs/live-data-backend.md` — that upgrade is blocked on owner-supplied Supabase credentials,
not on this code.)

---

## 3. Resources feature

- **Source of truth:** the six seeded resources live in `app/stores/resources.ts`. Their
  `title`, `description`, and `category` are **not** stored in the store — each seed carries a
  `key` slug (`scrambly`, `webull`, `mercor`, `upwork-fiverr`, `amazon-associates`, `depop`),
  and the display text resolves through i18n via `$t('resources.items.<key>.*')`.
- **Rendering:** `OResourceGrid.vue` and `OLeaderboard.vue` resolve display strings through
  helper functions that fall back to literal text for admin-created links (which store
  free-form strings).
- **Blog guides:** each resource has a 3-paragraph guide under `resources.items.<key>.blog*`
  (`blogHowItWorks`, `blogHowToStart`, `blogExpectations`) — translated in en/es/am. Rendered
  in `OResourceGuides.vue` on the `/resources` page (expandable per-resource guides + a
  "visit" CTA).
- **Affiliate links:** every outward link resolves through `useAffiliateLinks().hrefFor()`,
  preferring a `NUXT_PUBLIC_AFFILIATE_<KEY>` env var and falling back to the official
  non-tracking `url`. No affiliate IDs or earnings claims were invented.
- **Admin:** resources are CRUD-editable at `/admin` and persisted to `localStorage`.

---

## 4. Check-in value (why it was removed)

**"What did checking-in give back?" — Nothing.**

The old daily check-in was a `localStorage` counter that incremented on each visit and
showed a toast, with **no unlock, no benefit, and no reward**. It was pure gamification
theater with zero user value, so it was removed (along with achievements/badges and
streak-gated "exclusive access"). Visit tracking was retained in
`app/stores/engagement.ts` only so the notification bar can show an honest "welcome back"
greeting. Documented here explicitly so the decision is never re-litigated without a real
benefit in hand.

---

## 5. Pitfalls & fixes (what we learned)

- **`nuxt-security@2.6.0` requires Node ≥ 24** → `NODE_VERSION = "24"` (`.node-version`).
  `netlify.toml` still pins `22`; align it to 24 when you bump the security module.
- **esbuild peer conflict** → install with `npm install --legacy-peer-deps`.
- **Components rendered empty** → component auto-import needs `pathPrefix: false` in
  `nuxt.config.ts` (atoms/molecules/organisms resolve by basename).
- **PWA navigateFallback** → `null` for SSG, otherwise the SW precaches the wrong shell.
- **OG image crashes SSR dev** → `ogImage.enabled: false` in `$development`.
- **i18n `langDir` doubled path (`i18n/i18n/locales/…`)** → remove `langDir`; let the module
  default to `i18n/locales/`.
- **i18n `dropMessageCompiler`** must NOT be enabled — translations use `{name}` / `{count}`
  interpolation.
- **Missing `emptyCategory` / `caseStudy.resultItem*` keys** → fixed; a pre-existing lockstep
  gap where `OCaseStudy.vue` rendered raw key strings in es/am. `scripts/check-i18n-lockstep.cjs`
  now guards against this regressing.
- **`oxc-walker` parse error** → add `oxc-parser` as a dev dependency.
- **Duplicate `rateLimit.ts` util** → removed; keep `rateLimiter.ts`.
- **`connect-src 'self'` CSP** → the market feed is fetched server-side (Nitro route) and the
  browser only talks same-origin, so no CSP change is needed for real market data.

---

## 6. Quick start / build / deploy

```bash
npm install --legacy-peer-deps     # first time (esbuild peer conflict)
npm run dev                        # local dev (http://localhost:3000)

npm run test:unit                  # Vitest unit tests (fast)
npm run test                       # Vitest + Playwright e2e (needs browsers + dev server)

npm run build                      # SSR build (nuxi build) — also produces the API route
npm run generate                   # static SSG (nuxi generate) → .output/public
npx netlify deploy --prod --dir=.output/public
```

**DoD gate:** `npm run build` must pass and `npm run test:unit` must pass. The market-filter
logic is covered by `tests/unit/utils/marketFilter.spec.ts`. e2e (`npm run test`) additionally
needs Playwright browsers installed and the dev server up; it is optional in constrained
environments.

**Lockstep check:** `node scripts/check-i18n-lockstep.cjs` (0 mismatches required).
