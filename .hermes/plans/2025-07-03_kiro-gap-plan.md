# Money Conversion SPA — Current State & Remaining Work

> Last updated: 2025-07-03 (late session). All critical fixes applied.

## Current State

### What's Built & Working

| Area | Count/Status | Notes |
|------|-------------|-------|
| Atomic components | 54 (19A / 13M / 22O) | All built and integrated |
| Pages | 5 (index, resources, admin, login, signup) | All functional |
| Stores | 6 (darkMode, engagement, resources, pwaInstall, toast, auth) | All built |
| i18n | 3 locales (en, es, am) | Complete — am.json proper Amharic |
| Tests | 23 files, 316 tests | **ALL PASSING** |
| Build | `npm run build` | Passes |
| Auth | Signup/login, gated buttons (NuxtLink redirect) | Functional |
| Content seeder | `app/data/contentArticles.ts` | 3 rich articles with markdown |
| Resource seeder | `app/stores/resources.ts` | 10 seed resources across 8 categories |
| Dark mode | Toggle, persistence, M3 CSS tokens | **Working** — watch+classList on `<html>` |
| Navbar | Scroll-shrink, auth links, language/dark-mode toggles | Functional |
| Admin CRUD | Create/Edit/Delete modals | Create=empty form, Edit=pre-filled form, Delete=confirmation |
| Footer | Language switcher, nav links, copyright | Functional |
| OAchievementBadge | 6 badges rendered with Material Icons | Fixed — icons now use `:name` prop |
| OLeaderboard | Top 5 resources with external links | Fixed — single icon per link |
| OContentPreviews | 3 expandable articles from seeder | Expand/collapse with markdown-to-HTML |

### Key Architecture Decisions

- **Dark mode**: Pinia store refs don't react in Nuxt 4 SSR templates. Workaround: `watch` on a `computed(() => darkModeStore.isDark)` and directly `document.documentElement.classList.toggle('dark', val)`.
- **Auth gating**: Buttons use `<NuxtLink to="/login">` when unauthenticated (not `router.push()`). This avoids `useRouter` auto-import issues in vitest.
- **Auth store**: localStorage-based. Users in `money_users`, sessions in `money_auth`. No backend required.
- **Icons**: Material Icons font loaded via Google Fonts. AIcon renders `<span class="material-icons">{{ name }}</span>`.
- **Click handlers**: AButton emits click via `$emit('click', $event)`. MAchievementBadge passes `:name="icon"` to AIcon.
- **Edit modal pre-fill**: Uses `resetForm()` + `nextTick(() => { setValues } )` to ensure form state is clean and fields populate before modal renders.

### Remaining Gaps (prioritized)

1. **E2E tests**: Playwright configured but never executed. Needs `npx playwright install` + `npx playwright test`.
2. **Lighthouse audit**: Never performed. Performance/Accessibility/PWA/SEO scores unknown.
3. **Static generation**: `npm run generate` not verified for all locale routes.
4. **PWA offline**: Configured but never tested end-to-end.
5. **Netlify deploy**: `netlify.toml` exists, site not deployed.
6. **i18n for OCaseStudy**: `resultItem1/2/3` keys added to en.json but may be missing in es/am.

### New Files Created This Session

| File | Purpose |
|------|---------|
| `app/stores/auth.ts` | Auth store |
| `app/composables/useAuthGate.ts` | Auth gate composable |
| `app/pages/login.vue` | Login page |
| `app/pages/signup.vue` | Signup page |
| `app/data/contentArticles.ts` | Content article seeder |

### Files Deleted

| File | Reason |
|------|--------|
| `app/composables/useLocaleHead.ts` | Collided with Nuxt i18n's built-in composable |

### Key Commands

```bash
npm run dev                  # Dev server (port 3000)
npm run build                # SSR build
npm run generate             # Static site → .output/public
npm run test:unit            # Vitest (316 tests, 23 files)
npx playwright install       # Install Playwright browsers
npx playwright test          # E2E tests
npm run lint:tiers           # Atomic design enforcement
node scripts/generate-theme.mjs
node scripts/generate-icons.mjs
```
