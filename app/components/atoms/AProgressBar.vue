<template>
  <div
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-label="ariaLabel"
    :class="[
      'w-full rounded-full overflow-hidden',
      'bg-surface-variant',
      heightClasses,
    ]"
  >
    <div
      :class="[
        'h-full rounded-full',
        'bg-primary',
        'transition-all duration-300 motion-reduce:transition-none',
      ]"
      :style="{ width: `${percentage}%` }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AProgressBarProps {
  value: number
  min?: number
  max?: number
  ariaLabel: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<AProgressBarProps>(), {
  min: 0,
  max: 100,
  size: 'md',
})

const percentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  const clamped = Math.min(Math.max(props.value, props.min), props.max)
  return ((clamped - props.min) / range) * 100
})

const heightClasses = computed(() => {
  return {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[props.size]
})
</script>
