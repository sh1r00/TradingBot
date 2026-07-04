<script setup lang="ts">
import { useEngagementStore } from '~/stores/engagement'
import { useAuthStore } from '~/stores/auth'
import { useAchievements } from '~/composables/useAchievements'

const engagement = useEngagementStore()
const auth = useAuthStore()
const { checkAchievements } = useAchievements()
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
  checkAchievements()
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

      <!-- Gated button: redirects to login if not authenticated -->
      <NuxtLink
        v-if="!auth.isAuthenticated"
        to="/login"
        class="inline-flex items-center justify-center gap-2 min-h-11 min-w-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {{ $t('checkin.checkInNow') }}
      </NuxtLink>
      <AButton
        v-else
        variant="filled"
        size="lg"
        :disabled="hasCheckedInToday"
        @click="checkIn"
      >
        {{ hasCheckedInToday ? $t('checkin.alreadyCheckedIn') : $t('checkin.checkInNow') }}
      </AButton>

      <p v-if="!auth.isAuthenticated" class="text-xs text-on-surface-variant mt-3">
        <NuxtLink to="/login" class="text-primary hover:underline">
          Sign in
        </NuxtLink>
        to track your streak
      </p>
    </div>
  </section>
</template>
