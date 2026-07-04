<script setup lang="ts">
function scrollToShare() {
  document.getElementById('share-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const btn = document.querySelector('#share-btn-cs')
  if (btn) {
    btn.addEventListener('click', scrollToShare)
  }
})
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="success-story-heading"
  >
    <div class="max-w-3xl mx-auto">
      <article aria-labelledby="success-story-heading">
        <h2
          id="success-story-heading"
          class="text-2xl font-bold text-on-surface mb-6 text-center"
        >
          {{ $t('caseStudy.title') }}
        </h2>

        <div class="space-y-8">
          <!-- Challenge -->
          <div class="bg-surface-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <AIcon name="warning" aria-hidden="true" />
              {{ $t('caseStudy.challenge') }}
            </h3>
            <p class="text-on-surface-variant">{{ $t('caseStudy.challengeText') }}</p>
          </div>

          <!-- Solution -->
          <div class="bg-surface-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <AIcon name="lightbulb" aria-hidden="true" />
              {{ $t('caseStudy.solution') }}
            </h3>
            <p class="text-on-surface-variant">{{ $t('caseStudy.solutionText') }}</p>
          </div>

          <!-- Results -->
          <div class="bg-primary-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-primary-container mb-3 flex items-center gap-2">
              <AIcon name="analytics" aria-hidden="true" />
              {{ $t('caseStudy.results') }}
            </h3>
            <ul class="space-y-2 text-on-primary-container/80 text-sm" role="list">
              <li>{{ $t('caseStudy.resultItem1') }}</li>
              <li>{{ $t('caseStudy.resultItem2') }}</li>
              <li>{{ $t('caseStudy.resultItem3') }}</li>
            </ul>
          </div>
        </div>

        <!-- Contextual share CTA -->
        <div class="text-center mt-8">
          <button
            id="share-btn-cs"
            type="button"
            class="inline-flex items-center justify-center gap-2 min-h-11 min-w-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {{ $t('share.title') }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
