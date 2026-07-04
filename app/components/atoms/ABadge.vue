<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'px-3 py-1 rounded-full',
      'text-xs font-medium tracking-wide',
      variantClasses,
    ]"
    :aria-label="ariaLabel || undefined"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ABadgeProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface'
  ariaLabel?: string
}

const props = withDefaults(defineProps<ABadgeProps>(), {
  variant: 'primary',
})

const variantClasses = computed(() => {
  return {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    error: 'bg-error-container text-on-error-container',
    surface: 'bg-surface-variant text-on-surface-variant',
  }[props.variant]
})
</script>
