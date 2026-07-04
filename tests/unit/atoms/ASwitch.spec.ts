import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ASwitch from '~/components/atoms/ASwitch.vue'

describe('ASwitch', () => {
  const defaultProps = { modelValue: false, ariaLabel: 'Toggle feature' }

  describe('role="switch"', () => {
    it('renders with role="switch"', () => {
      const wrapper = mount(ASwitch, { props: defaultProps })
      expect(wrapper.attributes('role')).toBe('switch')
    })
  })

  describe('aria-checked', () => {
    it('sets aria-checked to false when off', () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, modelValue: false } })
      expect(wrapper.attributes('aria-checked')).toBe('false')
    })

    it('sets aria-checked to true when on', () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, modelValue: true } })
      expect(wrapper.attributes('aria-checked')).toBe('true')
    })
  })

  describe('aria-label', () => {
    it('sets aria-label from prop', () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, ariaLabel: 'Dark mode' } })
      expect(wrapper.attributes('aria-label')).toBe('Dark mode')
    })
  })

  describe('toggle emission', () => {
    it('emits update:modelValue with true when toggled on', async () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, modelValue: false } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    })

    it('emits update:modelValue with false when toggled off', async () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, modelValue: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  describe('disabled state', () => {
    it('sets disabled attribute when disabled', () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('does not emit when clicked while disabled', async () => {
      const wrapper = mount(ASwitch, { props: { ...defaultProps, disabled: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('does not set disabled attribute when enabled', () => {
      const wrapper = mount(ASwitch, { props: defaultProps })
      expect(wrapper.attributes('disabled')).toBeUndefined()
    })
  })

  describe('button type', () => {
    it('renders as a button element', () => {
      const wrapper = mount(ASwitch, { props: defaultProps })
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('has type="button" to prevent form submission', () => {
      const wrapper = mount(ASwitch, { props: defaultProps })
      expect(wrapper.attributes('type')).toBe('button')
    })
  })
})
