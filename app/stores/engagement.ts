import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'engagement'

/**
 * Engagement store.
 * Tracks visit history, install-prompt dismissal, and locale preference.
 *
 * Note: gamification (daily check-ins, badges, share-counts) was removed —
 * it offered no real value to the user. Visit tracking remains so the
 * notification bar can show an honest "welcome back" greeting.
 */
export const useEngagementStore = defineStore('engagement', () => {
  const lastVisit = ref<string | null>(null)
  const installPromptDismissed = ref<boolean>(false)
  const preferredLocale = ref<'en' | 'es' | 'am'>('en')

  function initialize(): void {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        lastVisit.value = parsed.lastVisit || null
        installPromptDismissed.value = parsed.installPromptDismissed || false
        preferredLocale.value = parsed.preferredLocale || 'en'
      } catch {
        // If parsing fails, use defaults
      }
    }
  }

  function persist(): void {
    const data = {
      lastVisit: lastVisit.value,
      installPromptDismissed: installPromptDismissed.value,
      preferredLocale: preferredLocale.value,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function markVisit(): void {
    lastVisit.value = new Date().toISOString()
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
    lastVisit,
    installPromptDismissed,
    preferredLocale,
    initialize,
    persist,
    markVisit,
    setInstallPromptDismissed,
    setPreferredLocale,
  }
})
