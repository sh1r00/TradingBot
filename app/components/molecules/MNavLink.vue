<template>
  <a
    :href="to"
    :class="[
      'inline-flex items-center gap-2',
      'min-h-11 min-w-11 px-4 py-2',
      'rounded-full text-sm font-medium',
      'transition-colors duration-150 motion-reduce:transition-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      isActive
        ? 'bg-secondary-container text-on-secondary-container'
        : 'text-on-surface-variant hover:bg-on-surface/8',
    ]"
    :aria-current="isActive ? 'page' : undefined"
  >
    <AText tag="span" variant="label-lg">
      {{ label }}
    </AText>
  </a>
</template>

<script setup lang="ts">
import AText from '~/components/atoms/AText.vue'

export interface MNavLinkProps {
  to: string
  label: string
  isActive?: boolean
}

withDefaults(defineProps<MNavLinkProps>(), {
  isActive: false,
})
</script>
