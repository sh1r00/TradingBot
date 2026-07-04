<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    :class="['inline-flex items-center justify-center', sizeClasses]"
  >
    <svg
      :class="[
        'animate-spin text-current motion-reduce:animate-none',
        sizeClasses,
      ]"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span class="sr-only">{{ ariaLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ASpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

const props = withDefaults(defineProps<ASpinnerProps>(), {
  size: 'md',
  ariaLabel: 'Loading',
})

const sizeClasses = computed(() => {
  return {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[props.size]
})
</script>
