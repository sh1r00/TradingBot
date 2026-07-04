<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, nextTick } from 'vue'
import { useDarkModeStore } from '~/stores/darkMode'
import { usePwaInstallStore } from '~/stores/pwaInstall'

const route = useRoute()
const darkModeStore = useDarkModeStore()
const pwaInstallStore = usePwaInstallStore()

// Initialize stores on mount
onMounted(() => {
  darkModeStore.initialize()
  pwaInstallStore.initialize()

  // Move focus to main content within 300ms of route change
  const cleanupRouteWatch = route.meta?.skipFocusManagement !== true
    ? watch(
        () => route.fullPath,
        () => {
          nextTick(() => {
            const mainContent = document.getElementById('main-content')
            if (mainContent) {
              // Use setTimeout to ensure it's within 300ms window
              setTimeout(() => {
                mainContent.focus()
              }, 100)
            }
          })
        },
        { immediate: true }
      )
    : null

  // Cleanup on unmount
  onUnmounted(() => {
    if (cleanupRouteWatch) {
      cleanupRouteWatch()
    }
  })
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-surface text-on-surface font-sans"
    :class="{ 'dark': darkModeStore.isDark }"
  >
    <!-- Skip-to-content link (visually hidden until focused) -->
    <a
      href="#main-content"
      class="fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-on-primary rounded-lg shadow-md transform -translate-y-16 focus:translate-y-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <!-- Semantic landmarks -->
    <header
      class="bg-primary text-on-primary"
      aria-label="Site header"
    >
      <!-- Navbar would be placed here via ONavbar component -->
    </header>

    <nav
      class="bg-primary text-on-primary"
      aria-label="Primary navigation"
    >
      <!-- Navigation content would be placed here -->
    </nav>

    <main
      id="main-content"
      tabindex="-1"
      class="flex-grow"
      aria-label="Main content"
    >
      <slot />
    </main>

    <footer
      class="bg-surface-variant text-on-surface-variant"
      aria-label="Site footer"
    >
      <!-- Footer content would be placed here -->
    </footer>

    <!-- Toast Container (fixed bottom-center) -->
    <OToastContainer />

    <!-- PWA Install Prompt -->
    <ClientOnly>
      <OInstallPrompt />
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Focus-visible indicators for accessibility */
:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}

/* Reduced motion support */
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
