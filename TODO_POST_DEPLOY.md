# TradingBot — TODO & spoofed / placeholder data (⚠️ MUST fix before go-live)

Deferred work + fake data that must be replaced with real content before this ships.

## 🔑 Blocked — needs keys / credentials (owner to supply)

- **Live market-data backend** — the filter (`app/utils/marketFilter.ts`) + CoinGecko route
  (`server/api/market/activity.get.ts`) + tests are DONE. Wiring them end-to-end needs:
  - A **Supabase project URL + anon/service key** (dedicated schema/project for TradingBot).
  - A scheduled host decision: **Netlify Scheduled Functions** (TradingBot is already on
    Netlify) **or** Supabase `pg_cron`.
  - No SSR switch required — the feed read is a direct browser → Supabase / Netlify Function.
- **Affiliate links** — the 6 resources use official (non-tracking) URLs. When affiliate
  accounts are set up, paste the tracking links (see "Affiliate links" below).

## Spoofed / placeholder data (do NOT go live with these)

### Live activity feed — 100% fabricated
- `app/data/liveActivity.ts` — `SEED_ACTIVITIES` + `SIMULATED_MESSAGES` are hardcoded fake
  events ("Someone in New York just explored…", "A new member joined from London", etc.).
- `app/components/organisms/OLiveActivityFeed.vue` renders these and *invents* a new fake
  event every 8–15s via `setInterval`.
- **Fix (in progress):** replace with the real market-data feed (see
  `docs/live-data-backend.md` — CoinGecko → backend filter → Supabase → frontend).

### Case-study metrics — fabricated numbers
- `i18n/locales/*.json` → `caseStudy` namespace: `metric1Value: "+340%"`,
  `metric2Value: "14 days"`, `metric3Value: "10,000+"` and `resultItem*` claims.
- These are invented. Replace with real, verifiable results or remove the section.

### Success story — fabricated testimonial
- `i18n/locales/*.json` → `successStory`: "Earning $5,000/month online",
  "Built multiple income streams", "Financial freedom…". No named, real person behind it.
- Replace with a real, attributed story or remove.

### Founder story — literal placeholder + invented narrative
- `i18n/locales/*.json` → `founder.name`: **"Founder Name"** (literal placeholder),
  plus an invented `quote`/`story1`/`story2` and `imageAlt`.
- Fill in the real founder name/story + a real portrait, or remove the section.

### Social proof — unverified "thousands"
- `i18n/locales/*.json` → `hero.socialProof`: "Join thousands already growing their income".
- Unverified claim. Either back it with a real number or soften to something factual.
- Also: `MSocialProof.vue` ("N people active now") — confirm it is actually rendered; if so,
  the `activeUsers` number must come from real analytics, not a hardcoded value.

## Affiliate links — pending (owner does not have links yet)
- The 6 resources in `app/stores/resources.ts` currently point at **official** signup URLs
  (no affiliate tracking). When affiliate accounts are set up, add the tracking links:
  1. Scrambly (gaming) — `https://scrambly.io`
  2. Webull (investing) — `https://www.webull.com`
  3. Mercor (AI work) — `https://mercor.com`
  4. Upwork & Fiverr (freelancing) — `https://www.upwork.com`
  5. Amazon Associates (affiliate marketing) — `https://affiliate-program.amazon.com`
  6. Depop (sell/resell) — `https://www.depop.com`
- Resources are already admin-editable (`/admin` → CRUD in the resources store), so links can
  be added via the UI without a code deploy.

## Removed (2026-11-06): gamification that returned no real value
- Daily check-in (`ODailyCheckIn`), achievements/badges (`OAchievementBadge`,
  `MAchievementBadge`, `useAchievements`), and streak-gated "exclusive access"
  (`OExclusiveAccess`) were removed — checking in incremented a localStorage counter with no
  user benefit. Visit tracking (`markVisit`) was moved to the layout so the "welcome back"
  greeting still works honestly.
