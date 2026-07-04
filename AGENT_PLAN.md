# Agent Development Plan: Money Conversion SPA

**Project**: Nuxt 4 Static PWA with Material Design 3 & Viral Conversion Framework  
**Status**: 40/104 tasks completed (38% done)  
**Phase**: Component Implementation → Pages → Testing → Deploy  
**Target**: Production-ready static site for Netlify  

---

## 1. Project Overview

### Vision
A viral-optimized resource discovery platform converting internet users into customers via:
- Curated external money-making links (affiliate + educational)
- Gamified engagement (achievements, leaderboard, daily check-ins)
- Social proof (live activity feed, case studies, founder story)
- Material Design 3 accessible UI with i18n (en/es/am)

### Tech Stack
```
Nuxt 4.4.7 → Vue 3.5 (Composition API + <script setup>)
Tailwind v4 (via @tailwindcss/vite plugin, no config file)
Material Design 3 (CSS vars + @theme mapping)
Pinia stores (darkMode, pwaInstall, engagement, resources, toast)
@nuxtjs/i18n (lazy-loaded JSON, prefix_except_default)
@vite-pwa/nuxt (registerType: autoUpdate, offline-first)
@nuxtjs/seo (OG images, schema.org, sitemap)
nuxt-security (CSP headers, SSG-safe)
```

### Key Constraints
1. **Atomic Design**: A* (pure render), M* (local state), O* (full power) — ENFORCED
2. **No prop drilling**: Molecules/Organisms use Pinia stores + composables, never inherit parent data
3. **Form validation**: ALL forms use `useFormValidation` composable + inline errors + Toast summary
4. **Sanitization**: Client-side + server-side; all user inputs stripped of XSS vectors
5. **Accessibility**: WCAG 2.1 AA; focus management, skip-to-content, dark mode toggle in ClientOnly
6. **Testing**: 80% coverage on atoms (vitest), E2E critical paths (playwright)
7. **No SSR in dev**: OG images disabled, CSP doesn't hash scripts, dark mode in ClientOnly

---

## 2. Remaining Work (64 Tasks)

### 2.1 Organisms (HIGH PRIORITY)
**Status**: 8/20 complete (ONavbar, OFooter, ONotificationBar, OInstallPrompt, OHeroSection, OResourceGrid, OAdminPanel, OLeaderboard completed; 12 remaining)  
**Owner**: Main component development loop  

**Viral Framework Mapping**: Each organism MUST map to ≥1 of 6 viral principles:
- **Social Currency** (Req 8): Feel like insider, exclusive knowledge, visible achievements
- **Triggers** (Req 9): Time-based reminders, contextual notifications, daily check-in
- **Emotion** (Req 10): High-arousal visuals, pain-point contrast, excitement
- **Public Visibility** (Req 11): Leaderboards, live activity feed, social proof, shareable badges
- **Practical Value** (Req 12): Free tools, calculators, actionable templates, copy-to-clipboard
- **Stories** (Req 13): Founder narrative, before/after case studies, long-form content

#### Layout & Navigation (4) — COMPLETE
- [x] ONavbar.vue — responsive header, logo, nav links, dark toggle (ClientOnly), language switcher
  - _Req 6.4, 16.4_
- [x] OFooter.vue — semantic `<footer>`, links, copyright, language attribution  
  - _Req 16.4_
- [x] ONotificationBar.vue — contextual time-based messages with `role="alert"`, personalized welcome-back
  - _Req 9.1, 9.2_
- [x] OInstallPrompt.vue — PWA install banner, shown ≤1s after `beforeinstallprompt`, dismissed via localStorage
  - _Req 5.9–5.11_

#### Hero & Conversion (5) — IN PROGRESS
- [x] OHeroSection.vue — landing hero with CTA, i18n support, respects `prefers-reduced-motion`
  - _Req 16.6_; **Viral**: Social Currency
- [x] OLeaderboard.vue — top-shared resources, rank indicators, `role="list"` markup
  - _Req 8.1, 14.5_; **Viral**: Public Visibility
- [ ] OAchievementBadge.vue — award badges on milestones (first share, profile setup, referral), Toast announce
  - _Req 8.2–8.4_; **Viral**: Social Currency
- [ ] OCaseStudy.vue — before/after success stories, proper heading hierarchy, `aria-labelledby`
  - _Req 13.2–13.4_; **Viral**: Stories
- [ ] OFounderStory.vue — semantic `<article>`, proper heading levels, captioned images
  - _Req 13.1_; **Viral**: Stories

#### Content & Resources (4) — IN PROGRESS
- [x] OResourceGrid.vue — all published links grouped by category, skeleton loading (`aria-busy`), empty state per category, external links in new tab (`rel="noopener noreferrer"`)
  - _Req 2.1–2.6, 14.5_
- [ ] OFreeToolkit.vue — gated toolkit landing, keyboard-operable interactive tools, email capture form (useFormValidation)
  - _Req 12.1, 14.5_; **Viral**: Practical Value
- [ ] OContentPreviews.vue — expandable detail sections (`aria-expanded`), copy-to-clipboard summaries, Toast confirm
  - _Req 12.2–12.4_; **Viral**: Practical Value
- [ ] MSocialProof.vue — active user count, recent avatars (descriptive alt text), share labels
  - _Req 11.1, 11.3, 11.4_; **Viral**: Public Visibility

