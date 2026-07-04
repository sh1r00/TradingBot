# Project Memory: Lessons & Decisions

This document records every architectural decision, bug fix, and lesson learned during the development of this project. An AI agent should read this before making changes to avoid repeating solved problems.

## Active Project: Money Conversion SPA

- **Spec**: `.kiro/specs/money-conversion-spa/`
- **Phase**: Requirements complete (21 detailed requirements), ready for Design
- **Workflow**: Requirements-first → Design → Tasks
- **Purpose**: Nuxt 4 SPA converting internet users interested in making money; curated external resource links + viral conversion design
- **Key Constraint**: All dependencies must be vulnerability-screened before install (npm audit, exact pinning, SECURITY.md for overrides)
- **Locales**: English (default), Spanish, Amharic
- **Viral Framework**: 6 principles (Social Currency, Triggers, Emotion, Public, Practical Value, Stories) — every Organism maps to ≥1
- **Atomic Design**: A* (atoms, pure render), M* (molecules, local UI state), O* (organisms, full power)
- **Color System**: MD3 tonal palettes from 3 seed hex values → CSS vars → Tailwind v4 @theme
- **Testing**: Vitest + Vue Test Utils (unit), Playwright CLI (E2E), 80% coverage on atoms
- **Form Validation**: All forms use `useFormValidation` composable; validate on blur + submit; inline errors + Toast summary; i18n error messages
- **Toast Notifications**: ALL user feedback via Toast_System — no other notification mechanism; bottom-center fixed, max 3 stacked, auto-dismiss 5s, pause on hover/focus

---

## Previous Project Identity (Reference)

- **Name**: Elias | Mechanic Portfolio
- **Owner**: sh1r00
- **Purpose**: Professional mechanic portfolio showcasing engine diagnostics, repair services, and industrial craftsmanship
- **Design Language**: Industrial Craftsman — dark surfaces, amber/orange accent, Bebas Neue display font, DM Sans body font

---

## Decisions Log

### D11: Form Validation Architecture
- **Why**: Every form (admin content, lead capture, quiz funnel, daily check-in, contact) needs consistent validation UX
- **Solution**: Single `useFormValidation` composable with declarative rule definitions per form
- **Field States**: pristine → dirty → valid / invalid
- **Timing**: Validate on blur (first touch) and on submit (all fields)
- **Inline Errors**: Appear below field within 100ms, use `aria-invalid` + `aria-errormessage`
- **Submit Failure**: Scroll to + focus first invalid field; announce count via Toast ("3 fields need attention")
- **Rules**: URL must start with `https://`, email RFC 5322 simplified, title 3–100 chars, description 10–500, file type JPEG/PNG/WebP ≤2MB
- **i18n**: All error messages are translation keys, rendered in active locale
- **Whitespace**: Trim leading/trailing before validation and before persistence

### D12: Toast as Single Notification Channel
- **Why**: Consistency — users learn one feedback pattern. No modal alerts, no inline-only banners for submission results.
- **Solution**: Toast_System handles ALL user-facing notifications: success, error, warning, info
- **Position**: Fixed bottom-center, z-index above modals, above interactive content
- **Behavior**: Auto-dismiss 5s, pause on hover/focus, resume on leave, max 3 stacked
- **Accessibility**: Error toasts use `role="alert"` + `aria-live="assertive"`, others use `aria-live="polite"`
- **Keyboard**: Escape dismisses focused toast, close button ≥44px touch target
- **Use Cases**: Validation summary, badge earned, share confirmed, link copied, PWA installed, admin CRUD confirmations

### D13: Input Sanitization Strategy
- **Why**: Static site with forms that submit to APIs — all inputs must be sanitized client-side AND server-side to prevent XSS, injection, and protocol attacks
- **Solution**: `utils/sanitize.ts` exports pure functions: `sanitizeText()`, `sanitizeUrl()`, `sanitizeEmail()`
- **Stripping**: HTML tags, script content, event handlers, javascript: URIs, null bytes, control chars
- **Encoding**: Entity encoding for non-Vue-interpolation contexts
- **v-html**: NEVER with untrusted content. If needed: DOMPurify with allowlist (p, strong, em, a, ul, ol, li, br)
- **URL**: Only `https://` allowed; reject javascript:, data:, vbscript: protocols
- **Silent**: Sanitized content persisted without user notification; only format/length violations shown as errors

