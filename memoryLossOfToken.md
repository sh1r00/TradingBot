# Memory Loss of Token — Continuation Context

## Project Overview

This is the **money-conversion-spa** spec execution for a Nuxt 4 statically-generated PWA with Material Design 3, atomic component architecture, viral conversion organisms, i18n (en/es/am), offline-first PWA, and WCAG 2.2 AA accessibility.

## Spec Location

- Spec directory: `c:\Users\joedo\OneDrive\Documents\TradingBot\.kiro\specs\money-conversion-spa\`
- Tasks file: `.kiro/specs/money-conversion-spa/tasks.md`
- Requirements: `.kiro/specs/money-conversion-spa/requirements.md`
- Design: `.kiro/specs/money-conversion-spa/design.md`
- Config: `.kiro/specs/money-conversion-spa/.config.kiro` → `{"specId": "9f3ec069-acb7-4aa4-8cc3-09bd6312f9fc", "workflowType": "requirements-first", "specType": "feature"}`

## Workspace Root

`c:\Users\joedo\OneDrive\Documents\TradingBot`

## What Has Been Completed (31/104 tasks)

### Wave 0 — Project Scaffolding & Test Infrastructure
- [x] 1.1 Initialize Nuxt 4 project with package.json (exact versions, theme seeds, engines, scripts)
- [x] 1.3 Create ESLint and Prettier configuration files
- [x] 1.4 Create Netlify deployment configuration
- [x] 1.5 Create SECURITY.md template
- [x] 26.1 Configure Vitest with Vue Test Utils and fast-check
- [x] 26.2 Configure Playwright for E2E testing

### Wave 1 — Nuxt Config & Theme Generator
- [x] 1.2 Install and configure Nuxt modules in nuxt.config.ts
- [x] 2.1 Create scripts/generate-theme.mjs (M3 token generator)

### Wave 2 — Theme Integration & Property Tests
- [x] 2.2 Write property test for theme generation (Property 13)
- [x] 2.3 Write property test for invalid hex seed rejection (Property 15)
- [x] 2.4 Create app/assets/css/main.css with Tailwind v4 @theme block

### Wave 3 — Atoms, Sanitize Utils, i18n
- [x] 2.5 Write property test for M3 color contrast (Property 14)
- [x] 4.1 Create atom components (12 atoms: AButton, AIcon, AText, AInput, AImage, ABadge, ASpinner, ALink, ASwitch, AAvatar, AProgressBar, AChip)
- [x] 6.1 Create utils/sanitize.ts (7 pure functions)
- [x] 9.1 Create i18n locale JSON files (en.json, es.json, am.json)

### Wave 4 — Molecules, Composables, Tests
- [x] 4.2 Write unit tests for atom components (89 tests across 6 test files)
- [x] 4.3 Write property test for image alt text compliance (Property 17)
- [x] 5.1 Create molecule components (8 molecules: MResourceCard, MFormField, MCountdown, MToastItem, MAchievementBadge, MShareableCard, MContentPreview, MSocialProof)
- [x] 6.2 Write property tests for sanitization utilities (Properties 22, 23, 24, 27)
- [x] 6.3 Write property test for URL validation (Property 2)
- [x] 6.4 Create composables/useFormValidation.ts
- [x] 6.7 Create composables/useToast.ts (+ stores/toast.ts minimal)
- [x] 6.8 Create utils/a11y.ts (contrast ratio utilities)
- [x] 6.9 Create composables/useLocaleHead.ts

### Parent Tasks Auto-Completed
- [x] 1. Project scaffolding and configuration
- [x] 2. Material Design 3 theme generation and Tailwind v4 integration
- [x] 4. Atomic component layer — Atoms
- [x] 5. Atomic component layer — Molecules
- [x] 6. Utility modules and composables
- [x] 9. Internationalization locale files
- [x] 26. Testing infrastructure setup

## What Remains (73 tasks)

### Next Ready (Wave 5) — Pinia Stores + Optional Tests
- 8.1 Create stores/darkMode.ts
- 8.2 Create stores/toast.ts (full implementation)
- 8.4 Create stores/pwaInstall.ts
- 8.5 Create stores/resources.ts
- 8.7 Create stores/engagement.ts
- Optional: 5.2 Property test for description truncation (Property 7)
- Optional: 5.3 Unit tests for molecule components
- Optional: 6.5 Property tests for form validation (Properties 4, 16, 18, 20, 21)
- Optional: 6.6 Property tests for email/file upload (Properties 5, 19)

### Wave 6 — Store Tests, Layout, App Root
- Optional: 8.3 Property tests for toast store (Properties 8, 9)
- Optional: 8.6 Property tests for resource store (Properties 1, 3, 6)
- 10.1 Create app/layouts/default.vue
- 10.2 Create app/app.vue (root component)

### Wave 7 — Organism Components: Core + Public
- 11.1 Create ONavbar.vue
- 11.2 Create OToastContainer.vue
- 11.3 Create OInstallPrompt.vue
- 11.4 Create OFooter.vue
- 12.1 Create OResourceGrid.vue
- 12.2 Create OHeroSection.vue

### Wave 8 — Organism Components: Admin + Viral (Social Currency, Triggers, Emotion)
- 13.1 Create OAdminPanel.vue
- 14.1 Create OLeaderboard.vue
- 14.2 Create achievement badge logic and gated content
- 15.1 Create ONotificationBar.vue
- 15.2 Create ODailyCheckIn.vue
- 16.1 Create OIncomeCalculator.vue
- 16.3 Create OCountdownTimer.vue
- 16.4 Create pain-point sections

### Wave 9 — Organism Components: Viral (Visibility, Value, Stories)
- Optional: 16.2 Property test for income calculator (Property 10)
- 17.1 Create OLiveActivityFeed.vue
- 17.3 Create social proof and shareable badges
- 18.1 Create OFreeToolkit.vue
- 18.2 Create content previews and shareable cards
- 19.1 Create OFounderStory.vue
- 19.2 Create OSuccessStory.vue and OCaseStudy.vue

### Wave 10 — Activity Feed Test + Pages
- Optional: 17.2 Property test for activity feed throttle (Property 11)
- 21.1 Create app/pages/index.vue
- 21.2 Create app/pages/resources.vue
- 21.3 Create app/pages/admin.vue

### Wave 11 — PWA, SEO, Lint Rules, Rate Limiting
- 22.1 Create public/offline.html
- 22.2 Create PWA icons and manifest assets
- 22.3 Configure workbox runtime caching strategies
- 23.1 Configure sitemap.xml generation and OG images
- 24.1 Create custom ESLint rule for atomic tier boundary checks
- 25.1 Implement rate limiting and audit logging

### Wave 12 — Final Property Tests + Build Security
- Optional: 24.2 Property test for atomic tier enforcement (Property 12)
- Optional: 25.2 Property test for rate limiting (Property 25)
- 28.1 Add npm audit check to build process

### Wave 13 — E2E Tests
- Optional: 27.1 E2E tests for navigation, accessibility, keyboard
- Optional: 27.2 E2E tests for admin CRUD flow
- Optional: 27.3 E2E tests for PWA install and offline
- Optional: 27.4 E2E tests for i18n locale switching

### Checkpoints (auto-complete when children done)
- 3. Checkpoint - theme generation and project config
- 7. Checkpoint - utilities and composables pass tests
- 20. Checkpoint - organism components render correctly
- 29. Final checkpoint - all tests pass and build succeeds

## How to Continue

1. Open this workspace in Kiro
2. Tell the agent: "Continue running all tasks including optionals for the money-conversion-spa spec. Tasks file is at `.kiro/specs/money-conversion-spa/tasks.md`. 31 tasks are already completed. Start from the next ready wave."
3. The agent should:
   - Call `task_list` with status='ready' to see what's next
   - Mark tasks in_progress, dispatch to spec-task-execution subagent
   - Mark completed on success
   - Continue until all 104 tasks are done

## Key Technical Notes

- **npm install will fail** because package.json has some future-dated versions (nuxt@4.4.0, @nuxtjs/seo@2.2.2, happy-dom@17.8.0). The subagents have been creating files without running full installs.
- All **property tests use fast-check** with 100 min iterations (configured in tests/unit/setup.ts)
- **Tailwind v4**: No tailwind.config.ts. All config in CSS via @theme and @variant in main.css
- **Atomic tier rules**: Atoms = no state/hooks/stores, Molecules = only local ref + atoms imports, Organisms = full power
- **stores/toast.ts** already has a minimal working implementation from task 6.7. Task 8.2 should flesh it out with timer logic.
- All components use `<script setup lang="ts">`
- M3 color tokens are in `app/assets/css/material-tokens.css` (auto-generated)

## Files Created So Far

```
├── .nvmrc (22)
├── .prettierrc
├── SECURITY.md
├── eslint.config.mjs
├── netlify.toml
├── nuxt.config.ts
├── package.json
├── playwright.config.ts
├── vitest.config.ts
├── scripts/generate-theme.mjs
├── i18n/locales/en.json, es.json, am.json
├── app/
│   ├── assets/css/main.css, material-tokens.css
│   ├── components/
│   │   ├── atoms/ (12 files: AButton, AIcon, AText, AInput, AImage, ABadge, ASpinner, ALink, ASwitch, AAvatar, AProgressBar, AChip)
│   │   └── molecules/ (8 files: MResourceCard, MFormField, MCountdown, MToastItem, MAchievementBadge, MShareableCard, MContentPreview, MSocialProof)
│   ├── composables/ (useFormValidation.ts, useToast.ts, useLocaleHead.ts)
│   ├── stores/ (toast.ts - minimal)
│   └── utils/ (sanitize.ts, a11y.ts)
├── tests/
│   ├── unit/
│   │   ├── setup.ts
│   │   ├── atoms/ (AButton.spec, AInput.spec, AImage.spec, ASwitch.spec, AProgressBar.spec, ASpinner.spec)
│   │   ├── composables/ (useFormValidation.spec, useToast.spec)
│   │   ├── components/ (image-alt.property.spec)
│   │   ├── theme/ (generate-theme.property.spec, generate-theme-invalid.property.spec, color-contrast.property.spec)
│   │   └── utils/ (sanitize.spec, sanitize.property.spec, url-validation.property.spec, a11y.spec)
│   └── e2e/
│       └── fixtures.ts
```
