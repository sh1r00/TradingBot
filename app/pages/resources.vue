<script setup lang="ts">
useSeoMeta({
  title: 'Resources - Money Conversion SPA',
  ogTitle: 'Resources - Money Conversion SPA',
  description: 'Browse curated money-making resources organized by category. Vetted external links to help you earn more.',
  ogDescription: 'Browse curated money-making resources organized by category. Vetted external links to help you earn more.',
  ogType: 'website',
  ogUrl: `${useRuntimeConfig().public.baseUrl}/resources`,
  ogImage: `${useRuntimeConfig().public.baseUrl}/og-image.png`,
})
</script>

<template>
  <div>
    <OResourceGrid />
  </div>
</template>
