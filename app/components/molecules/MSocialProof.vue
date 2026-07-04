<template>
  <div class="flex items-center gap-3">
    <div class="flex -space-x-2" aria-hidden="true">
      <AAvatar
        v-for="(avatar, index) in displayedAvatars"
        :key="index"
        :src="avatar.src"
        :alt="avatar.alt || ''"
        :initials="avatar.initials"
        size="sm"
        class="ring-2 ring-surface"
      />
    </div>

    <AText tag="span" variant="label-lg" class="text-on-surface-variant">
      <span class="font-semibold text-on-surface">{{ formattedCount }}</span>
      {{ activeUsers === 1 ? 'person' : 'people' }} active now
    </AText>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AAvatar from '~/components/atoms/AAvatar.vue'
import AText from '~/components/atoms/AText.vue'

export interface AvatarItem {
  src?: string
  alt?: string
  initials?: string
}

export interface MSocialProofProps {
  activeUsers: number
  avatars: AvatarItem[]
}

const props = defineProps<MSocialProofProps>()

const displayedAvatars = computed(() => {
  return props.avatars.slice(0, 5)
})

const formattedCount = computed(() => {
  if (props.activeUsers >= 1000) {
    return `${(props.activeUsers / 1000).toFixed(1)}k`
  }
  return props.activeUsers.toString()
})
</script>
