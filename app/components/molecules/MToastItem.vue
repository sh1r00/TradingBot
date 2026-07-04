<script setup lang="ts">
import { computed, ref } from 'vue'
import AText from '~/components/atoms/AText.vue'

export interface MToastItemProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  action?: string
}

const props = defineProps<MToastItemProps>()

const emit = defineEmits<{
  dismiss: [id: string]
  pause: [id: string]
  resume: [id: string]
}>()

const isPaused = ref(false)

const typeClasses = computed(() => {
  return {
    success: 'bg-primary-container border-primary text-on-primary-container',
    error: 'bg-error-container border-error text-on-error-container',
    warning: 'bg-tertiary-container border-tertiary text-on-tertiary-container',
    info: 'bg-secondary-container border-secondary text-on-secondary-container',
  }[props.type]
})

function handlePause() {
  if (!isPaused.value) {
    isPaused.value = true
    emit('pause', props.id)
  }
}

function handleResume() {
  if (isPaused.value) {
    isPaused.value = false
    emit('resume', props.id)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('dismiss', props.id)
  }
}
</script>

<template>
  <div
    :class="[

      'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-72 max-w-md',
      'border transition-all duration-200 motion-reduce:transition-none',
      typeClasses,
    ]"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
    tabindex="0"
    @keydown="handleKeydown"
    @mouseenter="handlePause"
    @mouseleave="handleResume"
    @focusin="handlePause"
    @focusout="handleResume"
  >
    <AText tag="span" variant="body-md" class="flex-1">
      {{ message }}
    </AText>

    <AText v-if="action" tag="span" variant="body-sm" class="text-on-surface-variant">
      {{ action }}
    </AText>

    <button
      type="button"
      class="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full hover:bg-on-surface/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-150 motion-reduce:transition-none"
      :aria-label="'Dismiss notification'"
      @click="$emit('dismiss', id)"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

