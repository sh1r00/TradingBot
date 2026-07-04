<script setup lang="ts">
// Static content component
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="case-study-heading"
  >
    <div class="max-w-3xl mx-auto">
      <article aria-labelledby="case-study-heading">
        <h2
          id="case-study-heading"
          class="text-2xl font-bold text-on-surface mb-2 text-center"
        >
          {{ $t('caseStudy.title') }}
        </h2>
        <p class="text-on-surface-variant text-center mb-8">{{ $t('caseStudy.subtitle') }}</p>

        <div class="space-y-6">
          <!-- Challenge -->
          <div>
            <h3 class="text-lg font-semibold text-on-surface mb-2">{{ $t('caseStudy.challenge') }}</h3>
            <p class="text-on-surface-variant leading-relaxed">{{ $t('caseStudy.challengeText') }}</p>
          </div>

          <!-- Solution -->
          <div>
            <h3 class="text-lg font-semibold text-on-surface mb-2">{{ $t('caseStudy.solution') }}</h3>
            <p class="text-on-surface-variant leading-relaxed">{{ $t('caseStudy.solutionText') }}</p>
          </div>

          <!-- Results -->
          <div class="bg-primary-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-primary-container mb-4">{{ $t('caseStudy.results') }}</h3>
            <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <dt class="text-on-primary-container/70 text-sm">{{ $t('caseStudy.metric1Label') }}</dt>
                <dd class="text-3xl font-bold text-on-primary-container mt-1">{{ $t('caseStudy.metric1Value') }}</dd>
              </div>
              <div class="text-center">
                <dt class="text-on-primary-container/70 text-sm">{{ $t('caseStudy.metric2Label') }}</dt>
                <dd class="text-3xl font-bold text-on-primary-container mt-1">{{ $t('caseStudy.metric2Value') }}</dd>
              </div>
              <div class="text-center">
                <dt class="text-on-primary-container/70 text-sm">{{ $t('caseStudy.metric3Label') }}</dt>
                <dd class="text-3xl font-bold text-on-primary-container mt-1">{{ $t('caseStudy.metric3Value') }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Contextual share CTA -->
        <div class="text-center mt-8">
          <AButton variant="filled">{{ $t('share.title') }}</AButton>
        </div>
      </article>
    </div>
  </section>
</template>
