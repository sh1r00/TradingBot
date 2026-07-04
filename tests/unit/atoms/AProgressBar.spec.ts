import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AProgressBar from '~/components/atoms/AProgressBar.vue'

describe('AProgressBar', () => {
  const defaultProps = { value: 50, ariaLabel: 'Upload progress' }

  describe('role="progressbar"', () => {
    it('renders with role="progressbar"', () => {
      const wrapper = mount(AProgressBar, { props: defaultProps })
      expect(wrapper.attributes('role')).toBe('progressbar')
    })
  })

  describe('aria-valuenow/min/max', () => {
    it('sets aria-valuenow from value prop', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: 75 } })
      expect(wrapper.attributes('aria-valuenow')).toBe('75')
    })

    it('sets aria-valuemin to 0 by default', () => {
      const wrapper = mount(AProgressBar, { props: defaultProps })
      expect(wrapper.attributes('aria-valuemin')).toBe('0')
    })

    it('sets aria-valuemax to 100 by default', () => {
      const wrapper = mount(AProgressBar, { props: defaultProps })
      expect(wrapper.attributes('aria-valuemax')).toBe('100')
    })

    it('sets custom min and max values', () => {
      const wrapper = mount(AProgressBar, {
        props: { ...defaultProps, min: 10, max: 200 },
      })
      expect(wrapper.attributes('aria-valuemin')).toBe('10')
      expect(wrapper.attributes('aria-valuemax')).toBe('200')
    })

    it('sets aria-label from prop', () => {
      const wrapper = mount(AProgressBar, { props: defaultProps })
      expect(wrapper.attributes('aria-label')).toBe('Upload progress')
    })
  })

  describe('percentage calculation', () => {
    it('calculates 50% width for value 50 with default min/max', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: 50 } })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 50%')
    })

    it('calculates 0% width for value at min', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: 0 } })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 0%')
    })

    it('calculates 100% width for value at max', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: 100 } })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 100%')
    })

    it('clamps value below min to 0%', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: -10 } })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 0%')
    })

    it('clamps value above max to 100%', () => {
      const wrapper = mount(AProgressBar, { props: { ...defaultProps, value: 150 } })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 100%')
    })

    it('calculates percentage correctly with custom range', () => {
      const wrapper = mount(AProgressBar, {
        props: { ...defaultProps, value: 30, min: 20, max: 40 },
      })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 50%')
    })

    it('returns 0% when range is zero (max equals min)', () => {
      const wrapper = mount(AProgressBar, {
        props: { ...defaultProps, value: 50, min: 50, max: 50 },
      })
      const bar = wrapper.find('[aria-hidden="true"]')
      expect(bar.attributes('style')).toContain('width: 0%')
    })
  })
})
