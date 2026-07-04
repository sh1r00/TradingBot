<script setup lang="ts">
const props = withDefaults(defineProps<{
  targetDate?: string
  label?: string
}>(), {
  label: 'Offer ends in',
})

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let intervalId: ReturnType<typeof setInterval> | null = null

function calculateTimeLeft() {
  const target = props.targetDate
    ? new Date(props.targetDate).getTime()
    : Date.now() + 3 * 24 * 60 * 60 * 1000 // Default: 3 days from now

  const diff = Math.max(0, target - Date.now())
  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

onMounted(() => {
  calculateTimeLeft()
  intervalId = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const ariaLabel = computed(
  () => `${props.label}: ${timeLeft.value.days} days, ${timeLeft.value.hours} hours, ${timeLeft.value.minutes} minutes, ${timeLeft.value.seconds} seconds`
)
</script>

<template>
  <div
    role="timer"
    :aria-label="ariaLabel"
    class="flex gap-2 justify-center"
  >
    <div
      v-for="(value, unit) in timeLeft"
      :key="unit"
      class="bg-primary-container rounded-xl p-3 min-w-[60px] text-center"
      aria-hidden="true"
    >
      <p class="text-2xl font-bold text-on-primary-container">
        {{ String(value).padStart(2, '0') }}
      </p>
      <p class="text-xs text-on-primary-container/70 capitalize">{{ unit }}</p>
    </div>
  </div>
</template>
