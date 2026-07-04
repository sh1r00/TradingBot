import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AButton from '~/components/atoms/AButton.vue'

describe('AButton', () => {
  describe('variants', () => {
    it('renders filled variant by default', () => {
      const wrapper = mount(AButton)
      expect(wrapper.classes()).toContain('bg-primary')
    })

    it('renders outlined variant with border', () => {
      const wrapper = mount(AButton, { props: { variant: 'outlined' } })
      expect(wrapper.classes()).toContain('border')
    })

    it('renders text variant without background', () => {
      const wrapper = mount(AButton, { props: { variant: 'text' } })
      expect(wrapper.classes()).not.toContain('bg-primary')
      expect(wrapper.classes()).not.toContain('border')
    })

    it('renders tonal variant with secondary-container background', () => {
      const wrapper = mount(AButton, { props: { variant: 'tonal' } })
      expect(wrapper.classes()).toContain('bg-secondary-container')
    })
  })

  describe('disabled state', () => {
    it('sets disabled attribute when disabled prop is true', () => {
      const wrapper = mount(AButton, { props: { disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(AButton, { props: { disabled: true } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not set aria-disabled when enabled', () => {
      const wrapper = mount(AButton, { props: { disabled: false } })
      expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    })
  })

  describe('aria attributes', () => {
    it('sets aria-label when provided', () => {
      const wrapper = mount(AButton, { props: { ariaLabel: 'Submit form' } })
      expect(wrapper.attributes('aria-label')).toBe('Submit form')
    })

    it('does not set aria-label when not provided', () => {
      const wrapper = mount(AButton)
      expect(wrapper.attributes('aria-label')).toBeUndefined()
    })

    it('sets aria-busy when loading', () => {
      const wrapper = mount(AButton, { props: { loading: true } })
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })

    it('does not set aria-busy when not loading', () => {
      const wrapper = mount(AButton, { props: { loading: false } })
      expect(wrapper.attributes('aria-busy')).toBeUndefined()
    })
  })

  describe('event emission', () => {
    it('is a native button element that can receive clicks', async () => {
      const wrapper = mount(AButton)
      expect(wrapper.element.tagName).toBe('BUTTON')
      // Button is not disabled, so it can be clicked
      expect(wrapper.attributes('disabled')).toBeUndefined()
    })

    it('disabled button prevents interaction via pointer-events-none', () => {
      const wrapper = mount(AButton, { props: { disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('disabled:pointer-events-none')
    })
  })

  describe('type attribute', () => {
    it('defaults to button type', () => {
      const wrapper = mount(AButton)
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('sets submit type when specified', () => {
      const wrapper = mount(AButton, { props: { type: 'submit' } })
      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('sets reset type when specified', () => {
      const wrapper = mount(AButton, { props: { type: 'reset' } })
      expect(wrapper.attributes('type')).toBe('reset')
    })
  })

  describe('slots', () => {
    it('renders default slot content', () => {
      const wrapper = mount(AButton, { slots: { default: 'Click me' } })
      expect(wrapper.text()).toContain('Click me')
    })
  })
})
