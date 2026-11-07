<script setup lang="ts">
const router = useRouter()
const localePath = useLocalePath()

function goToResources() {
  router.push(localePath('/resources'))
}

function scrollToCalculator() {
  const el = document.getElementById('income-calculator')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function scrollToShare() {
  const el = document.getElementById('share-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

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
  <div class="space-y-0">
    <!-- 1. Hero -->
    <OHeroSection
      @primary-cta="goToResources"
      @secondary-cta="scrollToCalculator"
    />

    <!-- Marquee (decorative) -->
    <MMarquee />

    <!-- 2. Notification -->
    <ONotificationBar v-reveal />

    <!-- 4. Leaderboard -->
    <OLeaderboard v-reveal />

    <!-- 5. Live Activity -->
    <OLiveActivityFeed v-reveal />

    <!-- 7. Pain Points -->
    <OPainPoint v-reveal />

    <!-- 8. Income Calculator -->
    <div id="income-calculator" v-reveal>
      <OIncomeCalculator />
    </div>

    <!-- 11. Free Toolkit -->
    <OFreeToolkit v-reveal />

    <!-- 12. Content Previews -->
    <OContentPreviews v-reveal />

    <!-- 13. Lead Capture -->
    <OLeadCapture v-reveal />

    <!-- 14. Case Study -->
    <OCaseStudy v-reveal />

    <!-- 15. Success Story -->
    <OSuccessStory v-reveal />

    <!-- 16. Founder Story -->
    <OFounderStory v-reveal />

    <!-- 17. Share Section -->
    <div id="share-section" v-reveal>
      <OShareSection />
    </div>
  </div>
</template>
