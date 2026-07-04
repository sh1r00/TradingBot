# Money Conversion SPA — Gap-to-Production Plan

> Derived from `.kiro/specs/money-conversion-spa/{requirements,design,tasks}.md` — cross-referenced against actual code state on 2025-07-03.

**Goal:** Close the remaining gaps to ship a production-ready Nuxt 4 PWA on Netlify.  
**Current build:** `npm run build` passes. **Tests:** 19/23 files pass (295/355 tests, 83%).  
**Status:** All 54 components built. All 3 pages built. All 5 stores built. All config done.

---

## Gap Analysis: .kiro Specs vs Reality

### Misalignment: .kiro tasks.md is stale

The `.kiro/specs/money-conversion-spa/tasks.md` marks tasks 15–25 as `[ ]` (not done), but the actual codebase has all organisms, pages, PWA config, atomic tier lint, and SEO config in place. **Reality is ahead of the spec.** The real gaps are:

### Actual Remaining Work (by requirement)

| Req | What | Status |
|-----|------|--------|
| 1 | Admin CRUD | OAdminPanel built. Tests fail (template mismatches). **Needs test fixes.** |
| 2 | Resource display | OResourceGrid built. Works. |
| 3 | SEO | Config in nuxt.config.ts. OG images: dev-only disabled. **Verify generate output.** |
| 4 | Security headers | nuxt-security configured. CSP, Netlify headers set. |
| 5 | PWA | SW config done, icons exist, offline.html exists. **Never verified end-to-end.** |
| 6 | i18n | Locales exist (en/es/am). **Coverage for newer organisms unchecked.** |
| 7 | Toast | OToastContainer + useToast + store all built. Tests pass. |
| 8–13 | Viral organisms | All 22 organisms built. **Some i18n keys may be missing.** |
| 14 | Atomic tiers | A/M/O enforced. `npm run lint:tiers` passes. |
| 15 | M3 theme | Generated. Property tests pass. |
| 16 | Accessibility | Infrastructure done. **Lighthouse audit never run.** |
| 17 | Testing | Vitest + Playwright configured. **4 organism test files fail. E2E never verified.** |
| 18 | Dependency security | npm audit check script exists. |
| 19 | Lint/format | ESLint + Prettier configured. |
| 20 | Form validation | useFormValidation built. Tests pass. |
| 21 | Sanitization | utils/sanitize.ts built. Tests pass. **Rate limiter exists but untested.** |
| 22 | Offline | offline.html exists. **E2E verification never done.** |
| 23–29 | Final checks | Build passes. Tests mostly pass. |

---

## The 3-Phase Plan

### Phase 1: Fix & Verify (what blocks production)

**Goal:** Green test suite + verified build artifact.

#### 1.1 Fix 4 remaining organism test files (OAdminPanel, OLeaderboard, OAchievementBadge, OExclusiveAccess)

**Root causes (from analysis):**
- **OAdminPanel** (~27 failing): Test selectors reference DOM classes (`.group`, `.cursor-pointer`) that changed when the component was built out. The template structure diverged from test expectations. **Fix:** Rewrite test selectors to match current component DOM, or simplify to smoke tests (mount + verify key elements exist).
- **OLeaderboard** (~22 failing): createTestingPinia integration issues — store state not matching component expectations (i18n messages different from what component renders). **Fix:** Align i18n messages in test with component keys, fix Pinia mock state shape.
- **OAchievementBadge** (~7 failing): Component renders OAchievementBadge organism which wraps MAchievementBadge molecule — test expectations mismatch at organism level. **Fix:** Simplify to smoke tests or properly mock nested molecules.
- **OExclusiveAccess** (3 failing): locked/unlocked state toggle + toast trigger mock. **Fix:** Dynamic mock switching for unlockedGatedContent ref value.

**Files:** `tests/unit/organisms/OAdminPanel.spec.ts`, `OLeaderboard.spec.ts`, `OAchievementBadge.spec.ts`, `OExclusiveAccess.spec.ts`

**Target:** 0 failing test files, `npm run test:unit` exits 0.

#### 1.2 Verify static generation

**Commands:**
```bash
npm run generate
ls .output/public/           # verify structure
# Check: index.html, resources/index.html, admin/index.html
# Check: es/index.html, es/resources/index.html, am/...
# Check: _nuxt/ (hashed assets), sw.js, manifest.webmanifest
# Check: offline.html in output
```

**Target:** Static site generates without errors. All locale routes produced.

