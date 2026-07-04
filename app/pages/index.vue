<script setup lang="ts">
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Money Conversion SPA',
        url: useRuntimeConfig().public.baseUrl,
        description: 'Curated money-making resources and tools to help you earn more',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${useRuntimeConfig().public.baseUrl}/resources?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Money Conversion SPA',
        url: useRuntimeConfig().public.baseUrl,
        logo: `${useRuntimeConfig().public.baseUrl}/favicon.svg`,
      }),
    },
  ],
})

useSeoMeta({
  title: 'Money Conversion SPA - Curated Money-Making Resources',
  ogTitle: 'Money Conversion SPA - Curated Money-Making Resources',
  description: 'Discover curated, vetted money-making resources and tools. Free calculators, checklists, and expert-selected opportunities.',
  ogDescription: 'Discover curated, vetted money-making resources and tools. Free calculators, checklists, and expert-selected opportunities.',
  ogType: 'website',
  ogUrl: useRuntimeConfig().public.baseUrl,
  ogImage: `${useRuntimeConfig().public.baseUrl}/og-image.png`,
})
</script>

<template>
  <div class="space-y-12">
    <OHeroSection />
    <OLeaderboard />
    <ONotificationBar />
    <OIncomeCalculator />
    <OLiveActivityFeed />
    <OFreeToolkit />
    <OFounderStory />
  </div>
</template>
