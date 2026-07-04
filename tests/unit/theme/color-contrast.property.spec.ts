// Feature: money-conversion-spa, Property 14: M3 Semantic Color Contrast Meets WCAG AA
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
  Hct,
} from '@material/material-color-utilities'

/**
 * Validates: Requirements 15.6, 16.11
 *
 * Property 14: M3 Semantic Color Contrast Meets WCAG AA
 * For any M3 semantic foreground/background token pairing (on-primary over primary,
 * on-surface over surface, on-secondary over secondary, on-tertiary over tertiary,
 * on-error over error, on-primary-container over primary-container,
 * on-secondary-container over secondary-container, on-tertiary-container over tertiary-container,
 * on-error-container over error-container, on-surface-variant over surface-variant),
 * the computed contrast ratio shall be >= 4.5:1 for normal text and >= 3:1 for large text
 * and non-text UI components, in both light mode (:root) and dark mode (.dark) schemes.
 */

// --- WCAG Contrast Ratio Utilities ---

/**
 * Convert a hex color string to linear RGB components.
 * Applies sRGB linearization per WCAG 2.1 spec.
 */
function hexToLinearRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const linearize = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return [linearize(r), linearize(g), linearize(b)]
}

/**
 * Compute relative luminance per WCAG 2.1 definition.
 * L = 0.2126*R + 0.7152*G + 0.0722*B
 */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearRgb(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Compute WCAG contrast ratio between two colors.
 * ratio = (L1 + 0.05) / (L2 + 0.05) where L1 >= L2
 */
function contrastRatio(foreground: string, background: string): number {
  const lum1 = relativeLuminance(foreground)
  const lum2 = relativeLuminance(background)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

// --- Theme Generation Logic (mirrors generate-theme.mjs) ---

// M3 semantic role mappings: [token-name, palette-source, light-tone, dark-tone]
const SEMANTIC_ROLES = [
  ['primary', 'primary', 40, 80],
  ['on-primary', 'primary', 100, 20],
  ['primary-container', 'primary', 90, 30],
  ['on-primary-container', 'primary', 10, 90],
  ['secondary', 'secondary', 40, 80],
  ['on-secondary', 'secondary', 100, 20],
  ['secondary-container', 'secondary', 90, 30],
  ['on-secondary-container', 'secondary', 10, 90],
  ['tertiary', 'tertiary', 40, 80],
  ['on-tertiary', 'tertiary', 100, 20],
  ['tertiary-container', 'tertiary', 90, 30],
  ['on-tertiary-container', 'tertiary', 10, 90],
  ['error', 'error', 40, 80],
  ['on-error', 'error', 100, 20],
  ['error-container', 'error', 90, 30],
  ['on-error-container', 'error', 10, 90],
  ['surface', 'neutral', 99, 10],
  ['on-surface', 'neutral', 10, 90],
  ['surface-variant', 'neutral-variant', 90, 30],
  ['on-surface-variant', 'neutral-variant', 30, 80],
] as const

/**
 * Foreground/background pairings to test for WCAG AA contrast.
 * Each entry: [foregroundToken, backgroundToken]
 */
const CONTRAST_PAIRINGS: [string, string][] = [
  ['on-primary', 'primary'],
  ['on-secondary', 'secondary'],
  ['on-tertiary', 'tertiary'],
  ['on-error', 'error'],
  ['on-surface', 'surface'],
  ['on-primary-container', 'primary-container'],
  ['on-secondary-container', 'secondary-container'],
  ['on-tertiary-container', 'tertiary-container'],
  ['on-error-container', 'error-container'],
  ['on-surface-variant', 'surface-variant'],
]

function createTonalPalette(hexColor: string): TonalPalette {
  const argb = argbFromHex(hexColor)
  const hct = Hct.fromInt(argb)
  return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma)
}

interface SemanticColors {
  light: Record<string, string>
  dark: Record<string, string>
}

/**
 * Generate semantic color tokens from seed colors using the same
 * logic as scripts/generate-theme.mjs.
 */
function generateSemanticColors(
  primary: string,
  secondary: string,
  tertiary: string,
): SemanticColors {
  const palettes: Record<string, TonalPalette> = {
    primary: createTonalPalette(primary),
    secondary: createTonalPalette(secondary),
    tertiary: createTonalPalette(tertiary),
  }

  // Neutral derived from primary with low chroma
  const primaryArgb = argbFromHex(primary)
  const primaryHct = Hct.fromInt(primaryArgb)
  palettes['neutral'] = TonalPalette.fromHueAndChroma(primaryHct.hue, 4)
  palettes['neutral-variant'] = TonalPalette.fromHueAndChroma(primaryHct.hue, 8)

  // Error palette: fixed red hue
  palettes['error'] = TonalPalette.fromHueAndChroma(25, 84)

  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}

  for (const [name, source, lightTone, darkTone] of SEMANTIC_ROLES) {
    light[name] = hexFromArgb(palettes[source].tone(lightTone))
    dark[name] = hexFromArgb(palettes[source].tone(darkTone))
  }

  return { light, dark }
}

