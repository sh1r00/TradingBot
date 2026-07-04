<template>
  <div
    class="py-8 px-4 bg-surface-container-low"
    aria-labelledby="achievements-heading"
  >
    <div class="max-w-4xl mx-auto">
      <h2
        id="achievements-heading"
        class="text-xl font-bold text-on-surface mb-6 text-center"
      >
        {{ $t('badge.gatedTitle') }}
      </h2>

      <div class="flex flex-wrap justify-center gap-4">
        <!-- First Share Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'first_share')"
          :title="$t('badge.firstShare')"
          icon="share"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.firstShare')"
          icon="share"
          :earned="false"
        />

        <!-- Five Shares Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'five_shares')"
          :title="$t('badge.fiveShares')"
          icon="group"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.fiveShares')"
          icon="group"
          :earned="false"
        />

        <!-- Ten Shares Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'ten_shares')"
          :title="$t('badge.tenShares')"
          icon="public"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.tenShares')"
          icon="public"
          :earned="false"
        />

        <!-- Early Access Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'early_access')"
          :title="$t('badge.earlyAccess')"
          icon="shield"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.earlyAccess')"
          icon="shield"
          :earned="false"
        />

        <!-- Seven Day Streak Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'seven_day_streak')"
          :title="$t('badge.sevenDayStreak')"
          icon="fire"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.sevenDayStreak')"
          icon="fire"
          :earned="false"
        />

        <!-- Twenty-One Day Streak Badge -->
        <MAchievementBadge
          v-if="earnedBadges.some(b => b.id === 'twenty_one_day_streak')"
          :title="$t('badge.twentyOneDayStreak')"
          icon="bolt"
          :earned="true"
        />
        <MAchievementBadge
          v-else
          :title="$t('badge.twentyOneDayStreak')"
          icon="bolt"
          :earned="false"
        />
      </div>

      <!-- Progress tracking -->
      <div class="mt-6 text-center">
        <p class="text-sm text-on-surface-variant">
          {{ earnedBadges.length }} / {{ totalBadges }} {{ $t('badge.earnedCount', { count: earnedBadges.length }) }}
        </p>
        <AProgressBar
          :value="earnedBadges.length"
          :max="totalBadges"
          class="w-48 mx-auto mt-2 h-3"
        />
      </div>

      <!-- Notification for newly earned badge -->
      <div
        v-if="showingBadge"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce"
        role="alert"
        aria-live="assertive"
      >
        <div class="flex items-center gap-3">
          <AIcon name="celebration" size="md" decorative />
          <span class="font-medium">{{ $t('viral.achievementEarned') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAchievements } from '~/composables/useAchievements'
import MAchievementBadge from '~/components/molecules/MAchievementBadge.vue'
import AProgressBar from '~/components/atoms/AProgressBar.vue'
import AIcon from '~/components/atoms/AIcon.vue'

const { showingBadge, earnedBadges } = useAchievements()

// Calculate total possible badges
const totalBadges = 6 // first_share, five_shares, ten_shares, early_access, seven_day_streak, twenty_one_day_streak
</script>
