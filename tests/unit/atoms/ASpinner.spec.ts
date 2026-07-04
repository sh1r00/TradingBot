import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ASpinner from '~/components/atoms/ASpinner.vue'

describe('ASpinner', () => {
  describe('role="status"', () => {
    it('renders with role="status"', () => {
      const wrapper = mount(ASpinner)
      expect(wrapper.attributes('role')).toBe('status')
    })
  })

  describe('aria-label', () => {
    it('defaults aria-label to "Loading"', () => {
      const wrapper = mount(ASpinner)
      expect(wrapper.attributes('aria-label')).toBe('Loading')
    })

    it('sets custom aria-label from prop', () => {
      const wrapper = mount(ASpinner, { props: { ariaLabel: 'Processing data' } })
      expect(wrapper.attributes('aria-label')).toBe('Processing data')
    })

    it('renders aria-label as sr-only text for screen readers', () => {
      const wrapper = mount(ASpinner, { props: { ariaLabel: 'Saving' } })
      const srOnly = wrapper.find('.sr-only')
      expect(srOnly.exists()).toBe(true)
      expect(srOnly.text()).toBe('Saving')
    })
  })

  describe('svg accessibility', () => {
    it('hides svg from assistive technology with aria-hidden', () => {
      const wrapper = mount(ASpinner)
      const svg = wrapper.find('svg')
      expect(svg.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('size variants', () => {
    it('renders medium size by default', () => {
      const wrapper = mount(ASpinner)
      expect(wrapper.classes()).toContain('w-6')
      expect(wrapper.classes()).toContain('h-6')
    })

    it('renders small size', () => {
      const wrapper = mount(ASpinner, { props: { size: 'sm' } })
      expect(wrapper.classes()).toContain('w-4')
      expect(wrapper.classes()).toContain('h-4')
    })

    it('renders large size', () => {
      const wrapper = mount(ASpinner, { props: { size: 'lg' } })
      expect(wrapper.classes()).toContain('w-8')
      expect(wrapper.classes()).toContain('h-8')
    })
  })
})
