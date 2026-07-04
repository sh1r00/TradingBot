<script setup lang="ts">
// No reactive state needed — static content
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="founder-story-heading"
  >
    <div class="max-w-3xl mx-auto">
      <article aria-labelledby="founder-story-heading">
        <h2
          id="founder-story-heading"
          class="text-2xl font-bold text-on-surface mb-6 text-center"
        >
          {{ $t('founder.title') }}
        </h2>

        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Founder image -->
          <div class="flex-shrink-0 mx-auto md:mx-0">
            <AAvatar
              :alt="$t('founder.imageAlt')"
              size="xl"
              class="ring-4 ring-primary-container"
            />
          </div>

          <!-- Story content -->
          <div class="space-y-4 text-on-surface">
            <h3 class="text-xl font-semibold text-primary">
              {{ $t('founder.name') }}
            </h3>
            <p class="text-on-surface-variant leading-relaxed">
              {{ $t('founder.story1') }}
            </p>
            <p class="text-on-surface-variant leading-relaxed">
              {{ $t('founder.story2') }}
            </p>
            <blockquote class="border-l-4 border-primary pl-4 italic text-on-surface-variant">
              {{ $t('founder.quote') }}
            </blockquote>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
