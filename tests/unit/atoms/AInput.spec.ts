import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AInput from '~/components/atoms/AInput.vue'

describe('AInput', () => {
  describe('input types', () => {
    it('defaults to text type', () => {
      const wrapper = mount(AInput)
      expect(wrapper.attributes('type')).toBe('text')
    })

    it('renders email type', () => {
      const wrapper = mount(AInput, { props: { type: 'email' } })
      expect(wrapper.attributes('type')).toBe('email')
    })

    it('renders password type', () => {
      const wrapper = mount(AInput, { props: { type: 'password' } })
      expect(wrapper.attributes('type')).toBe('password')
    })

    it('renders number type', () => {
      const wrapper = mount(AInput, { props: { type: 'number' } })
      expect(wrapper.attributes('type')).toBe('number')
    })

    it('renders url type', () => {
      const wrapper = mount(AInput, { props: { type: 'url' } })
      expect(wrapper.attributes('type')).toBe('url')
    })

    it('renders tel type', () => {
      const wrapper = mount(AInput, { props: { type: 'tel' } })
      expect(wrapper.attributes('type')).toBe('tel')
    })

    it('renders search type', () => {
      const wrapper = mount(AInput, { props: { type: 'search' } })
      expect(wrapper.attributes('type')).toBe('search')
    })
  })

  describe('aria-invalid', () => {
    it('sets aria-invalid when true', () => {
      const wrapper = mount(AInput, { props: { ariaInvalid: true } })
      expect(wrapper.attributes('aria-invalid')).toBe('true')
    })

    it('does not set aria-invalid when false', () => {
      const wrapper = mount(AInput, { props: { ariaInvalid: false } })
      expect(wrapper.attributes('aria-invalid')).toBeUndefined()
    })

    it('applies error border classes when aria-invalid is true', () => {
      const wrapper = mount(AInput, { props: { ariaInvalid: true } })
      expect(wrapper.classes()).toContain('border-error')
    })
  })

  describe('aria-describedby', () => {
    it('sets aria-describedby when provided', () => {
      const wrapper = mount(AInput, { props: { ariaDescribedby: 'help-text-1' } })
      expect(wrapper.attributes('aria-describedby')).toBe('help-text-1')
    })

    it('does not set aria-describedby when not provided', () => {
      const wrapper = mount(AInput)
      expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    })
  })

  describe('aria-errormessage', () => {
    it('sets aria-errormessage when provided', () => {
      const wrapper = mount(AInput, { props: { ariaErrormessage: 'error-msg-1' } })
      expect(wrapper.attributes('aria-errormessage')).toBe('error-msg-1')
    })

    it('does not set aria-errormessage when not provided', () => {
      const wrapper = mount(AInput)
      expect(wrapper.attributes('aria-errormessage')).toBeUndefined()
    })
  })

  describe('event emission', () => {
    it('emits update:modelValue on input', async () => {
      const wrapper = mount(AInput, { props: { modelValue: '' } })
      const input = wrapper.find('input')
      await input.setValue('hello')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello'])
    })

    it('emits focus event', async () => {
      const wrapper = mount(AInput)
      await wrapper.trigger('focus')
      expect(wrapper.emitted('focus')).toHaveLength(1)
    })

    it('emits blur event', async () => {
      const wrapper = mount(AInput)
      await wrapper.trigger('blur')
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })

  describe('disabled state', () => {
    it('sets disabled attribute when disabled', () => {
      const wrapper = mount(AInput, { props: { disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('does not set disabled attribute when enabled', () => {
      const wrapper = mount(AInput, { props: { disabled: false } })
      expect(wrapper.attributes('disabled')).toBeUndefined()
    })
  })

  describe('required state', () => {
    it('sets required attribute when required', () => {
      const wrapper = mount(AInput, { props: { required: true } })
      expect(wrapper.attributes('required')).toBeDefined()
    })

    it('sets aria-required when required', () => {
      const wrapper = mount(AInput, { props: { required: true } })
      expect(wrapper.attributes('aria-required')).toBe('true')
    })
  })

  describe('props to DOM', () => {
    it('renders placeholder', () => {
      const wrapper = mount(AInput, { props: { placeholder: 'Enter text' } })
      expect(wrapper.attributes('placeholder')).toBe('Enter text')
    })

    it('renders id attribute', () => {
      const wrapper = mount(AInput, { props: { id: 'my-input' } })
      expect(wrapper.attributes('id')).toBe('my-input')
    })

    it('renders value from modelValue', () => {
      const wrapper = mount(AInput, { props: { modelValue: 'test value' } })
      expect((wrapper.element as HTMLInputElement).value).toBe('test value')
    })
  })
})
