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

- **Brevo email-drip wiring** — `OLeadCapture.vue` (email capture) and `OFreeToolkit.vue`
  (gated "free tools" CTA) are currently **decorative**: `OLeadCapture.handleSubmit` only
  simulates a POST and clears the field — nothing is persisted or delivered. Wire both to
  **Brevo** (transactional email + a contact list) so captured emails land in a list and
  trigger the free-toolkit drip. Needs: a **Brevo API key + contact-list ID**. Until then,
  these forms silently discard every submission.

- **Affiliate links** — fully wired via `useAffiliateLinks().hrefFor()`; each link prefers a
  `NUXT_PUBLIC_AFFILIATE_<KEY>` env var and falls back to the official URL. Awaiting the
  owner's tracking URLs (see "Affiliate links" below).

- **Supabase Auth (real auth)** — the mock admin login and the localStorage user-auth shim
  are replaced with Supabase Auth (`@supabase/supabase-js`). Until keys are set, `/login`,
  `/signup`, password reset and `/admin` show an honest "not configured" state. Needs a
  **Supabase project** (keys in `.env.example`):
  - `NUXT_PUBLIC_SUPABASE_URL`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NUXT_PUBLIC_ADMIN_EMAILS` (comma-separated admin emails)
  Optional hardening: enforce the admin role server-side (RLS / `profiles.is_admin`).

## Spoofed / placeholder data (do NOT go live with these)

### ✅ RESOLVED — Live activity feed (was 100% fabricated)
- **Fixed.** `app/data/liveActivity.ts` (`SEED_ACTIVITIES` + `SIMULATED_MESSAGES`) and the
  fake `setInterval` (a new invented event every 8–15s) have been **removed**.
- `app/components/organisms/OLiveActivityFeed.vue` now fetches **real** CoinGecko data via
  `server/api/market/activity.get.ts` (significant movers only). No simulated events.

### ✅ RESOLVED — Fabricated social-proof sections removed from the homepage
- `OCaseStudy.vue`, `OSuccessStory.vue`, and `OFounderStory.vue` are **no longer rendered**
  on `app/pages/index.vue` (their metrics / testimonials / founder story were invented). The
  component files are **kept on disk**, and the `caseStudy` / `successStory` / `founder` i18n
  namespaces remain — reintroduce ONLY with real, verifiable data:
  - `caseStudy`: `metric1Value: "+340%"`, `metric2Value: "14 days"`, `metric3Value: "10,000+"`
    and the `resultItem1/2/3` claims are invented.
  - `successStory`: "Earning $5,000/month online", "Built multiple income streams", etc. —
    needs a real, attributed person.
  - `founder`: `name` is still the literal **"Founder Name"** placeholder, plus an invented
    `quote` / `story1` / `story2` and an empty `AAvatar` (no real portrait).

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

### ✅ RESOLVED — Auth moved to Supabase Auth (was localStorage, bypassable)
- The localStorage auth shim in `app/stores/auth.ts` (plaintext passwords + client-side
  lockout/throttle) is **gone**. It's now a thin wrapper over Supabase Auth
  (`signUp` / `signInWithPassword` / `resetPasswordForEmail` / `updateUser`), so credential
  checks and rate limiting happen server-side. `isConfigured` is false until the Supabase
  keys are set, and every auth method returns `reason: 'not-configured'`.

### ✅ RESOLVED — Admin uses real Supabase auth + email allowlist
- `app/pages/admin.vue` no longer accepts "any non-empty password". It now requires a real
  Supabase session whose email is in `NUXT_PUBLIC_ADMIN_EMAILS`. Note: the allowlist is a
  UI-level gate; the resource CRUD is still localStorage-only (a DB for persistence is a
  separate item — see the live-data-backend work below).

## Affiliate links — wired via env, awaiting the owner's URLs

Affiliate/tracking links are now fully wired: every outward link (resource card, leaderboard
row, and the in-depth guide CTA) resolves through `useAffiliateLinks().hrefFor()`, which
prefers an env-supplied tracking URL and falls back to the official non-tracking URL.

**How to switch links on (no code change needed):**
1. Paste each affiliate URL into `.env` (see `.env.example` for the key names).
2. Set the same vars on Cloudflare Pages (project `trading-bot`).
3. Rebuild + redeploy. Empty/absent vars fall back to the official URL.

**⚠️ AFFILIATE LINK URLS — PASTE HERE (owner to supply):**
1. Scrambly (gaming) — `NUXT_PUBLIC_AFFILIATE_SCRAMBLY=___________`
2. Webull (investing) — `NUXT_PUBLIC_AFFILIATE_WEBULL=___________`
3. Mercor (AI work) — `NUXT_PUBLIC_AFFILIATE_MERCOR=___________`
4. Depop (reselling) — `NUXT_PUBLIC_AFFILIATE_DEPOP=___________`
5. Upwork & Fiverr (freelancing) — `NUXT_PUBLIC_AFFILIATE_UPWORK_FIVERR=___________`
6. Amazon Associates (affiliate marketing) — `NUXT_PUBLIC_AFFILIATE_AMAZON_ASSOCIATES=___________`

**Never invent affiliate IDs or earnings claims.** Current official (non-tracking) URLs for reference:
  1. Scrambly — `https://scrambly.io`
  2. Webull — `https://www.webull.com`
  3. Mercor — `https://mercor.com`
  4. Depop — `https://www.depop.com`
  5. Upwork & Fiverr — `https://www.upwork.com`
  6. Amazon Associates — `https://affiliate-program.amazon.com`

## Static-host feed caveat
- On the **static Netlify deploy** (SSG), the `/api/market/activity` server route does **not**
  run, so `OLiveActivityFeed.vue` hides itself entirely (no "unavailable" box). The
  server-side TTL cache + per-IP rate limit in `server/api/market/activity.get.ts` only apply
  when the route actually executes (an SSR-capable runtime / Netlify Function). The live feed
  therefore only shows on SSR deployments; the static build's collapsed "show more" group
  simply contains no live-feed section.

## Removed (2026-11-06): gamification that returned no real value
- Daily check-in (`ODailyCheckIn`), achievements/badges (`OAchievementBadge`,
  `MAchievementBadge`, `useAchievements`), and streak-gated "exclusive access"
  (`OExclusiveAccess`) were removed — **checking in incremented a localStorage counter with no
  user benefit** (no unlock, no reward). Visit tracking (`markVisit`) was moved to the layout
  so the "welcome back" greeting still works honestly. See `DOCUMENTATION.md` §4.
