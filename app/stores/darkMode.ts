import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Dark mode store.
 * Manages dark/light theme state with persistence to localStorage.
 * Uses system preference as default if no stored value exists.
 *
 * Requirements: 15.5
 */
export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = ref(false)

  const initialized = ref(false)

  /**
   * Initialize dark mode from localStorage or system preference.
   */
  function initialize() {
    if (initialized.value) return

    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }

    initialized.value = true
  }

  /**
   * Toggle dark mode on/off.
   */
  function toggle() {
    if (!initialized.value) initialize()

    isDark.value = !isDark.value
    localStorage.setItem('darkMode', String(isDark.value))
  }

  /**
   * Set dark mode explicitly.
   */
  function setDark(value: boolean) {
    if (!initialized.value) initialize()

    isDark.value = value
    localStorage.setItem('darkMode', String(value))
  }

  return {
    isDark,
    initialized,
    initialize,
    toggle,
    setDark,
  }
})
