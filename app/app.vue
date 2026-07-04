<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'

const darkMode = useDarkModeStore()

// Use useLocaleHead for automatic <html lang> and hreflang
useLocaleHead({
  link: (links) => {
    // Add reduced motion preference based on dark mode
    return links
  },
})

// Apply reduced motion based on user preference
onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateReducedMotion() {
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('scroll-behavior', 'auto')
    } else {
      document.documentElement.style.setProperty('scroll-behavior', 'smooth')
    }
  }

  updateReducedMotion()
  prefersReducedMotion.addEventListener('change', updateReducedMotion)

  onUnmounted(() => {
    prefersReducedMotion.removeEventListener('change', updateReducedMotion)
  })
})
</script>

<template>
  <div class="motion-safe:transition-colors motion-safe:duration-300">
    <ClientOnly v-if="darkMode.isDarkMode">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
