<script setup lang="ts">
// Load Material Icons font and base SEO
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
})

useHead({
  link: [
    ...(i18nHead.link || []),
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
  ],
  htmlAttrs: i18nHead.htmlAttrs,
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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
