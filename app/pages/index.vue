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

    <!-- 2. Countdown -->
    <OCountdownTimer />

    <!-- 3. Notification -->
    <ONotificationBar />

    <!-- 4. Leaderboard -->
    <OLeaderboard />

    <!-- 5. Live Activity -->
    <OLiveActivityFeed />

    <!-- 6. Achievements -->
    <OAchievementBadge />

    <!-- 7. Pain Points -->
    <OPainPoint />

    <!-- 8. Income Calculator -->
    <div id="income-calculator">
      <OIncomeCalculator />
    </div>

    <!-- 9. Daily Check-In -->
    <ODailyCheckIn />

    <!-- 10. Exclusive Access -->
    <OExclusiveAccess />

    <!-- 11. Free Toolkit -->
    <OFreeToolkit />

    <!-- 12. Content Previews -->
    <OContentPreviews />

    <!-- 13. Lead Capture -->
    <OLeadCapture />

    <!-- 14. Case Study -->
    <OCaseStudy />

    <!-- 15. Success Story -->
    <OSuccessStory />

    <!-- 16. Founder Story -->
    <OFounderStory />

    <!-- 17. Share Section -->
    <div id="share-section">
      <OShareSection />
    </div>
  </div>
</template>
