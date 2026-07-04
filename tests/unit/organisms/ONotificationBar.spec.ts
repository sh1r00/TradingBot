import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import ONotificationBar from '~/components/organisms/ONotificationBar.vue'
import { useEngagementStore } from '~/stores/engagement'

// Mock useEngagementStore
vi.mock('~/stores/engagement', () => ({
  useEngagementStore: vi.fn(),
}))

// Mock AIcon component
vi.mock('~/components/atoms/AIcon.vue', () => ({
  default: {
    name: 'AIcon',
    props: ['name', 'size', 'decorative'],
    template: '<span class="mock-icon" />',
  },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      notification: {
        morning: 'Good morning',
        evening: 'Good evening',
        weekend: 'Happy weekend',
        weekday: 'Happy weekday',
        welcomeFirst: 'Welcome!',
        welcomeBack: 'Welcome back, {activity}',
        activityNow: 'recently',
        activityHour: '{count} hour ago',
        activityHours: '{count} hours ago',
        activityDay: '{count} day ago',
        activityDays: '{count} days ago',
      },
    },
  },
})

describe('ONotificationBar', () => {
  let engagementStore: any

  beforeEach(() => {
    engagementStore = {
      lastVisit: null,
    }
    ;(useEngagementStore as any).mockReturnValue(engagementStore)
  })

  it('renders notification bar correctly', async () => {
    const wrapper = mount(ONotificationBar, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('aria-live')).toBe('assertive')
    expect(wrapper.attributes('aria-atomic')).toBe('true')
  })

  describe('time-based messages', () => {
    const setTimeAndDay = (hour: number, dayOfWeek: number) => {
      vi.spyOn(Date.prototype, 'getHours').mockReturnValue(hour)
      vi.spyOn(Date.prototype, 'getDay').mockReturnValue(dayOfWeek)
    }

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('shows morning message at 8 AM on weekday', () => {
      setTimeAndDay(8, 1) // Monday 8 AM
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Good morning')
    })

    it('shows evening message at 7 PM on weekday', () => {
      setTimeAndDay(19, 1) // Monday 7 PM
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Good evening')
    })

    it('shows weekend message on Saturday', () => {
      setTimeAndDay(10, 6) // Saturday 10 AM
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Happy weekend')
    })

    it('shows weekend message on Sunday', () => {
      setTimeAndDay(10, 0) // Sunday 10 AM
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Happy weekend')
    })

    it('shows weekday message at 3 PM', () => {
      setTimeAndDay(15, 3) // Wednesday 3 PM
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Happy weekday')
    })
  })

  describe('personalized welcome-back message', () => {
    it('shows welcome first message when no last visit', () => {
      engagementStore.lastVisit = null
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Welcome!')
    })

    it('shows welcome back message with last activity when last visit exists', () => {
      engagementStore.lastVisit = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      
      expect(wrapper.text()).toContain('Welcome back')
    })

    it('hides welcome message when showWelcomeBack is false', () => {
      engagementStore.lastVisit = new Date().toISOString()
      const wrapper = mount(ONotificationBar, {
        props: { showWelcomeBack: false },
        global: { plugins: [i18n] },
      })
      
      const activityMsg = wrapper.find('.text-sm')
      expect(activityMsg.text()).toBe('')
    })
  })

  describe('ARIA attributes', () => {
    it('has role="alert" for notification bar', () => {
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      expect(wrapper.attributes('role')).toBe('alert')
    })

    it('has aria-live="assertive" for screen reader announcement', () => {
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      expect(wrapper.attributes('aria-live')).toBe('assertive')
    })

    it('has aria-atomic="true" for complete message announcement', () => {
      const wrapper = mount(ONotificationBar, {
        global: { plugins: [i18n] },
      })
      expect(wrapper.attributes('aria-atomic')).toBe('true')
    })
  })

  it('displays appropriate icon based on notification type', () => {
    const wrapper = mount(ONotificationBar, {
      global: { plugins: [i18n] },
    })
    
    const icons = wrapper.findAll('.mock-icon')
    expect(icons.length).toBeGreaterThan(0)
  })
})
