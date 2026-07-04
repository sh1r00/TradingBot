<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5',
      'px-3 py-1.5 rounded-full',
      'text-sm font-medium',
      variantClasses,
    ]"
  >
    <slot />
    <button
      v-if="removable"
      type="button"
      :aria-label="removeAriaLabel"
      :class="[
        'inline-flex items-center justify-center',
        'min-h-11 min-w-11 -mr-1.5 ml-0.5',
        'rounded-full',
        'hover:bg-on-surface/12',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        'transition-colors duration-150 motion-reduce:transition-none',
      ]"
      @click="$emit('remove')"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AChipProps {
  variant?: 'filled' | 'outlined' | 'tonal'
  removable?: boolean
  removeAriaLabel?: string
}

const props = withDefaults(defineProps<AChipProps>(), {
  variant: 'tonal',
  removable: false,
  removeAriaLabel: 'Remove',
})

defineEmits<{
  remove: []
}>()

const variantClasses = computed(() => {
  return {
    filled: 'bg-primary text-on-primary',
    outlined: 'border border-outline text-on-surface',
    tonal: 'bg-secondary-container text-on-secondary-container',
  }[props.variant]
})
</script>
