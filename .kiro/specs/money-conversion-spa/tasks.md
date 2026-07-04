# Implementation Plan: Money Conversion SPA

## Overview

This plan implements a Nuxt 4 statically-generated PWA with Material Design 3 color system, atomic component architecture (A/M/O), viral conversion organisms, full i18n (en/es/am), offline-first PWA, and WCAG 2.2 AA accessibility compliance. Tasks are sequenced so each step builds on the prior, with testing tasks distributed close to their implementation targets.

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialize Nuxt 4 project with package.json (exact versions, theme seed colors, engines, browserslist, scripts)
    - Create `package.json` with `"theme": { "primary": "#6750A4", "secondary": "#958DA5", "tertiary": "#7D5260" }`
    - Pin all production deps to exact versions (no ^ or ~)
    - Add scripts: `dev`, `generate`, `lint`, `format`, `test:unit`, `test:e2e`, `test:coverage`, `test`
    - Set `"engines": { "node": ">=22" }` and create `.nvmrc` with `22`
    - _Requirements: 18.2, 19.6_

  - [x] 1.2 Install and configure Nuxt modules in nuxt.config.ts
    - Configure `@tailwindcss/vite` plugin (no tailwind.config.ts)
    - Configure `@nuxtjs/i18n` with `prefix_except_default`, lazy-loaded locales, `baseUrl`
    - Configure `@vite-pwa/nuxt` with `registerType: 'autoUpdate'`, `skipWaiting`, `clientsClaim`, manifest, workbox runtime caching strategies
    - Configure `@nuxtjs/seo` with OG image disabled in dev, enabled in production
    - Configure `nuxt-security` with `ssg: { hashScripts: false }`, CSP headers, external CDN origins
    - Configure `@pinia/nuxt`
    - _Requirements: 3.1–3.6, 4.1–4.5, 5.1, 5.12, 6.1–6.3, 6.6, 15.4_

  - [x] 1.3 Create ESLint and Prettier configuration files
    - Create `eslint.config.mjs` with `@nuxt/eslint-config`, `eslint-config-prettier`, `eslint-plugin-vuejs-accessibility`
    - Create `.prettierrc` with single quotes, no semicolons, 2-space indent, 100-char print width
    - _Requirements: 19.1–19.8_

  - [x] 1.4 Create Netlify deployment configuration
    - Create `netlify.toml` with build command, publish dir (`.output/public`), security headers, cache-control rules for SW/manifest
    - _Requirements: 4.1–4.4_

  - [x] 1.5 Create SECURITY.md template for vulnerability overrides
    - Document structure: package name, vulnerability ID, severity, reason, remediation date
    - _Requirements: 18.4_

- [x] 2. Material Design 3 theme generation and Tailwind v4 integration
  - [x] 2.1 Create scripts/generate-theme.mjs (M3 token generator)
    - Read seed colors from `package.json` `"theme"` field
    - Use `@material/material-color-utilities` to generate tonal palettes (26 stops) for 6 color roles
    - Output `material-tokens.css` with CSS custom properties on `:root` (light) and `.dark` (dark)
    - Validate hex inputs — exit non-zero with error message on invalid seed
    - _Requirements: 15.1, 15.2, 15.7_

  - [x]* 2.2 Write property test for theme generation (Property 13: Theme Generation Produces Complete Palette)
    - **Property 13: Theme Generation Produces Complete Palette**
    - **Validates: Requirements 15.1**

  - [x]* 2.3 Write property test for invalid hex seed rejection (Property 15: Invalid Hex Seed Rejection)
    - **Property 15: Invalid Hex Seed Rejection**
    - **Validates: Requirements 15.7**

  - [x] 2.4 Create app/assets/css/main.css with Tailwind v4 @theme block
    - `@import "tailwindcss"` and `@import "./material-tokens.css"`
    - Map all M3 CSS custom properties to Tailwind utility classes via `@theme { ... }`
    - Define `@variant dark (&:where(.dark, .dark *));`
    - Define custom fonts via `@theme`
    - _Requirements: 15.3, 15.4_

  - [x]* 2.5 Write property test for M3 semantic color contrast (Property 14: M3 Semantic Color Contrast Meets WCAG AA)
    - **Property 14: M3 Semantic Color Contrast Meets WCAG AA**
    - **Validates: Requirements 15.6, 16.11**

