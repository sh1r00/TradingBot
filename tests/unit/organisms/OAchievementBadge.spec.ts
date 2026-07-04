import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import OAchievementBadge from '~/components/organisms/OAchievementBadge.vue'

// Shared refs so tests can manipulate state
const showingBadgeRef = ref(null)
const earnedBadgesRef = ref([])

vi.mock('~/composables/useAchievements', () => ({
  useAchievements: () => ({
    showingBadge: showingBadgeRef,
    earnedBadges: earnedBadgesRef,
    unlockedGatedContent: ref(false),
    awardBadge: vi.fn(),
    checkAchievements: vi.fn(),
    triggerShare: vi.fn(),
    triggerDailyCheckIn: vi.fn(),
    clearShowingBadge: vi.fn(),
    getBadgeById: vi.fn(),
  }),
}))

vi.mock('~/components/molecules/MAchievementBadge.vue', () => ({
  default: {
    name: 'MAchievementBadge',
    props: ['title', 'icon', 'earned'],
    template: '<div class="mock-achievement-badge" :data-earned="earned" />',
  },
}))

vi.mock('~/components/atoms/AProgressBar.vue', () => ({
  default: {
    name: 'AProgressBar',
    props: ['value', 'max'],
    template: '<div class="mock-progress-bar" />',
  },
}))

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
      viral: { achievementEarned: 'Achievement Earned!' },
      badge: {
        firstShare: 'First Share',
        fiveShares: 'Social Connector',
        tenShares: 'Viral Advocate',
        earlyAccess: 'Early Adopter',
        sevenDayStreak: 'Seven Day Streak',
        twentyOneDayStreak: 'Twenty-One Day Streak',
        gatedTitle: 'Premium Content',
        earnedCount: '{count} badges earned',
      },
    },
  },
})

describe('OAchievementBadge', () => {
  beforeEach(() => {
    showingBadgeRef.value = null
    earnedBadgesRef.value = []
  })

  it('renders the achievements heading', () => {
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Premium Content')
  })

  it('renders all 6 badge components', () => {
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.findAllComponents({ name: 'MAchievementBadge' })).toHaveLength(6)
  })

  it('shows all badges as locked when none earned', () => {
    earnedBadgesRef.value = []
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    const badges = wrapper.findAll('.mock-achievement-badge')
    badges.forEach(badge => {
      expect(badge.attributes('data-earned')).toBe('false')
    })
  })

  it('marks earned badges correctly', () => {
    earnedBadgesRef.value = [
      { id: 'first_share', titleKey: 'badge.firstShare', icon: 'share' },
      { id: 'early_access', titleKey: 'badge.earlyAccess', icon: 'shield' },
    ]
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    const badges = wrapper.findAll('.mock-achievement-badge')
    expect(badges).toHaveLength(6)
    // First badge (first_share) should be earned
    expect(badges[0].attributes('data-earned')).toBe('true')
  })

  it('shows progress bar', () => {
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.findComponent({ name: 'AProgressBar' }).exists()).toBe(true)
  })

  it('shows notification when badge is newly earned', () => {
    showingBadgeRef.value = 'first_share'
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('Achievement Earned!')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(OAchievementBadge, {
      global: { plugins: [i18n] },
    })
    const heading = wrapper.find('#achievements-heading')
    expect(heading.exists()).toBe(true)
  })
})
