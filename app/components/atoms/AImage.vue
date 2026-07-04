<template>
  <img
    v-if="!error"
    :src="src"
    :alt="decorative ? '' : alt"
    :role="decorative ? 'presentation' : undefined"
    :aria-hidden="decorative || undefined"
    :loading="lazy ? 'lazy' : undefined"
    :width="width"
    :height="height"
    :class="['max-w-full h-auto', $attrs.class]"
    @error="$emit('error', $event)"
  />
  <slot v-else name="fallback">
    <div
      :class="[
        'flex items-center justify-center bg-surface-variant text-on-surface-variant',
        fallbackClasses,
      ]"
      :role="decorative ? 'presentation' : 'img'"
      :aria-label="decorative ? undefined : alt"
      :aria-hidden="decorative || undefined"
    >
      <slot name="fallback-content">
        <svg
          class="w-8 h-8 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
      </slot>
    </div>
  </slot>
</template>

<script setup lang="ts">
export interface AImageProps {
  src: string
  alt?: string
  decorative?: boolean
  lazy?: boolean
  width?: string | number
  height?: string | number
  error?: boolean
  fallbackClasses?: string
}

withDefaults(defineProps<AImageProps>(), {
  alt: '',
  decorative: false,
  lazy: true,
  error: false,
  fallbackClasses: 'w-full h-48 rounded-lg',
})

defineEmits<{
  error: [event: Event]
}>()
</script>
