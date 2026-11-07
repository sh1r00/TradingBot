# Money Conversion SPA

A Nuxt 4 statically-generated PWA that curates legitimate, vetted money-making resources —
translated into English, Español, and አማርኛ — and surfaces a **real** live market-movers feed
from CoinGecko. No fabricated activity, no invented earnings claims.

**Live:** [trading-bot-sh1r00-332.netlify.app](https://trading-bot-sh1r00-332.netlify.app)
**GitHub:** [sh1r00/TradingBot](https://github.com/sh1r00/TradingBot)

[![shiro](https://img.shields.io/badge/shiro-where_style_meets_function-6C5CE7)](https://shiro-portfolio-sh1r00.netlify.app)

---

## What it does

- **Six curated money-making methods** — gaming rewards (Scrambly), commission-free investing
  (Webull), AI-work platforms (Mercor), freelancing (Upwork & Fiverr), affiliate marketing
  (Amazon Associates), and reselling (Depop). Each has a translated title/description and a
  3-paragraph "how it works / how to start / realistic expectations" guide.
- **Honest live market feed** — real CoinGecko "significant movers", filtered server-side.
- **Income calculator**, share/engagement sections, and an admin CRUD panel for the links.

## Tech stack

Nuxt 4 · Vue 3 · Pinia · Tailwind CSS v4 · Material Design 3 · `@nuxtjs/i18n` (en/es/am) ·
`@nuxtjs/seo` · `@vite-pwa/nuxt` · `nuxt-security` · Nitro (server route) · Netlify (static).

## Architecture highlights

- **Atomic components** — `app/components/{atoms,molecules,organisms}`.
- **i18n lockstep** — all strings in `i18n/locales/{en,es,am}.json`; verified identical key sets
  via `scripts/check-i18n-lockstep.cjs`.
- **Real market feed** — `server/api/market/activity.get.ts` → free CoinGecko API →
  `app/utils/marketFilter.ts` (pure, unit-tested) → `OLiveActivityFeed.vue`. No keys required.
- **Resources store** — seeds carry an i18n `key` + official `url` + an empty `trackingUrl`
  (affiliate IDs are PENDING, flagged in `TODO_POST_DEPLOY.md`).

## Quick start

```bash
npm install --legacy-peer-deps   # first time only
npm run dev                      # http://localhost:3000
```

## Build & deploy

```bash
npm run test:unit                # Vitest unit tests
npm run build                    # SSR build (includes the API route)
npm run generate                 # static SSG → .output/public
npx netlify deploy --prod --dir=.output/public
```

## Notes

- Dark mode is SSR-safe via a Pinia store + `useCookie()` persistence.
- PWA: autoUpdate service worker, offline fallback, 192/512/maskable icons.
- CSP headers via `nuxt-security` (SSG-safe, `hashScripts: false`).
- i18n: `prefix_except_default` — `en` has no prefix; `/es` and `/am` are prefixed.

## 📚 Full documentation

Architecture, the resources feature, the market-feed backend plan, and every pitfall + fix:
**[DOCUMENTATION.md](DOCUMENTATION.md)**. Deferred/spoofed data to fix before go-live:
**[TODO_POST_DEPLOY.md](TODO_POST_DEPLOY.md)**.

---

*Made with ❤️ by shiro — rasisg@gmail.com — github.com/sh1r00*