#### Forms & Engagement (4) — IN PROGRESS
- [x] OAdminPanel.vue — authenticated dashboard, CRUD form (MFormField + useFormValidation), create/edit/delete flows, file upload (JPEG/PNG/WebP ≤2MB), drag-drop reorder, Toast confirmations
  - _Req 1.1–1.8, 14.5, 20.1–20.14_
- [ ] ODailyCheckIn.vue — daily engagement form, progress indicator (`role="progressbar"`, `aria-valuenow`), Toast confirm
  - _Req 9.3, 9.4_; **Viral**: Triggers
- [ ] OLeadCapture.vue — email capture form (useFormValidation + sanitization), rate-limited (3 per IP per 15min), Toast confirm + error
  - _Req 20.1–20.14, 21.9_; **Viral**: Practical Value
- [x] OLiveActivityFeed.vue — recent user actions, `aria-live="polite"`, throttled updates (max 1 per 10s)
  - _Req 11.2, 14.5_; **Viral**: Public Visibility

#### Utility Organisms (3) — TO-DO
- [ ] OCountdownTimer.vue — limited-time featured resources, `role="timer"` with accessible labels
  - _Req 10.2_; **Viral**: Emotion (FOMO)
- [ ] OIncomeCalculator.vue — compute potential earnings, announce via `aria-live="polite"`, high-arousal visuals (respects `prefers-reduced-motion`)
  - _Req 10.1, 10.4, 14.5_; **Viral**: Emotion + Practical Value
- [ ] Pain-point sections — contrast status quo with opportunities, proper heading hierarchy
  - _Req 10.3_; **Viral**: Emotion

**Acceptance Criteria for Each Organism**:
- **Props & Types**: Strictly typed in `<script setup lang="ts">`, no any types
- **State**: Use Pinia stores + composables (no prop drilling), no local state except UI toggles (open/closed)
- **Internationalization**: 100% of user text via `$t('key')` with translations in all 3 locales (en/es/am)
- **Form Validation**: All forms use `useFormValidation`, validate on blur + submit, inline errors + Toast summary on failure
- **Sanitization**: All user inputs sanitized via `sanitizeText()`, `sanitizeUrl()`, `sanitizeEmail()` before render/persist
- **Accessibility**: WCAG 2.1 AA — semantic HTML, ARIA labels (role, aria-live, aria-describedby, aria-invalid, aria-expanded), focus-visible indicators (2px ring, 3:1 contrast), 44px touch targets, skip-to-content link
- **Responsive**: Mobile-first, Tailwind breakpoints (sm/md/lg/xl), tested on mobile/tablet/desktop
- **Dark Mode**: Use M3 semantic tokens (e.g., `bg-primary`, `text-on-surface`, `border-outline-variant`)
- **Testing**: Unit test in `tests/unit/organisms/` (smoke test + snapshots), E2E test for critical flows
- **Viral Framework**: Map to ≥1 of 6 viral principles (annotation in comment)

---

### 2.2 Pages (HIGH PRIORITY)
**Status**: 3/3 stubs exist; 0/3 complete  

#### index.vue (Main Conversion Funnel) — Req 3.1, 3.3
**Composition**: OHeroSection → OLeaderboard → ONotificationBar → OIncomeCalculator → OLiveActivityFeed → OFreeToolkit → OFounderStory → OFooter

**Requirements**:
- Render all hero/social/emotion/story organisms in viral sequence
- Schema.org structured data (WebSite, Organization) in JSON-LD format
- OG meta tags: og:title, og:description, og:image, og:url, og:type
- Full i18n support (en/es/am) with `useI18n()`
- SEO configuration via nuxt-seo module + `useSeoMeta()`
- Responsive design: mobile-first, Tailwind breakpoints
- Dark mode via CSS vars

**Acceptance Criteria**:
- Page renders without errors in dev + production build
- All text translated in all 3 locales
- SEO meta tags verifiable in page source
- OG image generated at build time (production)
- Mobile-responsive: tested on 375px, 768px, 1024px+ viewports
- E2E test: navigate to index → all organisms visible → click CTA → navigate to resources

#### resources.vue (Resource Discovery) — Req 2.1–2.6, 3.1, 3.4
**Composition**: OResourceGrid (all published links, grouped by category, filtered/sorted)

**Requirements**:
- Display all ResourceLink entries grouped by category in admin-defined order
- MResourceCard per link: title, truncated description (≤150 chars + ellipsis), category badge, thumbnail (fallback on error)
- Skeleton loading state with `aria-busy="true"` on container
- Empty state message per category (empty state text via i18n)
- External links open in new tab: `rel="noopener noreferrer"`
- SEO meta tags, hreflang alternate tags for all 3 locales
- Responsive grid: 1 col mobile, 2 col tablet, 3+ col desktop

**Acceptance Criteria**:
- Page renders all ResourceLinks without errors
- Category grouping preserved from resources store
- Loading/empty/error states display correctly
- All links open correctly in new tab
- Responsive on mobile/tablet/desktop
- E2E test: load page → verify skeleton → links load → click link → new tab opens

#### admin.vue (Admin Panel) — Req 1.1–1.8
**Composition**: OAdminPanel (authenticated content management)

