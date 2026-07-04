# PWA Icons

This directory contains Progressive Web App (PWA) icons used by the manifest.

## Required Icons

| File | Size | Purpose |
|------|------|---------|
| `icon-192x192.png` | 192×192 px | Standard PWA icon (any) |
| `icon-512x512.png` | 512×512 px | Large PWA icon (any) |
| `icon-maskable-512x512.png` | 512×512 px | Maskable icon (safe area = center 80%) |

## Current Status

⚠️ **These are placeholder icons.** Replace them with real branded assets before production deployment.

## Guidelines

- Use the M3 primary color `#6750A4` as background
- White `#FFFFFF` logo/mark on center 80% safe area (for maskable)
- PNG format, no transparency on maskable icon
- Run `node scripts/generate-icons.mjs` to regenerate placeholders

## Tools

- [Maskable.app](https://maskable.app) — preview and test maskable icons
- [RealFaviconGenerator](https://realfavicongenerator.net) — generate all sizes
- [PWA Builder](https://www.pwabuilder.com/imageGenerator) — image generator
