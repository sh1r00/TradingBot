<template>
  <div
    :class="[
      'inline-flex items-center gap-2 px-3 py-2 rounded-full',
      earned
        ? 'bg-primary-container text-on-primary-container'
        : 'bg-surface-variant text-on-surface-variant opacity-60',
    ]"
    :aria-label="`Achievement: ${title}${earned ? ' - earned' : ' - locked'}`"
  >
    <AIcon :name="icon" :size="'sm'" :decorative="true" />

    <ABadge :variant="earned ? 'primary' : 'surface'">
      {{ title }}
    </ABadge>
  </div>
</template>

<script setup lang="ts">
import AIcon from '~/components/atoms/AIcon.vue'
import ABadge from '~/components/atoms/ABadge.vue'

export interface MAchievementBadgeProps {
  title: string
  icon: string
  earned: boolean
}

defineProps<MAchievementBadgeProps>()
</script>