### D14: Secure Email Transmission
- **Why**: Email is a common vector for data interception and phishing. All transactional emails must be encrypted in transit.
- **Solution**: Third-party email API over HTTPS/TLS 1.2+ (no direct SMTP without encryption)
- **Authentication**: DKIM/SPF/DMARC-aligned sender domain
- **Rate Limiting**: 3 email-triggering submissions per IP per 15-minute window; 429 + Toast warning on exceed
- **Recipient Validation**: Server-side RFC 5322 check + disposable domain blocklist
- **Audit**: Sanitization rejections logged (timestamp, hashed IP, field, reason) — never raw malicious input

### D1: Tailwind v4 Migration (from v3)
- **Why**: `@nuxtjs/tailwindcss@6.14` kept falling into v3 code paths causing `resolveConfig` and PostCSS errors
- **Solution**: Removed `@nuxtjs/tailwindcss` module entirely. Use `@tailwindcss/vite` plugin directly in nuxt.config.ts
- **Key rule**: No `tailwind.config.ts` file. All config in CSS via `@theme` and `@variant`

### D2: Material Design 3 Color System
- **Why**: Wanted automated color palette generation from a single seed color
- **Solution**: Build-time script (`scripts/generate-theme.mjs`) uses `@material/material-color-utilities` to generate full tonal palettes
- **Configuration**: Seed colors stored in `package.json` under `"theme": { primary, secondary, tertiary }`
- **Output**: `app/assets/css/material-tokens.css` (auto-generated, never edit manually)
- **Tailwind mapping**: `main.css` `@theme` block maps M3 CSS vars to Tailwind utility names

### D3: Dark Mode Without Hydration Mismatch
- **Problem**: Server renders `isDark=false`, client reads `true` from localStorage → hydration mismatch
- **Solution**: Wrap `<DarkModeToggle>` in `<ClientOnly>` with a same-sized fallback placeholder
- **Also applies to**: Any component whose rendered output depends on localStorage/client-only state

### D4: OG Image Disabled in Dev
- **Problem**: `nuxt-og-image@6.5.1` with `zeroRuntime: true` crashes SSR in dev mode (`originalName.split is not a function`)
- **Root cause**: The module tries to resolve a Satori component that isn't registered in dev
- **Solution**: `ogImage: { enabled: false }` in base config + `$production: { ogImage: { enabled: true } }` override
- **Also removed**: `defineOgImage()` call from `pages/index.vue` — module auto-reads from `useSeoMeta()` at build time

### D5: CSP + Static Site Generation
- **Problem**: `nuxt-security` auto-generates SHA hashes for inline scripts during SSG. Per CSP spec, hashes override `'unsafe-inline'`, blocking the dark mode inline script
- **Solution**: `security: { ssg: { hashScripts: false } }`
- **Rule**: Never use nonces on static sites (they require a server to generate per-request)

### D6: PWA Install Prompt Strategy
- **Original**: Used `sessionStorage` (dismissed per session, `beforeinstallprompt` required to show)
- **Changed to**: `localStorage` persistence + show immediately on load if not dismissed
- **Position**: Fixed top, above navbar (`z-[60]`), slides down from top
- **Behavior**: Persists until user clicks dismiss OR installs the app OR clears localStorage
- **Auto-hides**: If already in standalone mode

### D7: i18n Configuration
- **Strategy**: `prefix_except_default` — English at `/`, other locales at `/es/`, `/fr/`
- **Loading**: Lazy-loaded JSON files in `i18n/locales/`
- **baseUrl**: Required for hreflang SEO tags. Set via `NUXT_PUBLIC_BASE_URL` env var
- **Never use**: `bundle: { dropMessageCompiler: true }` — breaks interpolation (`{years}`, `{year}`)
- **Replaced with**: `bundle: { onlyLocales: ['en', 'fr', 'es'] }`

### D8: Service Worker Caching Strategy
- **Pages**: NetworkFirst with 3-second timeout (offline falls back to cache)
- **JS/CSS (hashed)**: CacheFirst (immutable, 1 year)
- **Images**: CacheFirst (30 days)
- **Translations (JSON)**: StaleWhileRevalidate (instant + background refresh)
- **Google Fonts CSS**: StaleWhileRevalidate
- **Google Fonts files**: CacheFirst (1 year)
- **SW itself**: Must have `Cache-Control: max-age=0, must-revalidate`

### D9: Pinia vs Composables
- **Use Pinia for**: Global singleton state with side effects (darkMode, pwaInstall, loading)
- **Use composables for**: Instance-scoped logic (useScrollSpy — per-component), utilities (useLogger — factory)
- **Stores initialize**: In `app/layouts/default.vue` via `.initialize()` action

