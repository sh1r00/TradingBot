import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'engagement'

/**
 * Engagement store.
 * Manages gamification-related state including badges,
 * daily check-ins, visit tracking, and user preferences.
 *
 * Requirements: 8.2, 9.2, 9.3
 */
export const useEngagementStore = defineStore('engagement', () => {
  const badges = ref<string[]>([])
  const lastVisit = ref<string | null>(null)
  const dailyCheckIns = ref<number>(0)
  const sharesCount = ref<number>(0)
  const installPromptDismissed = ref<boolean>(false)
  const preferredLocale = ref<'en' | 'es' | 'am'>('en')

  function initialize(): void {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        badges.value = parsed.badges || []
        lastVisit.value = parsed.lastVisit || null
        dailyCheckIns.value = parsed.dailyCheckIns || 0
        sharesCount.value = parsed.sharesCount || 0
        installPromptDismissed.value = parsed.installPromptDismissed || false
        preferredLocale.value = parsed.preferredLocale || 'en'
      } catch {
        // If parsing fails, use defaults
      }
    }
  }

  function persist(): void {
    const data = {
      badges: badges.value,
      lastVisit: lastVisit.value,
      dailyCheckIns: dailyCheckIns.value,
      sharesCount: sharesCount.value,
      installPromptDismissed: installPromptDismissed.value,
      preferredLocale: preferredLocale.value,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function markVisit(): void {
    lastVisit.value = new Date().toISOString()
    persist()
  }

  function incrementDailyCheckIn(): void {
    dailyCheckIns.value += 1
    persist()
  }

  function incrementShares(): void {
    sharesCount.value += 1
    persist()
  }

  function addBadge(badgeId: string): void {
    if (!badges.value.includes(badgeId)) {
      badges.value.push(badgeId)
      persist()
    }
  }

  function removeBadge(badgeId: string): void {
    badges.value = badges.value.filter((id) => id !== badgeId)
    persist()
  }

  function setInstallPromptDismissed(dismissed: boolean): void {
    installPromptDismissed.value = dismissed
    persist()
  }

  function setPreferredLocale(locale: 'en' | 'es' | 'am'): void {
    preferredLocale.value = locale
    persist()
  }

  return {
    badges,
    lastVisit,
    dailyCheckIns,
    sharesCount,
    installPromptDismissed,
    preferredLocale,
    initialize,
    persist,
    markVisit,
    incrementDailyCheckIn,
    incrementShares,
    addBadge,
    removeBadge,
    setInstallPromptDismissed,
    setPreferredLocale,
  }
})
