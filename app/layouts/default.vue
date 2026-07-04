<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useDarkModeStore } from '~/stores/darkMode'
import { usePwaInstallStore } from '~/stores/pwaInstall'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const darkModeStore = useDarkModeStore()
const pwaInstallStore = usePwaInstallStore()
const authStore = useAuthStore()

// Reactively track dark mode for template class binding
const isDark = computed(() => darkModeStore.isDark)

// Apply/remove dark class on <html> element directly (bypasses Vue SSR hydration issues)
watch(isDark, (val) => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', val)
  }
})

// Initialize stores (client-side only — localStorage not available on server)
onMounted(() => {
  darkModeStore.initialize()
  pwaInstallStore.initialize()
  authStore.initialize()
})

// Focus management on route change
const cleanupRouteWatch = watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        setTimeout(() => mainContent.focus(), 100)
      }
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  cleanupRouteWatch()
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface text-on-surface font-sans"
    :class="{ dark: isDark }"
  >
    <!-- Skip-to-content link -->
    <a
      href="#main-content"
      class="fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-on-primary rounded-lg shadow-md transform -translate-y-16 focus:translate-y-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <ONavbar />

    <main
      id="main-content"
      tabindex="-1"
      class="flex-grow"
      aria-label="Main content"
    >
      <slot />
    </main>

    <OFooter />

    <OToastContainer />

    <ClientOnly>
      <OInstallPrompt />
    </ClientOnly>
  </div>
</template>

<style scoped>
:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
