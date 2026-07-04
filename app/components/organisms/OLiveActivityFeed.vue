<script setup lang="ts">
interface ActivityItem {
  id: string
  message: string
  timestamp: Date
}

const activities = ref<ActivityItem[]>([
  { id: '1', message: 'Someone in New York just explored the resource library', timestamp: new Date() },
  { id: '2', message: 'A new member joined from London', timestamp: new Date(Date.now() - 45000) },
  { id: '3', message: 'Resource shared: Top Freelancing Platforms', timestamp: new Date(Date.now() - 120000) },
  { id: '4', message: 'Daily check-in streak reached 7 days!', timestamp: new Date(Date.now() - 300000) },
])

const liveMessage = ref('')
let activityIndex = 0
let intervalId: ReturnType<typeof setInterval> | null = null

// Throttled updates — max 1 per 10 seconds
onMounted(() => {
  intervalId = setInterval(() => {
    if (activities.value.length > 0) {
      liveMessage.value = activities.value[activityIndex % activities.value.length].message
      activityIndex++
    }
  }, 10000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
</script>

<template>
  <section
    class="py-12 px-4 bg-surface-container"
    aria-labelledby="activity-heading"
  >
    <div class="max-w-2xl mx-auto">
      <h2
        id="activity-heading"
        class="text-2xl font-bold text-on-surface mb-6 text-center"
      >
        {{ $t('viral.activityFeed') }}
      </h2>

      <!-- Screen reader live region (throttled) -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        {{ liveMessage }}
      </div>

      <!-- Activity list -->
      <ul
        class="space-y-3"
        role="list"
        :aria-label="$t('viral.activityFeed')"
      >
        <li
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-start gap-3 bg-surface rounded-xl p-4"
        >
          <div
            class="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"
            aria-hidden="true"
          />
          <div class="flex-1">
            <p class="text-sm text-on-surface">{{ activity.message }}</p>
            <p class="text-xs text-on-surface-variant mt-1">{{ timeAgo(activity.timestamp) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
