<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2',
      'min-h-11 min-w-11 px-6 py-3',
      'rounded-full font-medium text-sm tracking-wide',
      'transition-colors duration-200 motion-reduce:transition-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:opacity-38 disabled:pointer-events-none',
      variantClasses,
    ]"
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    :aria-label="ariaLabel || undefined"
    :aria-busy="loading || undefined"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const props = withDefaults(defineProps<AButtonProps>(), {
  variant: 'filled',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-xs px-4 py-2 min-h-11 min-w-11',
    md: 'text-sm px-6 py-3 min-h-11 min-w-11',
    lg: 'text-base px-8 py-4 min-h-12 min-w-12',
  }[props.size]

  const variantStyles = {
    filled: 'bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80',
    outlined: 'border border-outline text-primary hover:bg-primary/8 active:bg-primary/12',
    text: 'text-primary hover:bg-primary/8 active:bg-primary/12',
    tonal: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 active:bg-secondary-container/70',
  }[props.variant]

  return `${sizeClasses} ${variantStyles}`
})
</script>
