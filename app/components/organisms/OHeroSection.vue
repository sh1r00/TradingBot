<template>
  <section
    v-spotlight
    class="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface to-primary-container motion-safe:transition-colors motion-safe:duration-500"
    aria-labelledby="hero-title"
  >
    <div class="hero-glow hero-glow-primary" aria-hidden="true"></div>
    <div class="hero-glow hero-glow-secondary" aria-hidden="true"></div>
    <div class="hero-spotlight" aria-hidden="true"></div>

    <div class="relative max-w-4xl mx-auto text-center">
      <h1
        id="hero-title"
        class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface mb-6"
      >
        <span
          v-for="(word, i) in headlineWords"
          :key="i"
          class="hero-word"
          :style="{ animationDelay: `${i * 60}ms` }"
        >{{ word }}</span>
      </h1>
      <p
        class="hero-subtitle text-lg sm:text-xl md:text-2xl text-on-surface-variant mb-10 max-w-2xl mx-auto"
      >
        {{ t('hero.subtitle') }}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AButton
          v-magnetic
          variant="filled"
          size="lg"
          class="min-w-48"
          @click="handlePrimaryCta"
        >
          {{ t('hero.cta') }}
        </AButton>
        <AButton
          v-magnetic
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

    <div class="hero-scroll-cue" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const headlineWords = computed(() => t('hero.title').split(' '))

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

<style scoped>
.hero-glow {
  position: absolute;
  z-index: 0;
  width: min(42vw, 34rem);
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.16;
  pointer-events: none;
}
.hero-glow-primary {
  top: -8%;
  left: -10%;
  background: var(--color-primary-container);
  animation: aurora-drift 16s ease-in-out infinite;
}
.hero-glow-secondary {
  right: -12%;
  bottom: -14%;
  background: var(--color-tertiary-container, var(--color-primary-container));
  animation: aurora-drift 22s ease-in-out -7s infinite;
}
@keyframes aurora-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5%, 4%) scale(1.12); }
  66% { transform: translate(-4%, -3%) scale(0.94); }
}

.hero-spotlight {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    560px circle at var(--spot-x, 50%) var(--spot-y, 40%),
    color-mix(in srgb, var(--color-primary) 10%, transparent),
    transparent 62%
  );
  animation: spotlight-breathe 7s ease-in-out infinite;
}
@keyframes spotlight-breathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

.hero-word {
  display: inline-block;
  margin-right: 0.24em;
  animation: word-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
.hero-word:last-child { margin-right: 0; }
@keyframes word-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

.hero-subtitle { position: relative; }
.hero-subtitle::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1rem;
  width: 14rem;
  max-width: 70vw;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-tertiary, var(--color-primary)));
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  animation: draw-in 1.1s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes draw-in {
  to { transform: translateX(-50%) scaleX(1); }
}

.hero-scroll-cue {
  position: absolute;
  bottom: 1.4rem;
  left: 50%;
  z-index: 2;
  display: flex;
  color: var(--color-on-surface-variant);
  transform: translateX(-50%);
  animation: scroll-bounce 1.7s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
  50% { transform: translateX(-50%) translateY(6px); opacity: 1; }
}

@media (max-width: 767px) {
  .hero-glow { filter: blur(40px); }
  .hero-scroll-cue { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-glow-primary,
  .hero-glow-secondary,
  .hero-spotlight,
  .hero-word,
  .hero-subtitle::after,
  .hero-scroll-cue {
    animation: none;
  }
}
</style>