// --- fast-check Arbitrary ---

/**
 * Arbitrary generator for valid 6-character hex color strings.
 */
const hexColorArb = fc
  .array(fc.integer({ min: 0, max: 255 }), { minLength: 3, maxLength: 3 })
  .map(([r, g, b]) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  })

// --- Property Test ---

describe('Property 14: M3 Semantic Color Contrast Meets WCAG AA', () => {
  it('all foreground/background pairings meet >= 4.5:1 contrast in light mode', () => {
    fc.assert(
      fc.property(
        hexColorArb,
        hexColorArb,
        hexColorArb,
        (primary, secondary, tertiary) => {
          const { light } = generateSemanticColors(primary, secondary, tertiary)

          for (const [fg, bg] of CONTRAST_PAIRINGS) {
            const ratio = contrastRatio(light[fg], light[bg])
            expect(
              ratio,
              `Light mode: "${fg}" over "${bg}" contrast ratio ${ratio.toFixed(2)}:1 < 4.5:1 ` +
                `(fg=${light[fg]}, bg=${light[bg]}, seeds: primary=${primary}, secondary=${secondary}, tertiary=${tertiary})`,
            ).toBeGreaterThanOrEqual(4.5)
          }
        },
      ),
    )
  })

  it('all foreground/background pairings meet >= 4.5:1 contrast in dark mode', () => {
    fc.assert(
      fc.property(
        hexColorArb,
        hexColorArb,
        hexColorArb,
        (primary, secondary, tertiary) => {
          const { dark } = generateSemanticColors(primary, secondary, tertiary)

          for (const [fg, bg] of CONTRAST_PAIRINGS) {
            const ratio = contrastRatio(dark[fg], dark[bg])
            expect(
              ratio,
              `Dark mode: "${fg}" over "${bg}" contrast ratio ${ratio.toFixed(2)}:1 < 4.5:1 ` +
                `(fg=${dark[fg]}, bg=${dark[bg]}, seeds: primary=${primary}, secondary=${secondary}, tertiary=${tertiary})`,
            ).toBeGreaterThanOrEqual(4.5)
          }
        },
      ),
    )
  })

  it('all foreground/background pairings meet >= 3:1 contrast for large text in light mode', () => {
    fc.assert(
      fc.property(
        hexColorArb,
        hexColorArb,
        hexColorArb,
        (primary, secondary, tertiary) => {
          const { light } = generateSemanticColors(primary, secondary, tertiary)

          for (const [fg, bg] of CONTRAST_PAIRINGS) {
            const ratio = contrastRatio(light[fg], light[bg])
            expect(
              ratio,
              `Light mode large text: "${fg}" over "${bg}" contrast ratio ${ratio.toFixed(2)}:1 < 3:1 ` +
                `(fg=${light[fg]}, bg=${light[bg]})`,
            ).toBeGreaterThanOrEqual(3)
          }
        },
      ),
    )
  })

  it('all foreground/background pairings meet >= 3:1 contrast for large text in dark mode', () => {
    fc.assert(
      fc.property(
        hexColorArb,
        hexColorArb,
        hexColorArb,
        (primary, secondary, tertiary) => {
          const { dark } = generateSemanticColors(primary, secondary, tertiary)

          for (const [fg, bg] of CONTRAST_PAIRINGS) {
            const ratio = contrastRatio(dark[fg], dark[bg])
            expect(
              ratio,
              `Dark mode large text: "${fg}" over "${bg}" contrast ratio ${ratio.toFixed(2)}:1 < 3:1 ` +
                `(fg=${dark[fg]}, bg=${dark[bg]})`,
            ).toBeGreaterThanOrEqual(3)
          }
        },
      ),
    )
  })
})
