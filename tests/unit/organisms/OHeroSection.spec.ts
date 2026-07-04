import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import OHeroSection from '~/components/organisms/OHeroSection.vue'
import AButton from '~/components/atoms/AButton.vue'

// Mock i18n
const createI18nMock = () => {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        hero: {
          title: 'Your Path to Financial Freedom Starts Here',
          subtitle: 'Curated, vetted money-making resources and tools — all in one place.',
          cta: 'Explore Resources',
          ctaSecondary: 'Calculate Your Income',
          socialProof: 'Join thousands already growing their income',
        },
      },
    },
  })
}

describe('OHeroSection', () => {
  it('renders the hero title from i18n', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    expect(wrapper.get('#hero-title').text()).toBe('Your Path to Financial Freedom Starts Here')
  })

  it('renders the hero subtitle from i18n', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    expect(wrapper.get('.text-on-surface-variant').text()).toBe(
      'Curated, vetted money-making resources and tools — all in one place.'
    )
  })

  it('renders the social proof text from i18n', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    const socialProof = wrapper.get('[role="status"]')
    expect(socialProof.text()).toBe('Join thousands already growing their income')
    expect(socialProof.attributes('aria-live')).toBe('polite')
  })

  it('renders two CTA buttons', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)

    expect(buttons[0].text()).toBe('Explore Resources')
    expect(buttons[1].text()).toBe('Calculate Your Income')
  })

  it('applies reduced motion class when prefers-reduced-motion is set', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    // Check that motion-safe:transition-colors is present
    expect(wrapper.classes()).toContain('motion-safe:transition-colors')
    // Check that motion-safe:duration-500 is present
    expect(wrapper.classes()).toContain('motion-safe:duration-500')
  })

  it('has correct semantic HTML structure', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    // Check section element
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('aria-labelledby')).toBe('hero-title')

    // Check h1 heading
    expect(wrapper.get('#hero-title').element.tagName).toBe('H1')
    expect(wrapper.get('#hero-title').attributes('id')).toBe('hero-title')
  })

  it('renders responsive layout classes', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    // Check container classes
    expect(wrapper.classes()).toContain('py-20')
    expect(wrapper.classes()).toContain('px-4')

    // Check max-width container
    expect(wrapper.get('.max-w-4xl').exists()).toBe(true)
  })

  it('has accessible button classes with focus indicators', () => {
    const i18n = createI18nMock()
    const wrapper = mount(OHeroSection, {
      global: {
        plugins: [i18n],
        components: {
          AButton,
        },
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('min-w-48')
    expect(buttons[1].classes()).toContain('min-w-48')
  })
})
