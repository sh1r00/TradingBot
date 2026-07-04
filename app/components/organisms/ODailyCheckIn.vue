<script setup lang="ts">
import { useEngagementStore } from '~/stores/engagement'

const engagement = useEngagementStore()
const toast = useToast()
const { t } = useI18n()

const streak = computed(() => engagement.dailyCheckIns || 0)
const maxStreak = 7
const progress = computed(() => Math.min((streak.value / maxStreak) * 100, 100))

const hasCheckedInToday = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return engagement.lastVisit?.slice(0, 10) === today
})

function checkIn() {
  engagement.markVisit()
  engagement.incrementDailyCheckIn()
  toast.success(t('viral.dailyCheckIn') + ' ✓')
}
</script>

<template>
  <section
    class="py-12 px-4 bg-surface-container"
    aria-labelledby="check-in-heading"
  >
    <div class="max-w-2xl mx-auto text-center">
      <h2
        id="check-in-heading"
        class="text-2xl font-bold text-on-surface mb-2"
      >
        {{ $t('viral.dailyCheckIn') }}
      </h2>
      <p class="text-on-surface-variant mb-6">{{ $t('checkin.streakLabel', { count: streak }) }}</p>

      <!-- Progress bar -->
      <div class="mb-6">
        <div
          role="progressbar"
          :aria-valuenow="streak"
          :aria-valuemin="0"
          :aria-valuemax="maxStreak"
          :aria-label="$t('checkin.streakProgress', { current: streak, max: maxStreak })"
          class="w-full h-3 bg-surface-variant rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-primary rounded-full transition-all duration-500 motion-reduce:transition-none"
            :style="{ width: progress + '%' }"
          />
        </div>
        <p class="text-sm text-on-surface-variant mt-2">
          {{ streak }} / {{ maxStreak }} {{ $t('checkin.days') }}
        </p>
      </div>

      <!-- Check-in button -->
      <AButton
        variant="filled"
        size="lg"
        :disabled="hasCheckedInToday"
        @click="checkIn"
      >
        {{ hasCheckedInToday ? $t('checkin.alreadyCheckedIn') : $t('checkin.checkInNow') }}
      </AButton>
    </div>
  </section>
</template>
