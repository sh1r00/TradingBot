/**
 * Pure WCAG 2.1 contrast ratio utility functions.
 * All functions are stateless, side-effect-free, and independently testable.
 *
 * @module utils/a11y
 */

/**
 * Parses a hex color string to its RGB components.
 * Accepts 3-digit (#RGB) or 6-digit (#RRGGBB) hex strings, with or without the # prefix.
 *
 * @param hex - The hex color string (e.g., "#FF0000", "FF0000", "#F00")
 * @returns An object with r, g, b values in the range [0, 255]
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace(/^#/, '')

  // Expand 3-digit hex to 6-digit
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
  }

  if (cleaned.length !== 6) {
    throw new Error(`Invalid hex color: "${hex}". Expected 3 or 6 hex characters.`)
  }

  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error(`Invalid hex color: "${hex}". Contains non-hex characters.`)
  }

  return { r, g, b }
}

/**
 * Computes the relative luminance of a color per WCAG 2.1.
 *
 * sRGB linearization:
 *   c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4
 *
 * Luminance:
 *   L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 *
 * @param hex - The hex color string (e.g., "#FF0000")
 * @returns The relative luminance value in the range [0, 1]
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)

  const linearize = (c: number): number => {
    const srgb = c / 255
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  }

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/**
 * Computes the WCAG contrast ratio between two colors.
 *
 * ratio = (L1 + 0.05) / (L2 + 0.05), where L1 >= L2
 *
 * The result ranges from 1:1 (identical colors) to 21:1 (black on white).
 *
 * @param foreground - The foreground hex color string
 * @param background - The background hex color string
 * @returns The contrast ratio (always >= 1)
 */
export function contrastRatio(foreground: string, background: string): number {
  const lum1 = relativeLuminance(foreground)
  const lum2 = relativeLuminance(background)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Checks whether a foreground/background color pair meets WCAG 2.1 AA contrast requirements.
 *
 * - Normal text (< 24px, or < 18.66px bold): requires >= 4.5:1
 * - Large text (>= 24px, or >= 18.66px bold) and non-text UI: requires >= 3:1
 *
 * @param foreground - The foreground hex color string
 * @param background - The background hex color string
 * @param isLargeText - Whether the text qualifies as "large" (default: false)
 * @returns true if the contrast ratio meets WCAG AA requirements
 */
export function meetsWcagAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
): boolean {
  const ratio = contrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Checks whether a foreground/background color pair meets WCAG 2.1 AAA contrast requirements.
 *
 * - Normal text (< 24px, or < 18.66px bold): requires >= 7:1
 * - Large text (>= 24px, or >= 18.66px bold): requires >= 4.5:1
 *
 * @param foreground - The foreground hex color string
 * @param background - The background hex color string
 * @param isLargeText - Whether the text qualifies as "large" (default: false)
 * @returns true if the contrast ratio meets WCAG AAA requirements
 */
export function meetsWcagAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
): boolean {
  const ratio = contrastRatio(foreground, background)
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}
