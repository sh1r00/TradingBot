import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'pwa-install-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * PWA install prompt store.
 * Manages the beforeinstallprompt event lifecycle,
 * standalone detection, and dismissal persistence.
 *
 * Requirements: 5.9–5.11
 */
export const usePwaInstallStore = defineStore('pwaInstall', () => {
  const canInstall = ref(false)
  const isDismissed = ref(false)
  const isStandalone = ref(false)

  let deferredPrompt: BeforeInstallPromptEvent | null = null

  function initialize(): void {
    // Check if running in standalone mode
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches

    // Read dismissal state from localStorage
    isDismissed.value = localStorage.getItem(STORAGE_KEY) === 'true'

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      deferredPrompt = event as BeforeInstallPromptEvent
      canInstall.value = true
    })
  }

  async function promptInstall(): Promise<void> {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      canInstall.value = false
    }

    deferredPrompt = null
  }

  function dismiss(): void {
    isDismissed.value = true
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  return { canInstall, isDismissed, isStandalone, initialize, promptInstall, dismiss }
})
