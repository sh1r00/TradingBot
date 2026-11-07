# TradingBot — TODO & spoofed / placeholder data (⚠️ MUST fix before go-live)

Deferred work + fake data that must be replaced with real content before this ships.
This list is exhaustive: anything that ships a fabricated number, an unverified claim, or a
literal placeholder is flagged here.

## 🔑 Blocked — needs keys / credentials (owner to supply)

- **Live market-data backend (scheduled + DB)** — the filter (`app/utils/marketFilter.ts`) +
  CoinGecko route (`server/api/market/activity.get.ts`) + tests are DONE, and the frontend
  already renders real CoinGecko movers directly through that route (no key needed). The
  *scheduled-ingest → Supabase* upgrade (see `docs/live-data-backend.md`) still needs:
  - A **Supabase project URL + anon/service key** (dedicated schema/project for TradingBot).
  - A scheduled host decision: **Netlify Scheduled Functions** or Supabase `pg_cron`.
  - No SSR switch required — the feed read is a direct browser → Supabase / Netlify Function.
- **Affiliate links** — the 6 resources use official (non-tracking) URLs with an empty
  `trackingUrl` field (see "Affiliate links" below). Paste tracking links when accounts exist.

## Spoofed / placeholder data (do NOT go live with these)

### ✅ RESOLVED — Live activity feed (was 100% fabricated)
- **Fixed.** `app/data/liveActivity.ts` (`SEED_ACTIVITIES` + `SIMULATED_MESSAGES`) and the
  fake `setInterval` (a new invented event every 8–15s) have been **removed**.
- `app/components/organisms/OLiveActivityFeed.vue` now fetches **real** CoinGecko data via
  `server/api/market/activity.get.ts` (significant movers only). No simulated events.

### Case-study metrics — fabricated numbers
- `i18n/locales/*.json` → `caseStudy` namespace: `metric1Value: "+340%"`,
  `metric2Value: "14 days"`, `metric3Value: "10,000+"` and `resultItem1/2/3` claims.
- These are invented. Replace with real, verifiable results or remove the section.

### Success story — fabricated testimonial
- `i18n/locales/*.json` → `successStory`: "Earning $5,000/month online",
  "Built multiple income streams", "Financial freedom…". No named, real person behind it.
- Replace with a real, attributed story or remove.

### Founder story — literal placeholder + invented narrative
- `i18n/locales/*.json` → `founder.name`: **"Founder Name"** (literal placeholder), plus an
  invented `quote`/`story1`/`story2` and `imageAlt`. `OFounderStory.vue` renders an empty
  `AAvatar` (no real portrait).
- Fill in the real founder name/story + a real portrait, or remove the section.

### Social proof — unverified "thousands"
- `i18n/locales/*.json` → `hero.socialProof`: "Join thousands already growing their income".
  Unverified. Back it with a real number or soften to something factual.
- **`app/components/molecules/MSocialProof.vue`** hardcodes "N people active now" from a
  `activeUsers` prop, and the "person/people active now" text is **not i18n'd**. Note: this
  component is currently **dead code** (not rendered anywhere) — either wire it to real
  analytics + i18n or delete it.

### Stale copy referencing removed features
- `app/pages/login.vue` + `app/pages/signup.vue` SEO descriptions and the signup body still
  promise "exclusive content, daily check-ins, and free tools". Daily check-ins were removed
  (see below) and "exclusive content"/auth are not actually wired. Update or remove.

### Admin form validation messages — missing i18n keys
- `app/components/organisms/OAdminPanel.vue` references `validation.required`,
  `validation.minLength`, `validation.maxLength`, `validation.invalidUrl`,
  `validation.invalidFileType`, `validation.fieldsNeedAttention` — **none exist** in
  `i18n/locales/*.json` (only `validation.fileTooLarge` does). These render as raw keys.
- Also `toast.linkCreated`, `toast.linkUpdated`, `toast.linkDeleted` are referenced but absent.

### Admin thumbnail placeholders
- `OAdminPanel.vue` `getThumbnailUrl()` shells out to `https://placehold.co/...` for missing
  thumbnails. Replace with local/self-hosted placeholders (external dependency + potential CSP).

## Affiliate links — pending (owner does not have links yet)
- The 6 resources in `app/stores/resources.ts` have `url` = **official** signup URL (no
  tracking) and `trackingUrl` = `''` (empty). When affiliate accounts are set up, paste the
  tracking links into `trackingUrl`:
  1. Scrambly (gaming) — `https://scrambly.io`
  2. Webull (investing) — `https://www.webull.com`
  3. Mercor (AI work) — `https://mercor.com`
  4. Upwork & Fiverr (freelancing) — `https://www.upwork.com`
  5. Amazon Associates (affiliate marketing) — `https://affiliate-program.amazon.com`
  6. Depop (sell/resell) — `https://www.depop.com`
- Resources are admin-editable (`/admin` → CRUD in the resources store), so links can be
  added via the UI without a code deploy. **Never invent affiliate IDs or earnings claims.**

## Removed (2026-11-06): gamification that returned no real value
- Daily check-in (`ODailyCheckIn`), achievements/badges (`OAchievementBadge`,
  `MAchievementBadge`, `useAchievements`), and streak-gated "exclusive access"
  (`OExclusiveAccess`) were removed — **checking in incremented a localStorage counter with no
  user benefit** (no unlock, no reward). Visit tracking (`markVisit`) was moved to the layout
  so the "welcome back" greeting still works honestly. See `DOCUMENTATION.md` §4.