- [ ] 3. Checkpoint - Ensure theme generation and project config work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Atomic component layer — Atoms
  - [x] 4.1 Create atom components (AButton, AIcon, AText, AInput, AImage, ABadge, ASpinner, ALink, ASwitch, AAvatar, AProgressBar, AChip)
    - All atoms MUST have zero reactive state (no `ref`, `reactive`, `watch`, lifecycle hooks)
    - Only `computed` from props allowed
    - Each atom prefixed with `A`, accepts props and emits events
    - All interactive atoms must have `focus-visible` indicators (2px ring, 3:1 contrast)
    - All touch targets minimum 44×44 CSS pixels
    - Use M3 color tokens from Tailwind utilities
    - _Requirements: 14.2, 14.3, 16.3, 16.7_

  - [x]* 4.2 Write unit tests for atom components
    - Verify props → rendered DOM output
    - Verify user interactions emit expected events with correct payloads
    - Verify required ARIA attributes (role, aria-label, aria-describedby) present
    - Target 80% line coverage for all atoms
    - _Requirements: 17.3, 17.6_

  - [x]* 4.3 Write property test for image alt text compliance (Property 17: Image Alt Text Compliance)
    - **Property 17: Image Alt Text Compliance**
    - **Validates: Requirements 16.10**

- [x] 5. Atomic component layer — Molecules
  - [x] 5.1 Create molecule components (MResourceCard, MFormField, MCountdown, MToastItem, MAchievementBadge, MShareableCard, MContentPreview, MSocialProof)
    - All molecules prefixed with `M`, import only from `components/atoms/`
    - Only local UI state via `ref()` (open/closed, focused, selected)
    - No store access, no API calls, no router usage
    - MResourceCard: truncate description to 150 chars + ellipsis, category badge, thumbnail with fallback
    - MFormField: inline error display, `aria-invalid`, `aria-errormessage`, character count at 80%+
    - MToastItem: type-based styling, close button (44px), pause on hover/focus
    - _Requirements: 2.2, 14.4, 7.5, 7.6, 20.1, 20.7_

  - [ ]* 5.2 Write property test for description truncation (Property 7: Description Truncation)
    - **Property 7: Description Truncation**
    - **Validates: Requirements 2.2**

  - [ ]* 5.3 Write unit tests for molecule components
    - Test state transitions (open/closed), child coordination, error state rendering
    - Verify molecule-tier boundary compliance (no store, no API, no router imports)
    - _Requirements: 14.4_

- [x] 6. Utility modules and composables
  - [x] 6.1 Create utils/sanitize.ts (pure sanitization functions)
    - Implement `sanitizeInput`, `sanitizeUrl`, `encodeForHtml`, `isValidHttpsUrl`, `stripDangerousTags`, `rejectControlChars`, `validateEmail`
    - All functions must be pure (no side effects) and independently testable
    - _Requirements: 21.1, 21.2, 21.4, 21.5, 21.11_

  - [x]* 6.2 Write property tests for sanitization utilities (Properties 22, 23, 24, 27)
    - **Property 22: HTML/Script Sanitization**
    - **Property 23: HTML Entity Encoding Round-Trip**
    - **Property 24: Control Character Rejection**
    - **Property 27: Silent Sanitization**
    - **Validates: Requirements 21.1, 21.2, 21.5, 21.12**

  - [x]* 6.3 Write property test for URL validation (Property 2: URL Validation Rejects Non-HTTPS Protocols)
    - **Property 2: URL Validation Rejects Non-HTTPS Protocols**
    - **Validates: Requirements 1.5, 20.5, 21.4**

  - [x] 6.4 Create composables/useFormValidation.ts
    - Implement declarative validation rule system with field configs
    - States: pristine → dirty → valid/invalid
    - Validate on blur and on submit
    - Trim whitespace before validation
    - Error display within 100ms, clear within 100ms on correction
    - Expose: `fields`, `validate`, `validateAll`, `reset`, `isValid`, `firstInvalidField`, `errorCount`
    - _Requirements: 20.1–20.4, 20.11, 20.13, 20.14_

  - [ ]* 6.5 Write property tests for form validation (Properties 4, 16, 18, 20, 21)
    - **Property 4: Invalid Form Fields Block Submission**
    - **Property 16: Form Field ARIA Accessibility on Invalid State**
    - **Property 18: Validation State Machine Transitions**
    - **Property 20: Character Count Display Threshold**
    - **Property 21: Whitespace Trimming Before Validation**
    - **Validates: Requirements 1.7, 20.1–20.4, 20.7, 20.8, 20.13**

  - [ ]* 6.6 Write property tests for email validation and file upload (Properties 5, 19)
    - **Property 5: File Upload Validation**
    - **Property 19: Email Validation**
    - **Validates: Requirements 1.8, 20.6, 20.9, 21.7**

  - [x] 6.7 Create composables/useToast.ts (toast trigger helper)
    - Convenience wrapper around the toast store for components
    - _Requirements: 7.1, 7.2_

  - [x] 6.8 Create utils/a11y.ts (contrast ratio utilities)
    - Calculate WCAG contrast ratios between two colors
    - Helper for runtime accessibility verification
    - _Requirements: 15.6, 16.11_

  - [x] 6.9 Create composables/useLocaleHead.ts (i18n head meta)
    - Set `<html lang>` attribute, hreflang alternate tags, document direction
    - _Requirements: 6.4, 6.5, 16.8_

