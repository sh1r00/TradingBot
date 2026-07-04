import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useAchievements } from '~/composables/useAchievements'
import { useEngagementStore } from '~/stores/engagement'

// Mock useToast composable
vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}))

// Mock vue-i18n useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('useAchievements', () => {
  let pinia: ReturnType<typeof createPinia>
  let engagementStore: ReturnType<typeof useEngagementStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    engagementStore = useEngagementStore()
    
    // Reset store state
    engagementStore.badges = []
    engagementStore.sharesCount = 0
    engagementStore.dailyCheckIns = 0
    engagementStore.lastVisit = null
  })

  it('returns required methods and state', () => {
    const achievements = useAchievements()
    
    expect(achievements.showingBadge).toBeDefined()
    expect(achievements.earnedBadges).toBeDefined()
    expect(achievements.unlockedGatedContent).toBeDefined()
    expect(achievements.awardBadge).toBeTypeOf('function')
    expect(achievements.checkAchievements).toBeTypeOf('function')
    expect(achievements.triggerShare).toBeTypeOf('function')
    expect(achievements.triggerDailyCheckIn).toBeTypeOf('function')
    expect(achievements.clearShowingBadge).toBeTypeOf('function')
    expect(achievements.getBadgeById).toBeTypeOf('function')
  })

  it('awards early_access badge on first visit', () => {
    const achievements = useAchievements()
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('early_access')
  })

  it('does not award duplicate badges', () => {
    const achievements = useAchievements()
    
    achievements.awardBadge('first_share')
    achievements.awardBadge('first_share')
    
    expect(engagementStore.badges.filter(b => b === 'first_share').length).toBe(1)
  })

  it('awards first_share badge when shares count >= 1', () => {
    const achievements = useAchievements()
    
    engagementStore.sharesCount = 1
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('first_share')
  })

  it('awards five_shares badge when shares count >= 5', () => {
    const achievements = useAchievements()
    
    engagementStore.sharesCount = 5
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('five_shares')
  })

  it('awards ten_shares badge when shares count >= 10', () => {
    const achievements = useAchievements()
    
    engagementStore.sharesCount = 10
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('ten_shares')
  })

  it('awards seven_day_streak badge when check-ins >= 7', () => {
    const achievements = useAchievements()
    
    engagementStore.dailyCheckIns = 7
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('seven_day_streak')
  })

  it('awards twenty_one_day_streak badge when check-ins >= 21', () => {
    const achievements = useAchievements()
    
    engagementStore.dailyCheckIns = 21
    
    achievements.checkAchievements()
    
    expect(engagementStore.badges).toContain('twenty_one_day_streak')
  })

  it('triggerShare increments shares count', () => {
    const achievements = useAchievements()
    
    achievements.triggerShare()
    
    expect(engagementStore.sharesCount).toBe(1)
  })

  it('triggerDailyCheckIn increments check-in count', () => {
    const achievements = useAchievements()
    
    achievements.triggerDailyCheckIn()
    
    expect(engagementStore.dailyCheckIns).toBe(1)
  })

  it('earnedBadges computed property returns earned badges with details', () => {
    const achievements = useAchievements()
    
    engagementStore.badges = ['first_share', 'five_shares']
    
    const badges = achievements.earnedBadges.value
    expect(badges).toHaveLength(2)
    expect(badges[0].id).toBe('first_share')
    expect(badges[1].id).toBe('five_shares')
  })

  it('unlockedGatedContent returns true when early_access badge is earned', () => {
    const achievements = useAchievements()
    
    engagementStore.badges = ['early_access']
    
    expect(achievements.unlockedGatedContent.value).toBe(true)
  })

  it('unlockedGatedContent returns false when early_access badge is not earned', () => {
    const achievements = useAchievements()
    
    expect(achievements.unlockedGatedContent.value).toBe(false)
  })

  it('clearShowingBadge clears the showingBadge state', () => {
    const achievements = useAchievements()
    
    achievements.showingBadge.value = 'first_share'
    achievements.clearShowingBadge()
    
    expect(achievements.showingBadge.value).toBeNull()
  })
})
