<template>
  <hr
    :class="[
      'border-t border-outline-variant w-full',
      spacingClasses,
    ]"
    role="separator"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ADividerProps {
  spacing?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<ADividerProps>(), {
  spacing: 'md',
})

const spacingClasses = computed(() => {
  return {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
  }[props.spacing]
})
</script>
