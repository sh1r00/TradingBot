<script setup lang="ts">
// Static content component
</script>

<template>
  <section
    class="py-12 px-4 bg-surface-container"
    aria-labelledby="success-story-heading"
  >
    <div class="max-w-3xl mx-auto">
      <article aria-labelledby="success-story-heading">
        <h2
          id="success-story-heading"
          class="text-2xl font-bold text-on-surface mb-6 text-center"
        >
          {{ $t('successStory.title') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Before -->
          <div class="bg-error-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-error-container mb-3 flex items-center gap-2">
              <AIcon name="trending_down" aria-hidden="true" />
              {{ $t('successStory.before') }}
            </h3>
            <ul class="space-y-2 text-on-error-container/80 text-sm" role="list">
              <li>{{ $t('successStory.beforeItem1') }}</li>
              <li>{{ $t('successStory.beforeItem2') }}</li>
              <li>{{ $t('successStory.beforeItem3') }}</li>
            </ul>
          </div>

          <!-- After -->
          <div class="bg-primary-container rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-on-primary-container mb-3 flex items-center gap-2">
              <AIcon name="trending_up" aria-hidden="true" />
              {{ $t('successStory.after') }}
            </h3>
            <ul class="space-y-2 text-on-primary-container/80 text-sm" role="list">
              <li>{{ $t('successStory.afterItem1') }}</li>
              <li>{{ $t('successStory.afterItem2') }}</li>
              <li>{{ $t('successStory.afterItem3') }}</li>
            </ul>
          </div>
        </div>

        <!-- Share CTA -->
        <div class="text-center">
          <p class="text-on-surface-variant mb-4">{{ $t('successStory.shareCta') }}</p>
          <AButton variant="filled">{{ $t('share.title') }}</AButton>
        </div>
      </article>
    </div>
  </section>
</template>
