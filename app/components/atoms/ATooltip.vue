<template>
  <span class="relative inline-flex group">
    <slot />
    <span
      :id="tooltipId"
      role="tooltip"
      :class="[
        'absolute z-50 px-3 py-1.5 rounded-md',
        'bg-inverse-surface text-inverse-on-surface',
        'text-xs font-medium whitespace-nowrap',
        'opacity-0 pointer-events-none',
        'group-hover:opacity-100 group-focus-within:opacity-100',
        'transition-opacity duration-150 motion-reduce:transition-none',
        positionClasses,
      ]"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ATooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  tooltipId: string
}

const props = withDefaults(defineProps<ATooltipProps>(), {
  position: 'top',
})

const positionClasses = computed(() => {
  return {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[props.position]
})
</script>
