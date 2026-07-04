<template>
  <div class="flex flex-col items-center gap-1" role="timer" :aria-label="label">
    <AText v-if="label" tag="span" variant="label-lg" class="text-on-surface-variant">
      {{ label }}
    </AText>
    <AText tag="span" variant="headline-md" aria-live="polite" aria-atomic="true">
      {{ display }}
    </AText>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AText from '~/components/atoms/AText.vue'

export interface MCountdownProps {
  targetDate: string | Date
  label?: string
}

const props = defineProps<MCountdownProps>()

const remaining = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

function calculateRemaining() {
  const target = new Date(props.targetDate).getTime()
  const now = Date.now()
  remaining.value = Math.max(0, target - now)
}

const display = computed(() => {
  const totalSeconds = Math.floor(remaining.value / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  return `${minutes}m ${seconds}s`
})

onMounted(() => {
  calculateRemaining()
  intervalId = setInterval(calculateRemaining, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>
