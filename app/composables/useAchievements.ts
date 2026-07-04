import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useEngagementStore } from '~/stores/engagement'

/**
 * Achievement badge composable.
 * Manages achievement badge logic, awards badges on milestones,
 * and announces achievements via Toast_System and aria-live regions.
 *
 * Requirements: 8.2, 8.3
 */
export function useAchievements() {
  const { t } = useI18n()
  const toast = useToast()
  const engagementStore = useEngagementStore()

  // Local state for badge animations
  const showingBadge = ref<string | null>(null)

  // Define badge configurations
  const achievementConfig = {
    firstShare: {
      id: 'first_share',
      titleKey: 'badge.firstShare',
      icon: 'share',
      descriptionKey: 'badge.firstShareDescription',
      milestone: (shares: number) => shares >= 1,
    },
    fiveShares: {
      id: 'five_shares',
      titleKey: 'badge.fiveShares',
      icon: 'group',
      descriptionKey: 'badge.fiveSharesDescription',
      milestone: (shares: number) => shares >= 5,
    },
    tenShares: {
      id: 'ten_shares',
      titleKey: 'badge.tenShares',
      icon: 'public',
      descriptionKey: 'badge.tenSharesDescription',
      milestone: (shares: number) => shares >= 10,
    },
    earlyAccess: {
      id: 'early_access',
      titleKey: 'badge.earlyAccess',
      icon: 'shield',
      descriptionKey: 'badge.earlyAccessDescription',
      milestone: () => true, // Awarded on first visit
    },
    sevenDayStreak: {
      id: 'seven_day_streak',
      titleKey: 'badge.sevenDayStreak',
      icon: 'fire',
      descriptionKey: 'badge.sevenDayStreakDescription',
      milestone: (checkIns: number) => checkIns >= 7,
    },
    twentyOneDayStreak: {
      id: 'twenty_one_day_streak',
      titleKey: 'badge.twentyOneDayStreak',
      icon: 'bolt',
      descriptionKey: 'badge.twentyOneDayStreakDescription',
      milestone: (checkIns: number) => checkIns >= 21,
    },
  }

  // Find badge config by ID (config is keyed by camelCase, IDs are snake_case)
  function getConfigById(badgeId: string) {
    return Object.values(achievementConfig).find((c) => c.id === badgeId) || null
  }

  // Award badge and announce via toast and aria-live
  function awardBadge(badgeId: string): void {
    if (engagementStore.badges.includes(badgeId)) {
      return
    }

    engagementStore.addBadge(badgeId)

    const badgeConfig = getConfigById(badgeId)
    if (badgeConfig) {
      showingBadge.value = badgeId
      // Show toast notification
      toast.success(t('viral.achievementEarned'))
    }
  }

  // Check and award badges based on current engagement state
  function checkAchievements(): void {
    // First visit - early access badge
    if (engagementStore.badges.length === 0) {
      awardBadge('early_access')
    }

    // Share-based badges
    if (!engagementStore.badges.includes('first_share') && engagementStore.sharesCount >= 1) {
      awardBadge('first_share')
    }

    if (!engagementStore.badges.includes('five_shares') && engagementStore.sharesCount >= 5) {
      awardBadge('five_shares')
    }

    if (!engagementStore.badges.includes('ten_shares') && engagementStore.sharesCount >= 10) {
      awardBadge('ten_shares')
    }

    // Check-in based badges
    if (!engagementStore.badges.includes('seven_day_streak') && engagementStore.dailyCheckIns >= 7) {
      awardBadge('seven_day_streak')
    }

    if (!engagementStore.badges.includes('twenty_one_day_streak') && engagementStore.dailyCheckIns >= 21) {
      awardBadge('twenty_one_day_streak')
    }
  }

  // Trigger share action and award first_share badge
  function triggerShare(): void {
    engagementStore.incrementShares()
    checkAchievements()
  }

  // Trigger daily check-in and award streak badges
  function triggerDailyCheckIn(): void {
    engagementStore.incrementDailyCheckIn()
    checkAchievements()
  }

  // Clear badge animation state
  function clearShowingBadge(): void {
    showingBadge.value = null
  }

  // Get badge details by ID
  function getBadgeById(badgeId: string) {
    return getConfigById(badgeId)
  }

  // Get all earned badges with their details
  const earnedBadges = computed(() => {
    return engagementStore.badges
      .map((id) => {
        const config = getConfigById(id)
        return {
          id,
          ...(config || { titleKey: '', icon: '' }),
        }
      })
      .filter((badge: any) => badge.titleKey !== '')
  })

  // Get unlocked gated content badges
  const unlockedGatedContent = computed(() => {
    return engagementStore.badges.includes('early_access')
  })

  return {
    // State
    showingBadge,
    earnedBadges,
    unlockedGatedContent,

    // Actions
    awardBadge,
    checkAchievements,
    triggerShare,
    triggerDailyCheckIn,
    clearShowingBadge,
    getBadgeById,
  }
}