- [ ] 7. Checkpoint - Ensure utilities and composables pass all tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Pinia stores
  - [x] 8.1 Create stores/darkMode.ts
    - `isDark` state, `initialize()` reads system preference + localStorage, `toggle()` persists choice
    - _Requirements: 15.5_

  - [x] 8.2 Create stores/toast.ts
    - `toasts` array (max 3 visible), `add`, `remove`, `pause`, `resume` actions
    - Auto-dismiss timer logic (5s default, pause on hover/focus)
    - Oldest toast evicted when 4th arrives
    - _Requirements: 7.1–7.8_

  - [ ]* 8.3 Write property tests for toast store (Properties 8, 9)
    - **Property 8: Toast Timer Pause and Resume**
    - **Property 9: Toast Queue Maximum Visibility**
    - **Validates: Requirements 7.5, 7.7**

  - [x] 8.4 Create stores/pwaInstall.ts
    - `canInstall`, `isDismissed`, `isStandalone` state
    - `initialize()` listens for `beforeinstallprompt`
    - `promptInstall()` triggers native prompt
    - `dismiss()` persists to localStorage
    - _Requirements: 5.9–5.11_

  - [x] 8.5 Create stores/resources.ts
    - `links`, `categories`, `isLoading`, `error` state
    - CRUD actions: `fetchAll`, `create`, `update`, `delete`, `reorder`
    - _Requirements: 1.1–1.8_

  - [ ]* 8.6 Write property tests for resource store (Properties 1, 3, 6)
    - **Property 1: Resource Link CRUD Round-Trip**
    - **Property 3: Display Order Persistence**
    - **Property 6: Resource Grouping and Display Order**
    - **Validates: Requirements 1.2, 1.3, 1.6, 2.1**

  - [x] 8.7 Create stores/engagement.ts
    - `badges`, `lastVisit`, `dailyCheckIns`, `sharesCount`, `installPromptDismissed`, `preferredLocale`
    - Persist to localStorage
    - _Requirements: 8.2, 9.2, 9.3_

- [x] 9. Internationalization locale files
  - [x] 9.1 Create i18n locale JSON files (en.json, es.json, am.json)
    - All UI text, validation messages, toast messages, accessibility labels
    - Structure matches `LocaleMessages` interface from design
    - Support interpolation (`{count}`, `{max}`, `{min}`)
    - _Requirements: 6.1, 6.3, 20.10_

