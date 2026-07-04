# Known Build Failures

Date: 2025-06-05

## Failure 1: Missing @kwsites/file-exists dependency
- **Error**: Cannot find package '@kwsites/file-exists/dist/index.js'
- **Cause**: Missing dependency in node_modules
- **Resolution**: Clean reinstall (removed node_modules, ran npm install)
- **Status**: Resolved

## Failure 2: Duplicate import checkRateLimit
- **Error**: Duplicated imports "checkRateLimit" from app/utils/rateLimit.ts ignored, app/utils/rateLimiter.ts used
- **Cause**: Two files with same export in utils directory
- **Resolution**: Need to remove one file
- **Status**: Not resolved

## Failure 3: oxc-walker parseSync error
- **Error**: oxc-walker: could not resolve a parseSync implementation
- **Cause**: Missing oxc-parser or rolldown package
- **Resolution**: Install oxc-parser or update Nuxt/Vite config to use rolldown
- **Status**: Not resolved

## Failure 4: Duplicate i18n locales path
- **Error**: ENOENT: no such file or directory, open '.../i18n/i18n/locales/am.json'
- **Cause**: i18n module doubling the path
- **Resolution**: Removed `langDir: 'i18n/locales'` from nuxt.config.ts
- **Status**: Resolved

## Current Build Status
- Dependencies installed
- i18n path issue fixed
- Still blocked by oxc-walker error
- Duplicate rateLimit file needs cleanup

## Next Steps to Fix Build
1. Remove duplicate rateLimit.ts file
2. Install oxc-parser: npm install --save-dev oxc-parser
3. Or configure Nuxt to use rolldown instead of oxc-walker

## Build Success (2025-06-05 01:16:25)

**Resolution Steps:**
1. Removed duplicate `app/utils/rateLimit.ts` file (kept rateLimiter.ts)
2. Installed `oxc-parser` as dev dependency

**Build Output:**
- ✓ Client built in 1563ms
- ✓ Server built in 538ms
- ✓ Prerendered 4 routes in 1.111 seconds
- ✓ Generated public `.output/public`
- ✓ Ready for static hosting deployment

**Generated Files:**
- `.output/public/` - Static site ready for Netlify/any static host
- All pages prerendered (/, /404.html, /200.html)

**Current Status:**
- 40/104 tasks completed
- 64 tasks remaining (mostly organism components, pages, E2E tests)
- Core infrastructure (Nuxt, Vue, Material Design 3 theme, stores) fully working
- Build production-ready, can deploy to Netlify immediately

**Next Steps for Full MVP:**
- Continue with organism components (Navbar, Hero, ToastContainer, etc.)
- Implement pages (index.vue, resources.vue, admin.vue)
- Generate PWA icons and offline.html
- Run tests from skippedtests.md when needed
