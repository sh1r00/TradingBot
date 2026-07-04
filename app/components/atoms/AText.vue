<template>
  <component
    :is="tag"
    :class="[variantClasses, 'text-on-surface']"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ATextProps {
  tag?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'small' | 'strong'
  variant?: 'display-lg' | 'display-md' | 'display-sm' | 'headline-lg' | 'headline-md' | 'headline-sm' | 'title-lg' | 'title-md' | 'title-sm' | 'body-lg' | 'body-md' | 'body-sm' | 'label-lg' | 'label-md' | 'label-sm'
}

const props = withDefaults(defineProps<ATextProps>(), {
  tag: 'p',
  variant: 'body-md',
})

const variantClasses = computed(() => {
  return {
    'display-lg': 'text-6xl font-bold tracking-tight',
    'display-md': 'text-5xl font-bold tracking-tight',
    'display-sm': 'text-4xl font-bold tracking-tight',
    'headline-lg': 'text-3xl font-semibold',
    'headline-md': 'text-2xl font-semibold',
    'headline-sm': 'text-xl font-semibold',
    'title-lg': 'text-lg font-medium',
    'title-md': 'text-base font-medium',
    'title-sm': 'text-sm font-medium',
    'body-lg': 'text-lg font-normal',
    'body-md': 'text-base font-normal',
    'body-sm': 'text-sm font-normal',
    'label-lg': 'text-sm font-medium tracking-wide',
    'label-md': 'text-xs font-medium tracking-wide',
    'label-sm': 'text-[0.6875rem] font-medium tracking-wide',
  }[props.variant]
})
</script>
