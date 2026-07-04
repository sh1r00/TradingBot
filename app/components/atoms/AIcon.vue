<template>
  <span
    :class="[
      'inline-flex items-center justify-center shrink-0',
      sizeClasses,
    ]"
    :aria-hidden="!hasContent && (decorative || undefined)"
    :aria-label="!hasContent && !decorative ? ariaLabel : undefined"
    :role="!hasContent && !decorative ? 'img' : undefined"
  >
    <!-- Icon name rendering (Material Icons) -->
    <span
      v-if="name"
      class="material-icons"
      :aria-hidden="decorative || undefined"
    >
      {{ name }}
    </span>
    
    <!-- Slotted content (custom SVG or HTML) -->
    <slot v-else />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AIconProps {
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  decorative?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<AIconProps>(), {
  size: 'md',
  decorative: true,
})

const hasContent = computed(() => !!props.name || !!Object.keys($slots).length)

const sizeClasses = computed(() => {
  return {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }[props.size]
})
</script>
