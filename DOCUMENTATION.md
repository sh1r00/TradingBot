# Money Conversion SPA (TradingBot) — Documentation

## Functionality
Curated money-making resources + income calculator. Trading tools, financial calculators, and resource aggregation. i18n (en/es/am), PWA, dark mode.

## Stack
Nuxt 4 · Vue 3 · Pinia · Tailwind v4 · @nuxtjs/i18n · @nuxtjs/seo · @vite-pwa/nuxt · nuxt-security

## Steps Taken
- Nuxt 4 SPA scaffold with financial calculators.
- i18n (3 locales) + PWA + SEO.
- Linting + formatting + unit/e2e/coverage test setup.

## Pitfalls & Fixes
- **nuxt-security@2.6.0** needs Node ≥24 → `NODE_VERSION = "24"`.
- **esbuild peer conflict** → `npm install --legacy-peer-deps`.
- **components auto-import** — `pathPrefix: false` or sections render empty.
- **PWA navigateFallback** — `null` for SSG (no precached index.html).

## Deployment
SSG (`nuxi generate` → `.output/public`), Netlify.
