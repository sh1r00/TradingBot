import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
} from '~/utils/a11y'

describe('utils/a11y', () => {
  describe('hexToRgb', () => {
    it('parses 6-digit hex with # prefix', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('parses 6-digit hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('parses 3-digit hex shorthand', () => {
      expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('parses lowercase hex', () => {
      expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 })
    })

    it('parses black and white', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('throws on invalid hex length', () => {
      expect(() => hexToRgb('#FF00')).toThrow('Invalid hex color')
      expect(() => hexToRgb('#FF00000')).toThrow('Invalid hex color')
    })

    it('throws on invalid hex characters', () => {
      expect(() => hexToRgb('#GGGGGG')).toThrow('Invalid hex color')
    })
  })

  describe('relativeLuminance', () => {
    it('returns 0 for black', () => {
      expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    })

    it('returns 1 for white', () => {
      expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
    })

    it('returns correct luminance for pure red', () => {
      // R=1 linearized, L = 0.2126 * 1 = 0.2126
      expect(relativeLuminance('#FF0000')).toBeCloseTo(0.2126, 4)
    })

    it('returns correct luminance for pure green', () => {
      // G=1 linearized, L = 0.7152 * 1 = 0.7152
      expect(relativeLuminance('#00FF00')).toBeCloseTo(0.7152, 4)
    })

    it('returns correct luminance for pure blue', () => {
      // B=1 linearized, L = 0.0722 * 1 = 0.0722
      expect(relativeLuminance('#0000FF')).toBeCloseTo(0.0722, 4)
    })
  })

  describe('contrastRatio', () => {
    it('returns 21:1 for black on white', () => {
      expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
    })

    it('returns 21:1 for white on black (order independent)', () => {
      expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0)
    })

    it('returns 1:1 for identical colors', () => {
      expect(contrastRatio('#FF0000', '#FF0000')).toBeCloseTo(1, 5)
    })

    it('is always >= 1', () => {
      const ratio = contrastRatio('#777777', '#888888')
      expect(ratio).toBeGreaterThanOrEqual(1)
    })
  })

  describe('meetsWcagAA', () => {
    it('returns true for black on white (normal text)', () => {
      expect(meetsWcagAA('#000000', '#FFFFFF')).toBe(true)
    })

    it('returns true for black on white (large text)', () => {
      expect(meetsWcagAA('#000000', '#FFFFFF', true)).toBe(true)
    })

    it('returns false for low-contrast pair (normal text)', () => {
      // Light gray on white has low contrast
      expect(meetsWcagAA('#CCCCCC', '#FFFFFF')).toBe(false)
    })

    it('requires >= 4.5:1 for normal text', () => {
      // #767676 on white is approximately 4.54:1 (the famous minimum contrast gray)
      expect(meetsWcagAA('#767676', '#FFFFFF')).toBe(true)
    })

    it('requires >= 3:1 for large text', () => {
      // #959595 on white is approximately 3.0:1
      expect(meetsWcagAA('#949494', '#FFFFFF', true)).toBe(true)
    })
  })

  describe('meetsWcagAAA', () => {
    it('returns true for black on white (normal text)', () => {
      expect(meetsWcagAAA('#000000', '#FFFFFF')).toBe(true)
    })

    it('requires >= 7:1 for normal text', () => {
      // #595959 on white is approximately 7.0:1
      expect(meetsWcagAAA('#595959', '#FFFFFF')).toBe(true)
    })

    it('requires >= 4.5:1 for large text', () => {
      expect(meetsWcagAAA('#767676', '#FFFFFF', true)).toBe(true)
    })

    it('returns false when ratio is between 4.5 and 7 for normal text', () => {
      // #767676 on white is ~4.54:1, passes AA but fails AAA normal text
      expect(meetsWcagAAA('#767676', '#FFFFFF')).toBe(false)
    })
  })
})
