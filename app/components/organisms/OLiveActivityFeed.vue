<script setup lang="ts">
import { fetchLiveActivity, generateActivity, type ActivityItem } from '~/data/liveActivity'

const { t } = useI18n()

const activities = ref<ActivityItem[]>([])
const isLoading = ref(true)
const liveMessage = ref('')
let activityIndex = 0
let fetchIntervalId: ReturnType<typeof setInterval> | null = null
let liveIntervalId: ReturnType<typeof setInterval> | null = null

// Fetch initial data on mount, fall back to seed data
onMounted(async () => {
  try {
    const data = await fetchLiveActivity()
    activities.value = data.length > 0 ? data : []
  } catch {
    // Silent failure — empty state will show
  } finally {
    isLoading.value = false
  }

  // Simulate new activity every 8-15 seconds (randomized)
  fetchIntervalId = setInterval(() => {
    const newActivity = generateActivity()
    activities.value = [newActivity, ...activities.value].slice(0, 10)
  }, 8000 + Math.floor(Math.random() * 7000))

  // Rotate screen reader announcement every 10s
  liveIntervalId = setInterval(() => {
    if (activities.value.length > 0) {
      liveMessage.value = activities.value[activityIndex % activities.value.length].message
      activityIndex++
    }
  }, 10000)
})

onUnmounted(() => {
  if (fetchIntervalId) clearInterval(fetchIntervalId)
  if (liveIntervalId) clearInterval(liveIntervalId)
})

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return t('notification.activityNow') || 'just now'
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

      <!-- Screen reader live region -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        {{ liveMessage }}
      </div>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="space-y-3"
        aria-busy="true"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-start gap-3 bg-surface rounded-xl p-4 animate-pulse"
          aria-hidden="true"
        >
          <div class="w-2 h-2 rounded-full bg-surface-variant mt-2" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-surface-variant rounded w-3/4" />
            <div class="h-3 bg-surface-variant rounded w-1/4" />
          </div>
        </div>
      </div>

      <!-- Activity list -->
      <ul
        v-else
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
