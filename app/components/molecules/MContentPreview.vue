<template>
  <div class="flex flex-col gap-2 p-4 rounded-xl border border-outline-variant bg-surface">
    <AText tag="h3" variant="title-md">
      {{ title }}
    </AText>

    <AText tag="p" variant="body-sm" class="text-on-surface-variant">
      {{ expanded ? fullContent : preview }}
    </AText>

    <AButton
      variant="text"
      size="sm"
      :aria-expanded="expanded"
      :aria-label="expanded ? `Collapse ${title}` : `Expand ${title}`"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show Less' : 'Read More' }}
    </AButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AText from '~/components/atoms/AText.vue'
import AButton from '~/components/atoms/AButton.vue'

export interface MContentPreviewProps {
  title: string
  preview: string
  fullContent: string
}

defineProps<MContentPreviewProps>()

const expanded = ref(false)
</script>