### D10: Netlify Deployment
- **Preset**: `nitro: { preset: 'static' }` (not `netlify-static` — that caused `"unhandled node type: 0"` error)
- **Publish dir**: `.output/public`
- **Build command**: `npm run generate` (which runs `generate-theme.mjs` first)
- **HTTPS redirect**: Handled in `netlify.toml`

---

## Bugs Fixed (Reference)

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `originalName.split is not a function` | nuxt-og-image resolving component in dev SSR | Disabled ogImage in dev |
| `Package subpath './resolveConfig' not defined` | Tailwind v4 doesn't export `resolveConfig` | Removed @nuxtjs/tailwindcss, use @tailwindcss/vite |
| `tailwindcss directly as PostCSS plugin` | Same as above | Use @tailwindcss/vite directly |
| Hydration class mismatch on SVG | Dark mode state differs server vs client | `<ClientOnly>` wrapper |
| `unhandled node type: 0` | `dropMessageCompiler: true` + interpolated messages | Removed dropMessageCompiler |
| 404 on Netlify | Wrong publish directory (`dist` vs `.output/public`) | Fixed in netlify.toml |
| CSP blocking inline script | SHA hashes override unsafe-inline | `ssg: { hashScripts: false }` |
| `nuxt-schema-org` not found | Pinned version conflicted with unhead@3 | Removed explicit dep, let @nuxtjs/seo manage it |
| Autocomplete warning | Form fields missing `autocomplete` attribute | Added `autocomplete="name"/"email"/"tel"/"off"` |
| `glob@10.5.0` deprecated | Transitive dependency | Added `overrides: { glob: "^11.0.0" }` |
| i18n baseUrl warning | Missing `baseUrl` in i18n config | Set from `NUXT_PUBLIC_BASE_URL` env var |
| Google Translate CSP block | `www.gstatic.com` not in `style-src` | Added to CSP allowlist |

---

## Environment Variables

| Variable | Purpose | Where Set |
|----------|---------|-----------|
| `NUXT_PUBLIC_BASE_URL` | Base URL for SEO/i18n/routing | `.env` local, `netlify.toml` production |
| `BASE_URL` | Alias used in nuxt.config.ts | Same as above |

---

## Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Generate theme tokens → start Nuxt dev server |
| `npm run generate` | Generate theme tokens → static site generation |
| `npm run generate:theme` | Regenerate M3 tokens from package.json seed colors |
| `npm run build` | Generate theme tokens → Nuxt build |

---

## Color Class Reference (M3 → Tailwind)

| Tailwind Class | M3 Role | Usage |
|---------------|---------|-------|
| `bg-background` | Background | Page background |
| `bg-surface-container-low` | Surface Container Low | Section backgrounds |
| `bg-surface-container` | Surface Container | Cards, elevated surfaces |
| `text-on-background` | On Background | Primary text on page |
| `text-on-surface` | On Surface | Primary text on surfaces |
| `text-on-surface-variant` | On Surface Variant | Secondary/muted text |
| `bg-primary` | Primary | Buttons, active states |
| `text-primary` | Primary | Links, accents |
| `text-on-primary` | On Primary | Text on primary buttons |
| `bg-inverse-primary` | Inverse Primary | Hover state for primary buttons |
| `border-outline-variant` | Outline Variant | Subtle borders |
| `border-primary` | Primary | Accent borders |
| `shadow-elevation-1` to `5` | Elevation | Card/modal shadows |
| `bg-error` | Error | Error states |
| `bg-primary-container` | Primary Container | Subtle highlight backgrounds |

---

## Accessibility Checklist

- [ ] Skip-to-content link (sr-only, focus-visible shows it)
- [ ] `<main id="main-content" tabindex="-1">` for focus management
- [ ] Focus moves to main on route change
- [ ] All `<img>` have `alt` or `aria-hidden="true"`
- [ ] All buttons have accessible labels
- [ ] Form inputs: `aria-required`, `aria-describedby` for errors, `aria-live` for success
- [ ] `prefers-reduced-motion` disables decorative animations
- [ ] No keyboard traps (Tab cycles correctly)
- [ ] `<nav aria-label="Main navigation">`
- [ ] `<footer aria-label="Site footer">`
- [ ] Language switcher: `role="listbox"`, `aria-expanded`, `aria-activedescendant`
- [ ] Dark mode toggle: `<ClientOnly>` to prevent hydration mismatch