- [ ] 10. Layout and accessibility infrastructure
  - [ ] 10.1 Create app/layouts/default.vue
    - Skip-to-content link (visually hidden, visible on focus-visible, targets `<main id="main-content" tabindex="-1">`)
    - Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` with unique `aria-label`
    - Focus management on route changes (move focus to main within 300ms)
    - Initialize Pinia stores on mount
    - `<ClientOnly>` wrapper for dark mode toggle
    - OToastContainer placement (fixed bottom-center)
    - OInstallPrompt placement
    - _Requirements: 16.1, 16.2, 16.4, 16.8, 15.5_

  - [x] 10.2 Create app/app.vue (root component)
    - `useLocaleHead()` for automatic `<html lang>` and hreflang
    - `prefers-reduced-motion` handling via Tailwind `motion-safe:`/`motion-reduce:` variants
    - _Requirements: 16.6, 16.8_

- [x] 11. Organism components — Core infrastructure
  - [x] 11.1 Create ONavbar.vue
    - Navigation links, language switcher, dark mode toggle (in `<ClientOnly>`)
    - Keyboard accessible, mobile responsive
    - _Requirements: 6.4, 16.4_

  - [x] 11.2 Create OToastContainer.vue
    - Renders toast stack (max 3), positioned fixed bottom-center
    - Error toasts: `role="alert"`, `aria-live="assertive"`
    - Success/info toasts: `aria-live="polite"`
    - Keyboard dismissal (Escape), visible close button (44px)
    - _Requirements: 7.3–7.8_

  - [x] 11.3 Create OInstallPrompt.vue
    - Fixed-position install banner, shown within 1s of `beforeinstallprompt`
    - Hidden in standalone mode
    - Dismiss persists to localStorage
    - _Requirements: 5.9–5.11_

  - [x] 11.4 Create OFooter.vue
    - Semantic `<footer>` with `aria-label`
    - Links, copyright, language attribution
    - _Requirements: 16.4_

- [x] 12. Organism components — Public resource display
  - [x] 12.1 Create OResourceGrid.vue
    - Display all published Resource_Links grouped by category in admin-defined order
    - Skeleton loading state with `aria-busy="true"`
    - Empty state message per category
    - Cards open external URLs in new tab with `rel="noopener noreferrer"`
    - Error state and loading indicator for async data
    - _Requirements: 2.1–2.6, 14.5_

  - [x] 12.2 Create OHeroSection.vue
    - Landing page hero with CTA, supports i18n
    - `prefers-reduced-motion` respecting animations
    - _Requirements: 16.6_

- [x] 13. Organism components — Admin panel
  - [x] 13.1 Create OAdminPanel.vue
    - Authenticated dashboard showing all Resource_Links
    - CRUD form using MFormField atoms with `useFormValidation`
    - Create/edit/delete flows with confirmation dialog for deletes
    - File upload validation (JPEG/PNG/WebP, max 2MB)
    - Reorder via drag-and-drop
    - Toast confirmations for all actions
    - Loading, error, and empty states
    - _Requirements: 1.1–1.8, 14.5, 20.1–20.14_

- [x] 14. Organism components — Viral: Social Currency
  - [x] 14.1 Create OLeaderboard.vue
    - Top-shared resources with rank indicators, `role="list"` markup
    - Loading/error/empty states
    - _Requirements: 8.1, 14.5_

  - [x] 14.2 Create achievement badge logic and gated content sections
    - Award badges on milestones (first share, profile setup, referral)
    - Announce via Toast_System and `aria-live` region
    - Gated sections with `aria-expanded` state
    - _Requirements: 8.2–8.4_

- [ ] 15. Organism components — Viral: Triggers
  - [ ] 15.1 Create ONotificationBar.vue
    - Contextual time-based messages, `role="alert"`
    - Personalized welcome-back message referencing last activity
    - _Requirements: 9.1, 9.2_

  - [ ] 15.2 Create ODailyCheckIn.vue
    - Progress indicator with `role="progressbar"`, `aria-valuenow`
    - Confirm progress via Toast_System
    - _Requirements: 9.3, 9.4_

- [ ] 16. Organism components — Viral: Emotion
  - [ ] 16.1 Create OIncomeCalculator.vue
    - Compute potential earnings, announce via `aria-live="polite"`
    - High-arousal visual emphasis respecting `prefers-reduced-motion`
    - Loading/error/empty states
    - _Requirements: 10.1, 10.4, 14.5_

  - [ ]* 16.2 Write property test for income calculator (Property 10: Income Calculator Correctness)
    - **Property 10: Income Calculator Correctness**
    - **Validates: Requirements 10.1**

  - [ ] 16.3 Create OCountdownTimer.vue
    - Limited-time featured resources, `role="timer"` with accessible labels
    - _Requirements: 10.2_

  - [ ] 16.4 Create pain-point sections
    - Contrast status quo with opportunities using semantic heading hierarchy
    - _Requirements: 10.3_

- [ ] 17. Organism components — Viral: Public Visibility
  - [ ] 17.1 Create OLiveActivityFeed.vue
    - Recent user actions, `aria-live="polite"` with throttled updates (max 1 per 10s)
    - Loading/error/empty states
    - _Requirements: 11.2, 14.5_

  - [ ]* 17.2 Write property test for activity feed throttle (Property 11: Activity Feed Throttle)
    - **Property 11: Activity Feed Throttle**
    - **Validates: Requirements 11.2**

  - [ ] 17.3 Create social proof and shareable badges
    - MSocialProof: active user count, recent avatars with descriptive alt text
    - Shareable badge graphics with accessible share labels
    - Share action opens platform dialog, confirms via Toast_System
    - _Requirements: 11.1, 11.3, 11.4_

- [ ] 18. Organism components — Viral: Practical Value
  - [ ] 18.1 Create OFreeToolkit.vue
    - Keyboard-operable interactive tools (calculators, checklists, templates)
    - Loading/error/empty states
    - _Requirements: 12.1, 14.5_

  - [ ] 18.2 Create content previews and shareable cards
    - Expandable detail sections with `aria-expanded`
    - Copy-to-clipboard shareable summaries, confirm via Toast_System
    - _Requirements: 12.2–12.4_

- [ ] 19. Organism components — Viral: Stories
  - [ ] 19.1 Create OFounderStory.vue
    - Semantic `<article>`, proper heading hierarchy, captioned images
    - _Requirements: 13.1_

  - [ ] 19.2 Create OSuccessStory.vue and OCaseStudy.vue
    - Before/after comparisons (not color-only)
    - Long-form content with correct heading levels and `aria-labelledby`
    - Contextual share/CTA at end of story
    - _Requirements: 13.2–13.4_

- [ ] 20. Checkpoint - Ensure all organism components render correctly with tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Pages and routing
  - [ ] 21.1 Create app/pages/index.vue (public landing page)
    - Compose viral organisms (Hero, Leaderboard, NotificationBar, Calculator, ActivityFeed, Toolkit, FounderStory)
    - Schema.org structured data (WebSite, Organization) in JSON-LD
    - OG meta tags
    - _Requirements: 3.1, 3.3_

  - [ ] 21.2 Create app/pages/resources.vue (resource grid page)
    - OResourceGrid organism with category grouping
    - SEO meta tags, hreflang
    - _Requirements: 2.1–2.6, 3.1, 3.4_

  - [ ] 21.3 Create app/pages/admin.vue (admin panel page)
    - Auth-gated OAdminPanel organism
    - _Requirements: 1.1_

- [ ] 22. PWA offline infrastructure
  - [ ] 22.1 Create public/offline.html (offline fallback page)
    - Styled page indicating content unavailable without connection
    - _Requirements: 5.4_

  - [ ] 22.2 Create PWA icons and manifest assets
    - Create `public/icons/` with 192px, 512px (`any` purpose), and maskable 512px icons
    - Verify manifest in nuxt.config.ts has `start_url`, `id`, `scope`, `display: standalone`, `theme_color`, `background_color`
    - _Requirements: 5.12_

  - [ ] 22.3 Configure workbox runtime caching strategies
    - NetworkFirst (3s timeout) for HTML pages
    - CacheFirst (365-day) for hashed JS/CSS bundles
    - CacheFirst (30-day, max 60 entries) for images
    - StaleWhileRevalidate for translation JSON
    - Precache all build-output static assets
    - _Requirements: 5.2–5.8_

- [ ] 23. SEO configuration
  - [ ] 23.1 Configure sitemap.xml generation and OG images
    - Sitemap with all public routes, changefreq, priority
    - OG image generation (production only)
    - Hreflang alternate tags for en, es, am
    - _Requirements: 3.1–3.6_

- [ ] 24. Atomic tier enforcement lint rule
  - [ ] 24.1 Create custom ESLint rule or lint script for atomic tier boundary checks
    - Atoms: no `ref(`, `reactive(`, `watch(`, lifecycle hooks, store imports
    - Molecules: imports only from atoms, no API calls, no router
    - All components must have correct tier prefix (A/M/O)
    - Fails lint/CI on violation
    - _Requirements: 14.2–14.6_

  - [ ]* 24.2 Write property test for atomic tier enforcement (Property 12: Atomic Tier Enforcement)
    - **Property 12: Atomic Tier Enforcement**
    - **Validates: Requirements 14.2, 14.3, 14.4**

- [ ] 25. Rate limiting and audit logging
  - [ ] 25.1 Implement rate limiting for email-triggering forms and audit logging
    - Max 3 submissions per IP per 15-minute window, 429 response on exceed
    - Audit log: timestamp, hashed IP, field name, rejection reason (no raw input)
    - _Requirements: 21.9, 21.10_

  - [ ]* 25.2 Write property test for rate limiting (Property 25: Rate Limiting)
    - **Property 25: Rate Limiting**
    - **Validates: Requirements 21.9**

- [x] 26. Testing infrastructure setup
  - [x] 26.1 Configure Vitest with Vue Test Utils and fast-check
    - Create `vitest.config.ts` with coverage settings (80% threshold for atoms)
    - Install and configure `fast-check` for property-based testing
    - Install `@vitest/coverage-v8`
    - _Requirements: 17.1, 17.5_

  - [x] 26.2 Configure Playwright for E2E testing
    - Configure Chromium, Firefox, WebKit browsers
    - Create base test fixtures
    - _Requirements: 17.2, 17.5_

- [ ] 27. E2E tests
  - [ ]* 27.1 Write E2E tests for navigation, accessibility, and keyboard interaction
    - Tab order, focus management on route change, aria-live regions, landmarks
    - _Requirements: 17.4_

  - [ ]* 27.2 Write E2E tests for admin CRUD flow
    - Full create/edit/delete with validation, toasts, confirmation dialogs
    - _Requirements: 17.4_

  - [ ]* 27.3 Write E2E tests for PWA install and offline behavior
    - Install prompt flow, offline fallback page
    - _Requirements: 17.4_

  - [ ]* 27.4 Write E2E tests for i18n locale switching
    - Language switch without reload, correct text, hreflang
    - _Requirements: 17.4_

- [x] 28. Dependency security and build validation
  - [x] 28.1 Add npm audit check to build process
    - Fail build on high/critical vulnerabilities
    - Fail build on network errors during audit
    - Output package name, severity, advisory URL
    - _Requirements: 18.1, 18.3, 18.5_

- [x] 29. Final checkpoint - Ensure all tests pass and build succeeds
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (27 properties from design)
- Unit tests validate specific examples, ARIA attributes, and edge cases
- E2E tests validate user flows, keyboard navigation, and cross-browser behavior
- All code uses TypeScript with Vue 3 Composition API (`<script setup lang="ts">`)
- Tailwind v4 CSS-only config (no `tailwind.config.ts`)
- Static generation via `nuxi generate` → `.output/public`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "1.4", "1.5", "26.1", "26.2"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4"] },
    { "id": 3, "tasks": ["2.5", "4.1", "6.1", "9.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "5.1", "6.2", "6.3", "6.4", "6.7", "6.8", "6.9"] },
    { "id": 5, "tasks": ["5.2", "5.3", "6.5", "6.6", "8.1", "8.2", "8.4", "8.5", "8.7"] },
    { "id": 6, "tasks": ["8.3", "8.6", "10.1", "10.2"] },
    { "id": 7, "tasks": ["11.1", "11.2", "11.3", "11.4", "12.1", "12.2"] },
    { "id": 8, "tasks": ["13.1", "14.1", "14.2", "15.1", "15.2", "16.1", "16.3", "16.4"] },
    { "id": 9, "tasks": ["16.2", "17.1", "17.3", "18.1", "18.2", "19.1", "19.2"] },
    { "id": 10, "tasks": ["17.2", "21.1", "21.2", "21.3"] },
    { "id": 11, "tasks": ["22.1", "22.2", "22.3", "23.1", "24.1", "25.1"] },
    { "id": 12, "tasks": ["24.2", "25.2", "28.1"] },
    { "id": 13, "tasks": ["27.1", "27.2", "27.3", "27.4"] }
  ]
}
```
