<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'rounded-full font-medium',
      variantClasses,
      sizeClasses,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ATagProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<ATagProps>(), {
  variant: 'primary',
  size: 'md',
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

const sizeClasses = computed(() => {
  return {
    sm: 'px-2 py-0.5 text-[0.6875rem] tracking-wide',
    md: 'px-3 py-1 text-xs tracking-wide',
    lg: 'px-4 py-1.5 text-sm',
  }[props.size]
})
</script>
