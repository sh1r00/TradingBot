<template>
  <section
    class="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface to-primary-container motion-safe:transition-colors motion-safe:duration-500"
    aria-labelledby="hero-title"
  >
    <div class="max-w-4xl mx-auto text-center">
      <h1
        id="hero-title"
        class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6"
      >
        {{ t('hero.title') }}
      </h1>
      <p
        class="text-lg sm:text-xl md:text-2xl text-on-surface-variant mb-10 max-w-2xl mx-auto"
      >
        {{ t('hero.subtitle') }}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AButton
          variant="filled"
          size="lg"
          class="min-w-48"
          @click="handlePrimaryCta"
        >
          {{ t('hero.cta') }}
        </AButton>
        <AButton
          variant="tonal"
          size="lg"
          class="min-w-48"
          @click="handleSecondaryCta"
        >
          {{ t('hero.ctaSecondary') }}
        </AButton>
      </div>
      <p
        class="mt-8 text-sm text-on-surface-variant"
        role="status"
        aria-live="polite"
      >
        {{ t('hero.socialProof') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  primaryCta: []
  secondaryCta: []
}>()

function handlePrimaryCta() {
  emit('primaryCta')
}

function handleSecondaryCta() {
  emit('secondaryCta')
}
</script>