#### 1.3 Verify E2E tests

**Commands:**
```bash
npm run dev &                # start dev server
npx playwright test --reporter=list
```

**Files:** `tests/e2e/27.1-navigation-a11y.spec.ts`, `27.2-admin-crud.spec.ts`, `27.3-form-validation.spec.ts`, `27.4-i18n-pwa.spec.ts`

**Target:** All 4 E2E specs pass, or document failures with root causes.

#### 1.4 Run Lighthouse audit

**Commands:**
```bash
npx serve .output/public     # serve static build
npx lighthouse http://localhost:3000 --view --preset=desktop
```

**Targets:** Performance >= 90, Accessibility >= 95, Best Practices >= 90, SEO >= 80, PWA >= 95.

**Fix any violations found.**

---

### Phase 2: Content & Completeness (filling gaps)

**Goal:** App is fully functional with real content.

#### 2.1 i18n key coverage audit

**Command:**
```bash
# Extract all $t() and t() keys from components
grep -roh "\$t('[^']*')" app/components/ | sed "s/\$t('//;s/')//" | sort -u
grep -roh "t('[^']*')" app/components/ | sed "s/t('//;s/')//" | sort -u
```

Cross-reference against `i18n/locales/en.json`. Add missing keys to all 3 locales.

**Target:** Zero missing i18n keys. All 3 locales have complete coverage.

#### 2.2 Seed resource data

**File:** `app/stores/resources.ts`

Add 6–12 curated resource links across 3–4 categories (make money online, investing, freelancing, etc.). Verify they render on `/resources` and are CRUD-able via `/admin`.

**Target:** Resources page shows real-looking cards. Admin panel manages data end-to-end.

#### 2.3 PWA icon verification

**Commands:**
```bash
node scripts/generate-icons.mjs   # regenerate if needed
# Verify: public/icons/icon-192x192.png, icon-512x512.png, icon-maskable-512x512.png
# Verify manifest in nuxt.config.ts includes all 3 icon entries with purposes
```

**Target:** All required PWA icons exist with correct sizes and purposes.

---

### Phase 3: Ship (deploy to production)

**Goal:** Live on Netlify with HTTPS.

#### 3.1 Git initialization

```bash
git add -A
git commit -m "feat: Money Conversion SPA — Nuxt 4 PWA with M3, i18n, atomic design, offline-first"
```

#### 3.2 Netlify deploy

- Push to GitHub
- Connect Netlify to repo
- Set `NUXT_PUBLIC_BASE_URL` environment variable in Netlify UI
- Verify `netlify.toml` has correct `publish = ".output/public"`
- Deploy

**Target:** Site live on `https://<domain>`. All routes work. PWA installable. HTTPS enforced.

#### 3.3 Post-deploy verification

- Test all 3 locales: `/`, `/es/`, `/am/`
- Test resources page: `/resources`
- Test admin page: `/admin`
- Test offline: load site, disable network, reload — should render from cache
- Run Lighthouse against production URL

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Organism test fixes take longer than expected | Simplify to smoke tests (mount + verify rendering); defer deep interaction tests |
| `npm run generate` produces incomplete output | Verify nuxt.config.ts i18n strategy produces all locale routes |
| E2E tests fail on first run | Fix selectors; use `--debug` flag for interactive debugging |
| Lighthouse PWA score < 95 | Verify manifest, SW registration, icons; iterate |
| am.json has placeholder translations | Acceptable for MVP; flag for later |

---

## Execution Order (strict)

```
1.1 Fix organism tests       ─┐
1.2 Verify static generation  ├─ Phase 1: Fix & Verify (BLOCKER)
1.3 Verify E2E tests          │
1.4 Run Lighthouse audit     ─┘
2.1 i18n key audit           ─┐
2.2 Seed resource data        ├─ Phase 2: Content
2.3 PWA icon verification    ─┘
3.1 Git init                 ─┐
3.2 Netlify deploy            ├─ Phase 3: Ship
3.3 Post-deploy verification ─┘
```

---

## Key Commands

```bash
npm run dev                  # Dev server
npm run build                # SSR build
npm run generate             # Static site -> .output/public
npm run test:unit            # Vitest (unit + property)
npm run test:unit -- --reporter=verbose
npx playwright test --reporter=list
npm run lint:tiers           # Atomic design enforcement
npx serve .output/public     # Preview static build
npx lighthouse http://localhost:3000 --view
node scripts/generate-theme.mjs
```
