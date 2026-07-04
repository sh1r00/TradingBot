<template>
  <ACard variant="outlined" padding="md">
    <div class="flex items-center gap-3">
      <div
        v-if="icon"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container"
      >
        <AIcon size="md" :decorative="true">
          {{ icon }}
        </AIcon>
      </div>

      <div class="flex flex-col gap-0.5">
        <AText tag="span" variant="headline-sm" class="text-on-surface">
          {{ value }}
        </AText>
        <AText tag="span" variant="body-sm" class="text-on-surface-variant">
          {{ label }}
        </AText>
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
import ACard from '~/components/atoms/ACard.vue'
import AText from '~/components/atoms/AText.vue'
import AIcon from '~/components/atoms/AIcon.vue'

export interface MStatCardProps {
  value: string | number
  label: string
  icon?: string
}

defineProps<MStatCardProps>()
</script>
