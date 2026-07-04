<template>
  <div
    :class="[
      'rounded-xl transition-shadow duration-200 motion-reduce:transition-none',
      variantClasses,
      interactive ? 'cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2' : '',
      paddingClasses,
    ]"
    :tabindex="interactive ? 0 : undefined"
    :role="interactive ? 'button' : undefined"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ACardProps {
  variant?: 'elevated' | 'outlined' | 'filled'
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<ACardProps>(), {
  variant: 'outlined',
  interactive: false,
  padding: 'md',
})

const variantClasses = computed(() => {
  return {
    elevated: 'bg-surface text-on-surface shadow-md',
    outlined: 'bg-surface text-on-surface border border-outline-variant',
    filled: 'bg-surface-variant text-on-surface-variant',
  }[props.variant]
})

const paddingClasses = computed(() => {
  return {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }[props.padding]
})
</script>
