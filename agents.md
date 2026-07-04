# Agent Instructions: Build a Nuxt 4 PWA with Material Design 3

Use this document as a complete blueprint for creating a production-ready Nuxt 4 static site with Material Design 3 color system, i18n, PWA offline support, and full accessibility compliance.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Nuxt | 4.x |
| UI | Vue 3 Composition API | `<script setup lang="ts">` |
| Styling | Tailwind CSS v4 | Via `@tailwindcss/vite` plugin |
| Color System | Material Design 3 | `@material/material-color-utilities` |
| State | Pinia | Stores in `app/stores/` |
| i18n | @nuxtjs/i18n | Lazy-loaded JSON locale files |
| PWA | @vite-pwa/nuxt | Workbox, autoUpdate |
| SEO | @nuxtjs/seo | OG images, schema.org, sitemap |
| Security | nuxt-security | CSP headers, SSG-safe |
| Deploy | Netlify (static) | `nuxi generate` → `.output/public` |
| Node | 22 | Required across all environments |

## Architecture Principles

### 1. Single-Source Color System
- Define 3 seed colors (primary, secondary, tertiary) in `package.json` under `"theme"`
- Run `node scripts/generate-theme.mjs` to generate full M3 tonal palettes → `material-tokens.css`
- Map M3 tokens to Tailwind v4 utilities via `@theme` in `main.css`
- Use semantic M3 color roles in components: `bg-primary`, `text-on-surface`, `border-outline-variant`
- Dark mode auto-switches via `.dark` class + CSS variable overrides

### 2. Tailwind v4 (No Config File)
- No `tailwind.config.ts` — all configuration lives in CSS via `@theme` and `@variant`
- Use `@tailwindcss/vite` plugin directly in `nuxt.config.ts` (not `@nuxtjs/tailwindcss` module)
- Dark mode: `@variant dark (&:where(.dark, .dark *));`
- Custom fonts, colors, shadows all defined in `@theme { ... }` block

### 3. Offline-First PWA
- `registerType: 'autoUpdate'` — SW updates silently, no user prompt needed
- `skipWaiting: true` + `clientsClaim: true` — instant activation
- Precache all static assets via `globPatterns`
- Runtime caching strategies: NetworkFirst for pages, CacheFirst for hashed assets/images/fonts, StaleWhileRevalidate for translations
- Full Lighthouse PWA score requires: manifest with `start_url`, `id`, `scope`, `display: standalone`, 192px + 512px + maskable icons, `theme_color`, `background_color`

### 4. i18n (Internationalization)
- `prefix_except_default` strategy — default locale has no prefix
- Lazy-loaded JSON files in `i18n/locales/`
- All component text uses `$t('key')` or `t('key')` from `useI18n()`
- `useLocaleHead()` in layout for automatic `<html lang>` and hreflang tags
- `baseUrl` must be set for SEO tag generation

### 5. Accessibility (WCAG 2.1 AA)
- Skip-to-content link (sr-only, visible on focus-visible)
- Focus management on route changes (move focus to `<main>`)
- All interactive elements have visible `:focus-visible` indicators
- `aria-required`, `aria-describedby`, `aria-live` regions on forms
- `prefers-reduced-motion: reduce` disables non-essential animations
- Semantic landmarks with ARIA labels
- Dark mode toggle wrapped in `<ClientOnly>` to avoid hydration mismatch

### 6. Security (CSP)
- `nuxt-security` with `ssg: { hashScripts: false }` — don't break `unsafe-inline`
- CSP allows `'self'`, `'unsafe-inline'` for scripts/styles, plus explicit CDN origins
- No nonces on static sites (they require a server)

### 7. Environment Configuration
- Single env var `NUXT_PUBLIC_BASE_URL` controls all URL-dependent config
- `nuxt.config.ts` derives `basePath` from URL pathname
- `.env` for local, `netlify.toml` for production
- `runtimeConfig.public.baseUrl` available in components

### 8. State Management (Pinia)
- Use Pinia stores for global shared state with side effects (dark mode, PWA install, loading)
- Keep composables for instance-scoped logic (scroll spy, logger utility)
- Stores initialize in the default layout via `.initialize()` action

### 9. Form Validation (All Forms)
- Every form in the app (admin panel, lead capture, quiz funnel, daily check-in) MUST validate on blur and on submit
- Use a single reusable composable: `useFormValidation` — declarative rule definitions per form
- Validation states per field: pristine → dirty → valid/invalid
- Inline error messages appear beneath the field within 100ms of validation trigger
- `aria-invalid="true"` + `aria-errormessage` on invalid fields
- Error announcements via `aria-live="assertive"` region
- On submit failure: scroll to + focus first invalid field, announce error count via Toast_System
- URL fields: require `https://` prefix, WHATWG URL Standard
- Email fields: RFC 5322 simplified (local@domain.tld, min 2-char domain)
- Character limits: title (3–100), description (10–500), URL (max 2048), email (max 254)
- Show remaining character count at 80%+ usage
- File uploads: validate MIME (image/jpeg, image/png, image/webp) and size (max 2 MB)
- Trim whitespace before validation and persistence
- All error messages i18n-translated (en, es, am)

