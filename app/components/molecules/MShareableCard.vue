<template>
  <div class="flex flex-col gap-3 p-4 rounded-xl border border-outline-variant bg-surface">
    <AText tag="h3" variant="title-md">
      {{ title }}
    </AText>

    <AText tag="p" variant="body-sm" class="text-on-surface-variant">
      {{ description }}
    </AText>

    <div class="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant">
      <AText tag="span" variant="body-sm" class="text-on-surface-variant truncate max-w-48">
        {{ url }}
      </AText>

      <AButton
        variant="tonal"
        size="sm"
        :aria-label="`Copy link for ${title}`"
        @click="handleCopy"
      >
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AText from '~/components/atoms/AText.vue'
import AButton from '~/components/atoms/AButton.vue'

export interface MShareableCardProps {
  title: string
  description: string
  url: string
}

const props = defineProps<MShareableCardProps>()

const emit = defineEmits<{
  copy: [url: string]
}>()

const copied = ref(false)

function handleCopy() {
  emit('copy', props.url)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
