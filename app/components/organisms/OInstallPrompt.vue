<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { usePwaInstallStore } from '~/stores/pwaInstall'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const pwaInstallStore = usePwaInstallStore()

// Track if install prompt was shown (to avoid multiple displays)
const isPromptShown = ref(false)
const showBanner = ref(false)

// Watch for canInstall changes and show banner within 1 second
const stopWatch = watch(
  () => pwaInstallStore.canInstall,
  (canInstall) => {
    if (canInstall && !pwaInstallStore.isStandalone && !pwaInstallStore.isDismissed && !isPromptShown.value) {
      // Show banner within 1 second of beforeinstallprompt event
      setTimeout(() => {
        showBanner.value = true
        isPromptShown.value = true
      }, 1000)
    }
  },
  { immediate: true }
)

// Show banner immediately if already canInstall but banner not yet shown
onMounted(() => {
  if (
    pwaInstallStore.canInstall &&
    !pwaInstallStore.isStandalone &&
    !pwaInstallStore.isDismissed &&
    !isPromptShown.value
  ) {
    setTimeout(() => {
      showBanner.value = true
      isPromptShown.value = true
    }, 1000)
  }
})

// Cleanup watch on unmount
onUnmounted(() => {
  if (stopWatch) {
    stopWatch()
  }
})

function handleInstall() {
  pwaInstallStore.promptInstall()
}

function handleDismiss() {
  pwaInstallStore.dismiss()
  showBanner.value = false
}
</script>

<template>
  <transition
    name="slide-down"
    appear
  >
    <div
      v-if="showBanner"
      class="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary shadow-lg"
      role="banner"
      aria-live="polite"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-3 gap-4">
          <p class="text-sm font-medium flex-1">
            {{ t('pwa.installPrompt') }}
          </p>
          <div class="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-on-primary hover:bg-on-primary/80 text-primary rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary/80"
              @click="handleInstall"
            >
              {{ t('pwa.installButton') }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 text-on-primary hover:bg-on-primary/20 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-on-primary/30"
              :aria-label="t('common.close')"
              @click="handleDismiss"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