**Requirements**:
- Auth-gated dashboard (placeholder auth for MVP; hardcode for testing)
- Full CRUD: create, read, update, delete ResourceLinks
- **Create form fields** (MFormField + useFormValidation):
  - `title`: string, 3–100 chars, required (validation error if empty or exceeds limit)
  - `description`: string, 10–500 chars, required, character count display at 80%+
  - `category`: string, required (select/dropdown)
  - `url`: string, required, must start with `https://`, valid URL syntax (Req 1.5), max 2048 chars
  - `thumbnail`: optional, accepts JPEG/PNG/WebP, max 2MB (Req 1.8)
- **Edit form**: pre-populate all fields, same validation
- **Delete flow**: confirmation dialog (MConfirmDialog), Toast confirm on success
- **Reorder**: drag-drop to set display order (Req 1.6)
- All validation errors via `useFormValidation` (inline + Toast summary on submit)
- All form submissions trigger Toast (success/error with reason)
- Loading, error, and empty states
- Full i18n support

**Acceptance Criteria**:
- Create: fill valid form → submit → resource persists in store
- Edit: select resource → edit field → submit → Toast confirm
- Delete: select resource → delete → confirm dialog → Toast confirm
- Reorder: drag link → drop → order persists in store
- Validation: invalid URL → Toast error; exceed char limit → Toast error
- Responsive: works on mobile (small form width)
- E2E test: auth → create resource → verify in grid → edit → delete → confirm

---

### 2.3 PWA & Offline (MEDIUM PRIORITY)
**Status**: Config exists; icons + offline.html missing  
**Requirements**: Req 5 (PWA), Req 22 (offline infrastructure)

#### Icons & Manifest — Req 5.12
- [ ] Generate PWA icons via `scripts/generate-icons.mjs`:
  - 192×192 PNG (`any` purpose)
  - 512×512 PNG (`any` purpose)
  - 512×512 maskable PNG (adaptive icon format for modern Android)
- [ ] Verify manifest.webmanifest in nuxt.config.ts contains:
  - `start_url: '/'`
  - `id: '/'`
  - `scope: '/'`
  - `display: 'standalone'`
  - `theme_color: '#6750A4'` (primary seed)
  - `background_color: '#FFFBFE'` (surface light)
  - Icons array with all 3 entries + purposes

#### Offline Experience — Req 5.1–5.8
**Service Worker Configuration**:
- `registerType: 'autoUpdate'` — silent background updates, no user prompt
- `skipWaiting: true`, `clientsClaim: true` — instant activation of new SW
- Precache all static assets via `globPatterns`

**Caching Strategies**:
| Resource | Strategy | Config | Req |
|----------|----------|--------|-----|
| HTML pages | NetworkFirst | 3s timeout, fallback to cache | 5.3 |
| Hashed JS/CSS bundles | CacheFirst | 365-day expiration | 5.5 |
| Images | CacheFirst | 30-day expiration, max 60 entries | 5.6 |
| Translation JSON | StaleWhileRevalidate | Always check for fresh | 5.7 |
| SW + manifest | Network only | `Cache-Control: max-age=0, must-revalidate` | — |

- [ ] Create `public/offline.html` (Req 5.4):
  - Styled fallback page indicating content unavailable without network
  - Semantic HTML, accessible message
  - Shown when NetworkFirst timeout + cache miss

#### PWA Testing
- [ ] Lighthouse PWA audit: target ≥95
  - Install banner triggers correctly
  - Manifest valid + icons present
  - HTTPS enforced (Netlify auto)
  - Service worker registers + responds to requests
- [ ] Offline test: load page → disable network → SW serves cached content
- [ ] Update test: new SW activates → old content replaced
- [ ] Install test: Chrome Android → install banner visible → installable

---

### 2.4 Testing (HIGH PRIORITY)
**Status**: 20% (atoms tested, molecules/organisms/pages stubbed)  
**Target**: 80% coverage (atoms mandatory, molecules/organisms/utils)  
**Requirements**: Req 17 (testing)

#### Unit Tests (Vitest) — Req 17.3, 17.5–17.6

**Atoms** (80% coverage mandatory):
- [x] Each atom tests: props → DOM output, events emit correctly, ARIA attributes present
- [x] Examples: AButton, AInput, AImage, AIcon, ABadge, ASpinner, ALink, ASwitch

**Molecules** (smoke tests + snapshots):
- [ ] MResourceCard: truncate description at 150 chars, category badge renders, thumbnail fallback
- [ ] MFormField: inline error display, `aria-invalid`, character count at 80%+
- [ ] MToastItem: type-based styling, close button, pause on hover/focus
- [ ] MAchievementBadge: render achievement badge with unlock animation
- [ ] MCountdown: render timer countdown
- [ ] Other molecules TBD

**Organisms** (smoke tests + critical flows):
- [ ] ONavbar: render links, language switcher, dark toggle in ClientOnly
- [ ] OFooter: render footer links, copyright
- [ ] OHeroSection: render CTA, respect prefers-reduced-motion
- [ ] OAdminPanel: mount form, validate required fields, emit CRUD actions
- [ ] OResourceGrid: render skeleton loading, resource cards, empty state
- [ ] OLeaderboard: render leaderboard with items
- [ ] ODailyCheckIn: render progress bar
- [ ] OLiveActivityFeed: render activity items, throttle updates
- [ ] Other organisms TBD

**Composables** (edge cases + state transitions):
- [x] `useFormValidation`: pristine → dirty → valid/invalid, trim whitespace, validate on blur+submit, firstInvalidField
- [x] `useToast`: add, remove, max 3 visible, auto-dismiss 5s, pause on hover/focus
- [x] `useLocaleHead`: generate hreflang tags, set `<html lang>`
- [x] Other: useI18n, useRouter integration