### 10. Toast Notifications (All User Feedback)
- ALL user-facing notifications and errors go through the Toast_System — no inline-only errors for submission results
- Toast types: success (polite), error (assertive), warning (polite), info (polite)
- Position: fixed bottom-center, above interactive content, z-index above modals
- Auto-dismiss: 5 seconds, pauses on hover/focus, resumes on leave
- Max 3 visible stacked toasts, newest at bottom
- Keyboard dismissible via Escape, close button meets 44px touch target
- Error toasts include failure reason + suggested corrective action
- Success toasts confirm the completed action
- Validation summary toast on form submit failure: "N fields need attention"
- Badge/achievement toasts for gamification milestones
- Share confirmation toasts
- PWA install interaction toasts

### 11. Input Sanitization & Secure Email
- ALL user inputs sanitized before render and persistence — never trust client data
- Strip HTML tags/scripts via `utils/sanitize.ts` (pure functions, unit-testable)
- Block: `<script>`, `<iframe>`, `<object>`, `<embed>`, event handlers, `javascript:` URIs
- Entity-encode for HTML context when not using Vue's default interpolation
- NEVER use `v-html` with untrusted content — if needed, use DOMPurify with strict allowlist
- URL sanitization: reject `javascript:`, `data:`, `vbscript:` protocols; only allow `https://`
- Reject null bytes, control chars, oversized Unicode sequences
- Email: Send exclusively via HTTPS/TLS 1.2+ API (never SMTP direct without encryption)
- Email: DKIM/SPF/DMARC-aligned sender domain, rate-limit 3 per IP per 15 min
- Email: Validate recipient server-side, block disposable domains (configurable)
- Audit log: All sanitization rejections logged (timestamp, hashed IP, field, reason) — never log raw malicious input
- Silent sanitization: stripped content not shown to user; only format/length errors displayed

## File Structure

```
├── .env                          # NUXT_PUBLIC_BASE_URL
├── .nvmrc                        # Node version (22)
├── netlify.toml                  # Build/deploy/headers/redirects
├── package.json                  # theme colors, scripts, browserslist
├── scripts/
│   └── generate-theme.mjs       # M3 token generator (reads package.json "theme")
├── i18n/
│   └── locales/
│       ├── en.json
│       ├── es.json
│       └── fr.json
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── app/
│   ├── app.vue                   # Root with splash screen
│   ├── assets/css/
│   │   ├── main.css              # Tailwind v4 + @theme + base styles
│   │   └── material-tokens.css   # Auto-generated M3 tokens (DO NOT EDIT)
│   ├── components/               # All UI components
│   ├── composables/              # Instance-scoped logic (useScrollSpy, useLogger)
│   ├── stores/                   # Pinia stores (darkMode, pwaInstall, loading)
│   ├── layouts/
│   │   └── default.vue           # Skip-to-content, Navbar, Footer, PWA prompt
│   └── pages/
│       └── index.vue             # Main page
└── nuxt.config.ts                # All module configuration
```

## Step-by-Step Build Process

1. `npm init` → set up package.json with theme colors, engines, browserslist
2. Install deps: nuxt, vue, pinia, @nuxtjs/i18n, @vite-pwa/nuxt, nuxt-security, @nuxtjs/seo, tailwindcss, @tailwindcss/vite, @material/material-color-utilities
3. Create `scripts/generate-theme.mjs` — reads `package.json` theme, outputs CSS tokens
4. Create `app/assets/css/main.css` — Tailwind v4 import + @theme mapping M3 tokens
5. Create `nuxt.config.ts` with all modules, PWA manifest, security headers, i18n config
6. Create translation files and components using `$t()` for all text
7. Create Pinia stores for dark mode, PWA install, loading state
8. Create layout with skip-to-content, focus management, ClientOnly dark toggle
9. Create `netlify.toml` with headers, redirects, cache rules
10. Add `.env`, `.nvmrc`, browserslist, GitHub Actions workflow

## Critical Gotchas

- **Tailwind v4**: No `tailwind.config.ts`. No `@tailwind base/components/utilities`. Use `@import "tailwindcss"` only.
- **OG Image**: Disable in dev (`enabled: false`), enable in `$production` override. `zeroRuntime: true` crashes SSR dev mode.
- **Dark mode hydration**: Wrap theme-dependent UI in `<ClientOnly>` if server can't know the state.
- **CSP + SSG**: Set `ssg: { hashScripts: false }` — SHA hashes override `unsafe-inline`.
- **i18n `dropMessageCompiler`**: Don't use it if translations have interpolation (`{name}`, `{count}`).
- **Netlify publish dir**: `.output/public` (not `dist`).
- **Maskable icons**: Must be a separate manifest entry from `any` purpose icons.
- **Service worker headers**: `sw.js` and `manifest.webmanifest` must have `Cache-Control: max-age=0, must-revalidate`.
