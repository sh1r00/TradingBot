<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-full overflow-hidden',
      'bg-primary-container text-on-primary-container',
      'font-medium',
      sizeClasses,
    ]"
    :role="alt ? 'img' : undefined"
    :aria-label="alt || undefined"
  >
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt || ''"
      class="w-full h-full object-cover"
      @error="$emit('imageError', $event)"
    />
    <span v-else aria-hidden="true">
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AAvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  imageError?: boolean
}

const props = withDefaults(defineProps<AAvatarProps>(), {
  src: '',
  alt: '',
  initials: '',
  size: 'md',
  imageError: false,
})

defineEmits<{
  imageError: [event: Event]
}>()

const sizeClasses = computed(() => {
  return {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }[props.size]
})

const initials = computed(() => {
  if (props.initials) return props.initials
  if (props.alt) {
    return props.alt
      .split(' ')
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return ''
})
</script>
