import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { setActivePinia, createPinia } from 'pinia'
import OExclusiveAccess from '~/components/organisms/OExclusiveAccess.vue'

// Mock composables
const unlockedRef = ref(false)
vi.mock('~/composables/useAchievements', () => ({
  useAchievements: () => ({
    unlockedGatedContent: unlockedRef,
    triggerShare: vi.fn(),
  }),
}))

vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}))

// Mock auth store
vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    currentUser: null,
    initialize: vi.fn(),
  }),
}))

// Mock components
vi.mock('~/components/atoms/AIcon.vue', () => ({
  default: {
    name: 'AIcon',
    props: ['name', 'size', 'decorative', 'ariaHidden'],
    template: '<span class="mock-icon" />',
  },
}))

vi.mock('~/components/atoms/AButton.vue', () => ({
  default: {
    name: 'AButton',
    props: ['variant', 'type', 'disabled'],
    template: '<button class="mock-button"><slot /></button>',
  },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      exclusive: {
        title: 'Exclusive Members Area',
        locked: 'Complete a daily check-in streak to unlock exclusive content.',
        unlock: 'Start Your Streak',
        unlocked: 'Exclusive Content Unlocked',
        content: 'Welcome to the exclusive members area.',
        shareToUnlock: 'Share with friends to unlock premium content',
        unlockedMessage: 'You have unlocked exclusive content!',
      },
    },
  },
})

describe('OExclusiveAccess', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    unlockedRef.value = false
  })

  it('renders the exclusive access section heading', () => {
    const wrapper = mount(OExclusiveAccess, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Exclusive Members Area')
  })

  it('shows locked state when content is locked', () => {
    unlockedRef.value = false
    const wrapper = mount(OExclusiveAccess, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Complete a daily check-in streak')
    // When not authenticated, renders a NuxtLink (not AButton)
    expect(wrapper.text()).toContain('Start Your Streak')
    expect(wrapper.text()).toContain('Sign in')
  })

  it('shows unlocked state when content is unlocked', () => {
    unlockedRef.value = true
    const wrapper = mount(OExclusiveAccess, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Exclusive Content Unlocked')
    expect(wrapper.text()).toContain('Welcome to the exclusive members area')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(OExclusiveAccess, {
      global: { plugins: [i18n] },
    })
    const section = wrapper.find('[aria-labelledby="exclusive-heading"]')
    expect(section.exists()).toBe(true)
    const heading = wrapper.find('#exclusive-heading')
    expect(heading.exists()).toBe(true)
  })
})
