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
    <!-- 1. Hero (always visible) -->
    <OHeroSection
      @primary-cta="goToResources"
      @secondary-cta="scrollToCalculator"
    />

    <!-- 2. Income Calculator (high value — moved up, right after hero) -->
    <OIncomeCalculator v-reveal />

    <!-- 3. Leaderboard / top resources (high value) -->
    <OLeaderboard v-reveal />

    <!-- 4+. Progressive disclosure — lower-value sections collapsed behind "show more". -->
    <section class="px-4 py-8" aria-labelledby="more-sections-summary">
      <div class="max-w-3xl mx-auto">
        <details class="group rounded-2xl overflow-hidden bg-surface-container">
          <summary
            id="more-sections-summary"
            class="flex items-center justify-between gap-4 cursor-pointer select-none list-none px-6 py-5 font-semibold text-on-surface hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset min-h-[44px] [&::-webkit-details-marker]:hidden"
          >
            <span>{{ $t('home.showMore') }}</span>
            <AIcon
              name="expand_more"
              class="text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div class="space-y-0">
            <!-- Lazy-mount below-the-fold sections (only fetched when the group is expanded). -->
            <LazyONotificationBar />
            <LazyOLiveActivityFeed />
            <LazyOPainPoint />
            <LazyOFreeToolkit />
            <LazyOContentPreviews />
            <LazyOLeadCapture />
            <LazyOShareSection />
          </div>
        </details>
      </div>
    </section>
  </div>
</template>
