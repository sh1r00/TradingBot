// Feature: money-conversion-spa, Property 17: Image Alt Text Compliance
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { mount } from '@vue/test-utils'
import AImage from '~/components/atoms/AImage.vue'

/**
 * Validates: Requirements 16.10
 *
 * Property 17: Image Alt Text Compliance
 * For any AImage component render, if the image is informational (decorative=false),
 * the alt attribute shall contain non-empty descriptive text. If the image is decorative
 * (decorative=true), the alt attribute shall be exactly "" or role="presentation" shall be present.
 */

// --- fast-check Arbitraries ---

/**
 * Arbitrary for non-empty alt text strings (informational images).
 * Generates strings with at least 1 visible character.
 */
const nonEmptyAltArb = fc
  .string({ minLength: 1, maxLength: 200 })
  .filter((s) => s.trim().length > 0)

/**
 * Arbitrary for valid image src URLs.
 */
const srcArb = fc
  .webUrl()
  .map((url) => `${url}/image.png`)

// --- Property Tests ---

describe('Property 17: Image Alt Text Compliance', () => {
  it('informational images (decorative=false) have non-empty alt text', () => {
    fc.assert(
      fc.property(nonEmptyAltArb, srcArb, (alt, src) => {
        const wrapper = mount(AImage, {
          props: {
            src,
            alt,
            decorative: false,
          },
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)

        const altAttr = img.attributes('alt')
        expect(altAttr).toBeDefined()
        expect(altAttr!.length).toBeGreaterThan(0)
        expect(altAttr).toBe(alt)
      }),
    )
  })

  it('decorative images (decorative=true) have alt="" or role="presentation"', () => {
    fc.assert(
      fc.property(srcArb, (src) => {
        const wrapper = mount(AImage, {
          props: {
            src,
            decorative: true,
          },
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)

        const altAttr = img.attributes('alt')
        const roleAttr = img.attributes('role')

        // Either alt is exactly "" OR role is "presentation"
        const hasEmptyAlt = altAttr === ''
        const hasPresentation = roleAttr === 'presentation'
        expect(
          hasEmptyAlt || hasPresentation,
          `Decorative image must have alt="" or role="presentation". Got alt="${altAttr}", role="${roleAttr}"`,
        ).toBe(true)
      }),
    )
  })

  it('decorative images (decorative=true) have aria-hidden set', () => {
    fc.assert(
      fc.property(srcArb, (src) => {
        const wrapper = mount(AImage, {
          props: {
            src,
            decorative: true,
          },
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)

        // aria-hidden should be present and truthy for decorative images
        const ariaHidden = img.attributes('aria-hidden')
        expect(
          ariaHidden === 'true' || ariaHidden === '',
          `Decorative image must have aria-hidden set. Got aria-hidden="${ariaHidden}"`,
        ).toBe(true)
      }),
    )
  })

  it('informational images do NOT have aria-hidden set', () => {
    fc.assert(
      fc.property(nonEmptyAltArb, srcArb, (alt, src) => {
        const wrapper = mount(AImage, {
          props: {
            src,
            alt,
            decorative: false,
          },
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)

        // aria-hidden should NOT be set for informational images
        const ariaHidden = img.attributes('aria-hidden')
        expect(
          ariaHidden === undefined || ariaHidden === 'false',
          `Informational image must not have aria-hidden. Got aria-hidden="${ariaHidden}"`,
        ).toBe(true)
      }),
    )
  })

  it('informational images do NOT have role="presentation"', () => {
    fc.assert(
      fc.property(nonEmptyAltArb, srcArb, (alt, src) => {
        const wrapper = mount(AImage, {
          props: {
            src,
            alt,
            decorative: false,
          },
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)

        const roleAttr = img.attributes('role')
        expect(
          roleAttr !== 'presentation',
          `Informational image must not have role="presentation". Got role="${roleAttr}"`,
        ).toBe(true)
      }),
    )
  })
})