**Stores** (actions + state mutations):
- [x] `darkMode`: initialize from system + localStorage, toggle persists
- [x] `pwaInstall`: listen for beforeinstallprompt, dismiss persists
- [x] `toast`: add, remove, pause, resume, max 3 visible, auto-dismiss
- [x] `engagement`: badges, lastVisit, dailyCheckIns, sharesCount (localStorage persist)
- [x] `resources`: CRUD, reorder, fetch, error handling
- [ ] **Property tests** (via fast-check):
  - Property 1: Resource Link CRUD Round-Trip (Req 1.2, 1.3)
  - Property 3: Display Order Persistence (Req 1.6)
  - Property 6: Resource Grouping and Display Order (Req 2.1)
  - Property 8: Toast Timer Pause and Resume (Req 7.5, 7.7)
  - Property 9: Toast Queue Maximum Visibility (Req 7.7)

**Utils** (pure function testing):
- [x] `sanitize.ts`: sanitizeText (strip HTML), sanitizeUrl (require https://), sanitizeEmail (RFC 5322)
- [x] `rateLimiter.ts`: checkRateLimit (3 per IP per 15min), hashed IP tracking
- [x] `auditLog.ts`: format and persist sanitization rejections (no raw malicious input)
- [x] `a11y.ts`: contrast ratio calculation
- [ ] **Property tests** (via fast-check):
  - Property 2: URL Validation Rejects Non-HTTPS Protocols (Req 1.5, 20.5, 21.4)
  - Property 22: HTML/Script Sanitization (Req 21.1–21.2)
  - Property 23: HTML Entity Encoding Round-Trip (Req 21.2)
  - Property 24: Control Character Rejection (Req 21.5)
  - Property 25: Rate Limiting (Req 21.9)
  - Property 27: Silent Sanitization (Req 21.12)

#### E2E Tests (Playwright) — Req 17.2, 17.4

**Happy Path Tests**:
- [ ] **Navigation & Accessibility** (27.1):
  - Navigate: index → resources → admin → back
  - Tab order: correct focus sequence
  - Focus management: on route change, focus moves to main within 300ms
  - Landmarks: header, nav, main, footer with unique aria-labels
  - Skip-to-content link: visually hidden, visible on focus-visible, targets main
  - Aria-live regions: error toasts assertive, success toasts polite

- [ ] **Admin CRUD Flow** (27.2):
  - Create: fill form fields → submit → Toast success → resource appears in resources.vue
  - Validation failure: submit invalid data (missing required, exceed char limit) → inline errors + Toast summary
  - Edit: select resource → modify field → submit → Toast confirm
  - Delete: select resource → delete → confirm dialog → Toast confirm
  - Reorder: drag resource → drop → order persists

- [ ] **Form Validation** (per-form):
  - Lead Capture (OLeadCapture): invalid email → error; valid email → submit → Toast success
  - Daily Check-In (ODailyCheckIn): submit → progress bar updates → Toast confirm
  - Admin CRUD (OAdminPanel): all field validation, file upload (invalid type, exceeds size)

- [ ] **PWA Install & Offline** (27.3):
  - Install banner triggers on first visit
  - Install button → native prompt → app installs
  - Offline: disable network → previously loaded page renders from cache
  - Offline fallback: navigate to new page → offline.html displays

- [ ] **i18n Locale Switching** (27.4):
  - Click language switch → URL changes (`/es/`, `/am/`)
  - Content translates without reload
  - `<html lang>` attribute updates
  - hreflang tags correct in page source

**Performance & Accessibility Audits**:
- [ ] Lighthouse: >90 performance, >95 accessibility, ≥95 PWA, ≥80 SEO
- [ ] Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Accessibility: all interactive elements keyboard-accessible, WCAG 2.1 AA passed

---

### 2.5 Content & Localization (MEDIUM PRIORITY)
**Status**: Partial (en.json exists; es/am need expansion)  
**Requirements**: Req 6 (i18n)

#### i18n Locale Files — Req 6.1–6.6
All text MUST be translated in all 3 locales: English (en, default), Spanish (es), Amharic (am)

**Structure** (per locale JSON):
```json
{
  "app.title": "Money Conversion SPA",
  "nav.home": "Home",
  "nav.resources": "Resources",
  "nav.admin": "Admin",
  "button.share": "Share",
  "button.submit": "Submit",
  "validation.required": "This field is required",
  "validation.email": "Enter a valid email address",
  "validation.url": "URL must start with https://",
  "validation.minLength": "Minimum {min} characters required",
  "validation.maxLength": "Maximum {max} characters allowed",
  "validation.fileSize": "File must be ≤ {max}MB",
  "validation.filetype": "Only {types} files allowed",
  "toast.success.create": "Resource created successfully",
  "toast.error.network": "Network error. Please try again.",
  "aria.skipToContent": "Skip to main content",
  "aria.navMenu": "Navigation menu",
  "aria.mainContent": "Main content",
  "aria.footer": "Footer"
}
```

**Translation Coverage Checklist**:
- [ ] All UI text (buttons, labels, headings, links)
- [ ] All validation error messages (required, email, URL, char limit, file size, file type)
- [ ] All Toast messages (success, error, warning, info, summaries)
- [ ] All ARIA labels (landmarks, skip-to-content, form fields, alerts)
- [ ] All placeholder text (form inputs)
- [ ] All empty state messages
- [ ] All loading state messages
- [ ] Breadcrumbs, navigation, menu items
- [ ] Form labels and helper text
- [ ] Modal titles and descriptions
- [ ] Notifications and announcements
- [ ] i18n keys support interpolation: `{count}`, `{min}`, `{max}`, `{types}` (Req 6.6)

**Testing**: Verify all 3 locales have complete key coverage (no missing translations)

#### Content Data
- [ ] **Resource Links**: Seed data in `resources.json` or hardcoded in store (title, description, category, URL, thumbnail)
- [ ] **Case Studies**: Before/after success stories (2–3 examples) with proper heading hierarchy
- [ ] **Founder Story**: Narrative content with optional video embed
- [ ] **Achievement Badges**: Icons + names for milestones (first share, profile setup, referral, etc.)

---

### 2.6 Deployment & Performance (MEDIUM PRIORITY)
**Status**: Configuration in place; deployment pending  
**Requirements**: Req 3 (SEO), Req 4 (security headers)

#### SEO Configuration — Req 3.1–3.6
- [ ] **OG Meta Tags** (per page, generated at build time in production):
  - og:title, og:description, og:image, og:url, og:type
  - Req 3.1: @nuxtjs/seo module auto-generates from useSeoMeta()
- [ ] **Sitemap.xml** (Req 3.2):
  - All public routes (/, /es/, /am/, /resources, /es/resources, etc.)
  - changefreq: weekly for static content
  - priority: 1.0 for home, 0.8 for resources, 0.5 for others
- [ ] **Schema.org Structured Data** (Req 3.3, JSON-LD format):
  - WebSite schema (name, url, potentialAction)
  - Organization schema (name, logo, url, contactPoint)
  - Placed on home page `<script type="application/ld+json">`
- [ ] **Hreflang Alternate Tags** (Req 3.4–3.5):
  - Auto-generated by @nuxtjs/i18n + useLocaleHead()
  - `<link rel="alternate" hreflang="en" href="...">`
  - `<link rel="alternate" hreflang="es" href="...">`
  - `<link rel="alternate" hreflang="am" href="...">`
  - `<link rel="alternate" hreflang="x-default" href="...">`
- [ ] **OG Image Generation** (Req 3.5–3.6):
  - Disabled in dev (causes SSR crash)
  - Enabled in production via nuxt-og-image
  - Images generated at build time, stored in `.output/public`

#### Netlify Configuration — Req 4.1–4.5
- [ ] Verify `netlify.toml`:
  ```toml
  [build]
  command = "npm run generate"
  publish = ".output/public"
  
  [[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src 'self'"
  
  [[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "max-age=0, must-revalidate"
  
  [[headers]]
  for = "*.{json,js,css}"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"
  ```
- [ ] Environment variable: `NUXT_PUBLIC_BASE_URL` set in Netlify UI
- [ ] Custom domain configuration
- [ ] HTTPS enforced (Netlify auto)

#### Performance Optimization
- [ ] **Image Optimization**:
  - Use modern formats: WebP for supported browsers
  - Lazy-load below-the-fold images (`loading="lazy"`)
  - Responsive images via `srcset` (if applicable)
- [ ] **Bundle Analysis**:
  - Analyze main.js, vendor chunks
  - Lazy-load page routes (@nuxtjs/i18n lazy-loads locales)
- [ ] **Lighthouse Targets**:
  - Performance: >90
  - Accessibility: >95
  - SEO: >80
  - PWA: >95
- [ ] **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

---

### 2.7 Security & Compliance (LOW PRIORITY, ONGOING)
**Status**: Infrastructure in place; comprehensive testing needed  
**Requirements**: Req 4 (security headers), Req 21 (input sanitization), Req 20 (form validation)

#### Input Validation & Sanitization — Req 21.1–21.12
**Pure sanitization functions** in `utils/sanitize.ts`:
- `sanitizeText(input)`: Strip HTML tags, script tags, event handlers, remove null bytes + control chars
  - **Property 22**: HTML/Script Sanitization (reject `<script>alert()</script>`, `<img onerror>`, `onclick=`)
- `sanitizeUrl(input)`: Validate HTTPS protocol only, reject javascript:, data:, vbscript: URIs
  - **Property 2**: URL Validation Rejects Non-HTTPS (Req 1.5, 20.5, 21.4)
- `sanitizeEmail(input)`: RFC 5322 simplified validation, reject disposable domains
  - **Property 19**: Email Validation (Req 20.6, 20.9, 21.7)
- `encodeForHtml(input)`: Entity encoding for non-Vue contexts (Req 21.2)
  - **Property 23**: HTML Entity Encoding Round-Trip
- `rejectControlChars(input)`: Reject null bytes, control characters, oversized Unicode
  - **Property 24**: Control Character Rejection (Req 21.5)

**Application Points**:
- [ ] All user form inputs (lead capture, admin CRUD, daily check-in) run through sanitize functions
- [ ] Sanitization happens BEFORE render (prevent XSS) AND BEFORE persist (prevent data corruption)
- [ ] Never use `v-html` with untrusted content; use DOMPurify with allowlist if absolutely necessary
- [ ] Silent sanitization: stripped content persisted; only format/length violations shown as errors (Req 21.12, Property 27)

**Audit Logging** (for sanitization rejections):
- [ ] `utils/auditLog.ts`: Log timestamp, hashed IP, field name, rejection reason
- [ ] NEVER log raw malicious input (privacy/security)
- [ ] Store audit logs locally (localStorage) or send to backend API

#### Form Validation — Req 20.1–20.14
**Composable-based validation** via `useFormValidation`:
- [ ] **Per-form rules** (declarative):
  ```ts
  const { fields, validate, isValid, firstInvalidField } = useFormValidation({
    title: [
      { type: 'required', message: t('validation.required') },
      { type: 'minLength', value: 3, message: t('validation.minLength', { min: 3 }) },
      { type: 'maxLength', value: 100, message: t('validation.maxLength', { max: 100 }) },
    ],
    email: [
      { type: 'required', message: t('validation.required') },
      { type: 'email', message: t('validation.email') },
    ],
  })
  ```
- [ ] **Validation timing**:
  - On blur: mark field dirty + validate (Req 20.2)
  - On submit: validate all fields (Req 20.3)
  - Inline error display within 100ms (Req 20.4)
- [ ] **Field states**: pristine → dirty → valid/invalid (Req 20.7, 20.8, Property 18)
- [ ] **Whitespace trimming** before validation and before persistence (Req 20.11, Property 21)
- [ ] **Character count display** at 80%+ usage (Req 20.1, Property 20)
- [ ] **Accessibility**:
  - `aria-invalid="true"` on invalid field (Req 20.7)
  - `aria-errormessage="field-error"` pointing to error message (Req 20.7)
  - `aria-required="true"` on required fields (Req 20.2)
  - `aria-live="assertive"` on error announcements (Req 20.9)
- [ ] **Submit failure**: Scroll to + focus first invalid field, announce error count via Toast (Req 20.13)

#### Character Limits
- **Title**: 3–100 characters (Req 1.7, 20.1)
- **Description**: 10–500 characters (Req 1.7, 20.1)
- **URL**: max 2048 characters (Req 1.7)
- **Email**: max 254 characters (Req 20.6)

#### File Upload Validation — Req 1.8, 20.6
- [ ] **Accepted MIME types**: image/jpeg, image/png, image/webp
- [ ] **Max file size**: 2 MB
- [ ] **Validation error**: Toast with specific reason (invalid type, exceeds size)

#### Email Security — Req 21.7–21.11
- [ ] **Transmission**: HTTPS/TLS 1.2+ only (third-party email API)
- [ ] **Authentication**: DKIM/SPF/DMARC-aligned sender domain
- [ ] **Rate limiting**: Max 3 email-triggering submissions per IP per 15-minute window (Req 21.9, Property 25)
  - On exceed: 429 response + Toast warning
  - `utils/rateLimiter.ts`: hash IP (SHA256), track window-based counters
- [ ] **Recipient validation**: Server-side RFC 5322 check + disposable domain blocklist

#### CSP Headers — Req 4.1–4.5
- [ ] **nuxt-security configuration** (nuxt.config.ts):
  ```ts
  security: {
    headers: {
      contentSecurityPolicy: {
        base: ["'self'"],
        script: ["'self'", "'unsafe-inline'"],  // for inline dark mode script
        style: ["'self'", "'unsafe-inline'"],
        font: ["'self'", "https://fonts.gstatic.com"],
        img: ["'self'", "data:", "https:"],
      },
    },
    ssg: { hashScripts: false },  // don't break unsafe-inline on static site
  }
  ```
- [ ] **Testing**: Browser DevTools CSP violations (should be zero)
- [ ] **External CDN origins**: Google Fonts, image hosts explicitly allowed

#### Environment Secrets
- [ ] No hardcoded API keys in source code (git history)
- [ ] `.env.local` (git-ignored) for local development
- [ ] Netlify env vars encrypted in UI (not in public repo)
- [ ] `.env.example` for documentation (only key names, no values)

---

## 3. Current Build Status

### ✅ Working
- Nuxt 4 build pipeline (`npm run generate`)
- Tailwind v4 + Material Design 3 theme system
- Pinia stores (darkMode, pwaInstall, engagement, resources, toast)
- Atomic design tier enforcement (script: `lint:tiers`)
- Form validation composable (useFormValidation)
- Toast notification system
- i18n lazy-loaded locales (en/es/am)
- Atom components (50% implemented)
- PWA config (manifest, SW registration, offline.html stub)

### 🚧 Partial / To-Do
- Organism components (0/20 complete)
- Pages (stub structure only)
- E2E tests (0 tests written)
- PWA icons (need generation)
- Content fill (form fields, resources data)

### ❌ Known Issues
- None blocking current phase; all architectural decisions logged in memory.md

---

## 4. Workflow for Agent Implementation

### Implementation Checklist (Per Component)

**Step 1: Design (5 min)**
- [ ] Read specification section for this component (requirements + design doc)
- [ ] Identify viral principle(s) it maps to
- [ ] Determine prop interface + Pinia stores needed
- [ ] Plan layout: semantic HTML, ARIA labels, focus indicators
- [ ] List all user-facing text keys for i18n

**Step 2: Create File (1 min)**
- [ ] `app/components/organisms/O[Name].vue` (or molecules/M[Name].vue for molecules)
- [ ] Use `<script setup lang="ts">` with strict type checking
- [ ] Export interface for props

**Step 3: Implement** (20–60 min depending on complexity)
- [ ] Render semantic HTML structure
- [ ] Add all required ARIA attributes (role, aria-label, aria-describedby, aria-live, aria-expanded)
- [ ] Wire up Pinia stores (import from app/stores/)
- [ ] Implement all forms with `useFormValidation` composable
- [ ] Add inline error display + Toast notifications
- [ ] Sanitize all user inputs before render/persist
- [ ] Use `$t('key')` for ALL user-visible text
- [ ] Apply M3 semantic color tokens (Tailwind utilities)
- [ ] Add focus-visible indicators (2px ring, 3:1 contrast)
- [ ] Ensure 44px touch targets on interactive elements
- [ ] Add loading/error/empty states

**Step 4: Test** (15–30 min)
- [ ] Create `tests/unit/[tier]/O[Name].spec.ts` (or M[Name].spec.ts)
- [ ] Mount component + verify render
- [ ] Test user interactions (click, type, submit)
- [ ] Test ARIA attributes + accessibility
- [ ] Test error states
- [ ] Snapshot test for visual regression
- [ ] Run `npm run test:unit` and verify coverage

**Step 5: Verify** (5 min)
- [ ] Run `npm run lint:tiers` to enforce atomic design boundaries
- [ ] Run `npm run lint` for ESLint violations
- [ ] Verify in dev server: `npm run dev` → navigate to component
- [ ] Spot-check all 3 locales render correctly

### Phase 1: Quick-Start Organisms (Do These First)
1. **ONotificationBar** (15 min) — simple text + dismiss button
2. **OCountdownTimer** (20 min) — timer + styling
3. **OIncomeCalculator** (30 min) — form input + calculation logic
4. **ODailyCheckIn** (25 min) — form + progress bar
5. **OAchievementBadge** (15 min) — badge display + Toast announce
6. Continue with remaining organisms...

### Phase 2: Organisms (Next 20 Tasks)
Follow checklist above for each organism in priority order:
1. Quick-start organisms (5, ~105 min total)
2. Content organisms (OFreeToolkit, OContentPreviews, MSocialProof)
3. Forms organisms (OLeadCapture, OLiveActivityFeed remaining work)
4. Utility organisms (remaining)

### Phase 3: Pages (Next 3 Tasks)
1. Compose organisms into pages
2. Wire up routing + SEO meta
3. Write E2E tests for critical flows

### Phase 4: Testing & Deploy (Next 15 Tasks)
1. Fill test coverage gaps (80% target)
2. Write E2E tests for all critical flows
3. PWA icons + offline.html
4. Lighthouse audit
5. Deploy to Netlify

---

## 5. Component Template (Copy & Adapt)

### Organism Template (O[Name].vue)
```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useFormValidation } from '~/composables/useFormValidation'
import { sanitizeText } from '~/utils/sanitize'
import { someStore } from '~/stores/someStore'

const props = defineProps<{
  // Strictly typed props
  title?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  // Define emit events
  (e: 'action', value: string): void
}>()

const { t } = useI18n()
const toast = useToast()
const store = someStore()

// Local state (only UI toggles allowed)
const isOpen = ref(false)

// Computed for reactive display
const displayTitle = computed(() => sanitizeText(props.title || ''))

const handleAction = () => {
  // Implement logic
  toast.success(t('toast.success.action'))
  emit('action', 'data')
}
</script>

<template>
  <section
    role="region"
    :aria-label="t('aria.regionName')"
    class="bg-surface text-on-surface p-4"
  >
    <h2 class="text-2xl font-bold">{{ displayTitle }}</h2>
    <!-- Content -->
    <button
      aria-label="Action button"
      class="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      @click="handleAction"
    >
      {{ t('button.action') }}
    </button>
  </section>
</template>

<style scoped>
/* Component-scoped styles using M3 tokens */
</style>
```

### Molecule Template (M[Name].vue)
```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  // Only props, no computed data manipulation in molecules
  label: string
  value: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Local UI state only (open/closed, focused)
const isFocused = ref(false)
</script>

<template>
  <div class="space-y-2">
    <label :for="`field-${label}`" class="text-sm font-medium">
      {{ label }}
    </label>
    <input
      :id="`field-${label}`"
      :value="value"
      :aria-invalid="!!error"
      :aria-errormessage="error ? `${label}-error` : undefined"
      class="w-full px-4 py-2 border border-outline rounded focus-visible:ring-2"
      @input="emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div v-if="error" :id="`${label}-error`" class="text-error text-sm">
      {{ error }}
    </div>
  </div>
</template>
```

---

## 6. Commands Reference

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run lint            # ESLint check
npm run lint:tiers      # Verify atomic design tiers
npm run format          # Prettier format

# Testing
npm run test:unit       # Vitest (units only)
npm run test:e2e        # Playwright (headless)
npm test                # Both unit + E2E
npm run test:coverage   # Coverage report (80% target)

# Build & Deploy
npm run generate        # Build static site to .output/public (Netlify deploy)
npm run pregenerate     # Run audit check before generate
npm run build           # Nuxt build (SSR, not static)
npm run preview         # Preview .output/public locally

# Maintenance
npm run lint:tiers      # Enforce atomic design (atoms/molecules/organisms)
node scripts/generate-theme.mjs  # Regenerate M3 tokens from package.json theme colors
node scripts/audit-check.mjs     # Pre-build validation (dependencies, security)

---

## 7. Requirements Traceability

### Spec Cross-Reference

| Feature | Spec Section | Requirements | Status |
|---------|--------------|--------------|--------|
| Admin Content Management | Design § Components | 1.1–1.8 | [x] OAdminPanel |
| Resource Display | Design § Components | 2.1–2.6 | [x] OResourceGrid |
| SEO Configuration | Req 3 | 3.1–3.6 | [ ] Netlify + OG images |
| Security Headers | Req 4 | 4.1–4.5 | [x] nuxt-security config |
| PWA (Install, Offline, SW) | Req 5 | 5.1–5.12 | [x] Config; [ ] Icons + offline.html |
| Internationalization | Req 6 | 6.1–6.6 | [x] i18n module; [ ] Content fill |
| Toast Notifications | Req 7 | 7.1–7.8 | [x] OToastContainer |
| Viral: Social Currency | Req 8 | 8.1–8.4 | [x] OLeaderboard, badges |
| Viral: Triggers | Req 9 | 9.1–9.4 | [ ] ONotificationBar, ODailyCheckIn |
| Viral: Emotion | Req 10 | 10.1–10.4 | [ ] OIncomeCalculator, countdown |
| Viral: Public Visibility | Req 11 | 11.1–11.4 | [x] OLiveActivityFeed, OLeaderboard |
| Viral: Practical Value | Req 12 | 12.1–12.4 | [ ] OFreeToolkit, OContentPreviews |
| Viral: Stories | Req 13 | 13.1–13.4 | [ ] OFounderStory, OCaseStudy |
| Atomic Design Tiers | Design § Components | 14.1–14.6 | [x] Script enforcer |
| Material Design 3 Colors | Design § Theme | 15.1–15.7 | [x] Theme generation |
| WCAG 2.1 AA Accessibility | Req 16 | 16.1–16.11 | [x] Infrastructure; [ ] Component audit |
| Testing Strategy | Req 17 | 17.1–17.6 | [x] Vitest + Playwright; [ ] Tests |
| Dependency Security | Req 18 | 18.1–18.4 | [x] npm audit, SECURITY.md |
| Linting & Formatting | Req 19 | 19.1–19.8 | [x] ESLint + Prettier |
| Form Validation | Req 20 | 20.1–20.14 | [x] useFormValidation; [ ] Tests |
| Input Sanitization & Email | Req 21 | 21.1–21.12 | [x] Sanitize utils; [ ] Tests + rate limit |

### Viral Framework Checklist

| Principle | Organisms | Status | Requirements |
|-----------|-----------|--------|--------------|
| **Social Currency** | OLeaderboard, OAchievementBadge, gated content | [ ] | Req 8 |
| **Triggers** | ONotificationBar, ODailyCheckIn | [ ] | Req 9 |
| **Emotion** | OIncomeCalculator, OCountdownTimer, pain points | [ ] | Req 10 |
| **Public Visibility** | OLiveActivityFeed, MSocialProof, shareable badges | [x] | Req 11 |
| **Practical Value** | OFreeToolkit, OContentPreviews, copy-to-clipboard | [ ] | Req 12 |
| **Stories** | OFounderStory, OCaseStudy, long-form content | [ ] | Req 13 |

---

## 8. Resource Links

**Spec Files** (in `.kiro/specs/money-conversion-spa/`):
- [requirements.md](.kiro/specs/money-conversion-spa/requirements.md) — Full user stories + acceptance criteria
- [design.md](.kiro/specs/money-conversion-spa/design.md) — Architecture, interfaces, system diagrams
- [tasks.md](.kiro/specs/money-conversion-spa/tasks.md) — Task breakdown with completion status

**Project Docs**:
- [agents.md](agents.md) — Complete tech spec + gotchas (READ THIS FIRST)
- [memory.md](memory.md) — Architectural decisions (D1–D14+) + lessons learned
- [knownFailures.md](knownFailures.md) — Resolved issues + fixes
- [SECURITY.md](SECURITY.md) — Dependency vulnerability overrides
- [agentInfluence/atomicElements.md](agentInfluence/atomicElements.md) — Atomic tier enforcement rules

**Stack Documentation**:
- [Nuxt 4 Docs](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Material Design 3](https://m3.material.io/)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vitest Unit Testing](https://vitest.dev/)
- [Playwright E2E Testing](https://playwright.dev/)

---

## 9. Success Metrics (MVP Completion)

- [ ] **Build**: `npm run generate` succeeds, `.output/public` is production-ready static site
- [ ] **Organisms**: All 20 organisms rendered without console errors
- [ ] **Pages**: index.vue, resources.vue, admin.vue complete with all viral organisms composed
- [ ] **Testing**: Unit test coverage ≥80%, E2E tests for critical flows pass
- [ ] **i18n**: All content translated and verified in all 3 locales (en/es/am)
- [ ] **Accessibility**: WCAG 2.1 AA audit pass (no critical/major violations)
- [ ] **PWA**: Lighthouse PWA score ≥95, offline mode verified
- [ ] **Performance**: Lighthouse performance ≥90, accessibility ≥95, SEO ≥80
- [ ] **Security**: CSP headers enforced, no XSS vectors, sanitization audit log functional
- [ ] **Deployment**: Static site live on Netlify HTTPS, custom domain, DMARC-aligned emails working
- [ ] **Viral Framework**: All 6 principles mapped to organisms, tested in E2E flows
