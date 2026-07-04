<template>
  <article
    class="group relative flex flex-col rounded-xl border border-outline-variant bg-surface overflow-hidden transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none cursor-pointer"
    tabindex="0"
    role="link"
    :aria-label="`${title} - ${category}`"
    @click="openLink"
    @keydown.enter="openLink"
    @keydown.space.prevent="openLink"
  >
    <div class="relative w-full h-40 overflow-hidden">
      <AImage
        :src="thumbnail || ''"
        :alt="title"
        :error="imageError"
        fallback-classes="w-full h-40 rounded-none"
        class="w-full h-full object-cover"
        @error="imageError = true"
      />
    </div>

    <div class="flex flex-col gap-2 p-4">
      <div class="flex items-center justify-between gap-2">
        <AText tag="h3" variant="title-md" class="line-clamp-1">
          {{ title }}
        </AText>
        <ABadge variant="secondary" :aria-label="`Category: ${category}`">
          {{ category }}
        </ABadge>
      </div>

      <AText tag="p" variant="body-sm" class="text-on-surface-variant">
        {{ truncatedDescription }}
      </AText>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AImage from '~/components/atoms/AImage.vue'
import AText from '~/components/atoms/AText.vue'
import ABadge from '~/components/atoms/ABadge.vue'

export interface MResourceCardProps {
  title: string
  description: string
  category: string
  url: string
  thumbnail?: string
}

const props = defineProps<MResourceCardProps>()

const imageError = ref(false)

const truncatedDescription = computed(() => {
  if (props.description.length <= 150) return props.description
  return props.description.slice(0, 150) + '\u2026'
})

function openLink() {
  window.open(props.url, '_blank', 'noopener,noreferrer')
}
</script>
