# PWA Caching Strategy

This document describes the Workbox runtime caching strategies configured in `nuxt.config.ts`.

## Overview

The app uses `@vite-pwa/nuxt` with Workbox to provide offline-first behavior. All strategies are configured under `pwa.workbox.runtimeCaching`.

## Strategies

### 1. HTML Pages — NetworkFirst (3s timeout)

**Pattern:** `/` or any path without a file extension (e.g., `/resources`, `/admin`)

```
urlPattern: /\/(?:[^.]+(?:\?.*)?)?$/
handler: NetworkFirst
networkTimeoutSeconds: 3
cacheName: pages-cache
maxEntries: 50
```

**Behavior:** Tries the network first. Falls back to cache if network takes >3s or is unavailable. Ensures users always see fresh content when online, with a cached fallback when offline.

**Navigate fallback:** `/offline.html` — served for uncached navigations when offline.

---

### 2. Hashed JS/CSS Bundles — CacheFirst (365 days)

**Pattern:** `/_nuxt/...[hash]...`

```
urlPattern: /\/_nuxt\/.*\.[a-f0-9]+\.\w+$/
handler: CacheFirst
maxAgeSeconds: 31,536,000 (365 days)
maxEntries: 200
cacheName: hashed-bundles-cache
```

**Behavior:** Immutable assets (content-addressed by hash) are served from cache permanently. Cache is busted automatically when the hash changes on new deployments.

---

### 3. Images — CacheFirst (30 days, max 60)

**Pattern:** Files ending in `.png`, `.jpg`, `.jpeg`, `.svg`, `.gif`, `.webp`, `.ico`

```
urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
handler: CacheFirst
maxAgeSeconds: 2,592,000 (30 days)
maxEntries: 60
cacheName: images-cache
```

**Behavior:** Images are cached on first load and served from cache for 30 days. Limited to 60 entries to manage storage.

---

### 4. Translation JSON — StaleWhileRevalidate

**Pattern:** `/i18n/locales/*.json`

```
urlPattern: /\/i18n\/locales\/.*\.json$/
handler: StaleWhileRevalidate
maxEntries: 10
cacheName: translations-cache
```

**Behavior:** Serves cached translation files instantly while updating in the background. Ensures i18n strings are always available offline but stay fresh.

---

## Additional Configuration

- `skipWaiting: true` — New service worker activates immediately without waiting for old tabs to close
- `clientsClaim: true` — New service worker claims all existing clients immediately
- `navigateFallback: '/offline.html'` — Shown when a navigation request cannot be served from cache

## Lighthouse PWA Score

This configuration is designed to achieve a full Lighthouse PWA score:
- ✅ Manifest with `start_url`, `id`, `scope`, `display: standalone`
- ✅ `theme_color` and `background_color`
- ✅ 192×192 and 512×512 icons (`any` purpose)
- ✅ 512×512 maskable icon
- ✅ Offline fallback page
- ✅ `autoUpdate` registration type
