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

      <!-- Bookmark toggle (retention loop) -->
      <button
        type="button"
        class="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-surface/90 backdrop-blur-sm text-on-surface hover:bg-surface shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :aria-pressed="isBookmarked"
        :aria-label="isBookmarked ? t('resources.removeBookmark') : t('resources.saveBookmark')"
        @click.stop.prevent="toggleBookmark"
        @keydown.stop
      >
        <AIcon
          :name="isBookmarked ? 'favorite' : 'favorite_border'"
          size="sm"
          decorative
        />
      </button>
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
import { useI18n } from 'vue-i18n'
import { useBookmarksStore } from '~/stores/bookmarks'
import AImage from '~/components/atoms/AImage.vue'
import AText from '~/components/atoms/AText.vue'
import ABadge from '~/components/atoms/ABadge.vue'
import AIcon from '~/components/atoms/AIcon.vue'

export interface MResourceCardProps {
  resourceId: string
  title: string
  description: string
  category: string
  url: string
  thumbnail?: string
}

const props = defineProps<MResourceCardProps>()

const { t } = useI18n()
const bookmarksStore = useBookmarksStore()

const imageError = ref(false)

const isBookmarked = computed(() => bookmarksStore.isBookmarked(props.resourceId))

const truncatedDescription = computed(() => {
  if (props.description.length <= 150) return props.description
  return props.description.slice(0, 150) + '\u2026'
})

function openLink() {
  window.open(props.url, '_blank', 'noopener,noreferrer')
}

function toggleBookmark() {
  bookmarksStore.toggle(props.resourceId)
}
</script>
