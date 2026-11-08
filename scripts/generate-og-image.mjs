#!/usr/bin/env node
/**
 * OG image generator — renders a branded 1200×630 social-share card.
 *
 * Uses satori (HTML → SVG) + @resvg/resvg-js (SVG → PNG), both already present
 * as transitive dependencies of nuxt-og-image. No browser needed.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const PRIMARY = '#6750A4'
const PRIMARY_DARK = '#3f2e63'

// Try common system fonts (Windows/macOS/Linux) so the render doesn't hard-depend on one OS.
const FONT_CANDIDATES = [
  'C:/Windows/Fonts/segoeui.ttf',
  'C:/Windows/Fonts/arial.ttf',
  '/System/Library/Fonts/Helvetica.ttc',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
]

let fontBuffer = null
for (const f of FONT_CANDIDATES) {
  try {
    fontBuffer = readFileSync(f)
    break
  } catch {
    /* try next */
  }
}
if (!fontBuffer) {
  console.error('✖ No usable system font found — cannot render OG image text.')
  process.exit(1)
}

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
        color: '#FFFFFF',
        fontFamily: 'System',
        padding: '64px',
        textAlign: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { fontSize: '76px', fontWeight: 700, letterSpacing: '-1px', lineHeight: '1.1' },
            children: 'Money Conversion SPA',
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: '34px', marginTop: '28px', opacity: '0.92' },
            children: 'Curated, vetted money-making resources & tools',
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'System', data: fontBuffer, weight: 400, style: 'normal' },
      { name: 'System', data: fontBuffer, weight: 700, style: 'normal' },
    ],
  },
)

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
const png = resvg.render().asPng()
const out = join(ROOT, 'public', 'og-image.png')
writeFileSync(out, png)
console.log(`✅ Generated ${out} (${png.length} bytes)`)
