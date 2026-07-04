import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AImage from '~/components/atoms/AImage.vue'

describe('AImage', () => {
  describe('decorative images (alt="")', () => {
    it('sets alt to empty string when decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', decorative: true } })
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('')
    })

    it('sets role="presentation" when decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', decorative: true } })
      const img = wrapper.find('img')
      expect(img.attributes('role')).toBe('presentation')
    })

    it('sets aria-hidden when decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', decorative: true } })
      const img = wrapper.find('img')
      expect(img.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('informational images (alt text)', () => {
    it('renders alt text when not decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', alt: 'A cat' } })
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('A cat')
    })

    it('does not set role="presentation" when not decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', alt: 'A cat' } })
      const img = wrapper.find('img')
      expect(img.attributes('role')).toBeUndefined()
    })

    it('does not set aria-hidden when not decorative', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', alt: 'A cat' } })
      const img = wrapper.find('img')
      expect(img.attributes('aria-hidden')).toBeUndefined()
    })
  })

  describe('lazy loading', () => {
    it('sets loading="lazy" by default', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png' } })
      const img = wrapper.find('img')
      expect(img.attributes('loading')).toBe('lazy')
    })

    it('does not set loading attribute when lazy is false', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', lazy: false } })
      const img = wrapper.find('img')
      expect(img.attributes('loading')).toBeUndefined()
    })
  })

  describe('error state / fallback', () => {
    it('renders img when error is false', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png' } })
      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('renders fallback div when error is true', () => {
      const wrapper = mount(AImage, { props: { src: '/img.png', error: true } })
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('fallback has role="img" for informational images', () => {
      const wrapper = mount(AImage, {
        props: { src: '/img.png', error: true, alt: 'Photo of a dog' },
      })
      const fallback = wrapper.find('div')
      expect(fallback.attributes('role')).toBe('img')
    })

    it('fallback has aria-label matching alt text', () => {
      const wrapper = mount(AImage, {
        props: { src: '/img.png', error: true, alt: 'Photo of a dog' },
      })
      const fallback = wrapper.find('div')
      expect(fallback.attributes('aria-label')).toBe('Photo of a dog')
    })

    it('fallback has role="presentation" for decorative images', () => {
      const wrapper = mount(AImage, {
        props: { src: '/img.png', error: true, decorative: true },
      })
      const fallback = wrapper.find('div')
      expect(fallback.attributes('role')).toBe('presentation')
    })

    it('fallback has aria-hidden for decorative images', () => {
      const wrapper = mount(AImage, {
        props: { src: '/img.png', error: true, decorative: true },
      })
      const fallback = wrapper.find('div')
      expect(fallback.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('dimensions', () => {
    it('sets width and height attributes', () => {
      const wrapper = mount(AImage, {
        props: { src: '/img.png', width: 200, height: 150 },
      })
      const img = wrapper.find('img')
      expect(img.attributes('width')).toBe('200')
      expect(img.attributes('height')).toBe('150')
    })
  })

  describe('event emission', () => {
    it('emits error event on image load failure', async () => {
      const wrapper = mount(AImage, { props: { src: '/broken.png' } })
      const img = wrapper.find('img')
      await img.trigger('error')
      expect(wrapper.emitted('error')).toHaveLength(1)
    })
  })
})
