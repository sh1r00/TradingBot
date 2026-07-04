<template>
  <div class="flex flex-col gap-2 p-4 rounded-xl border border-outline-variant bg-surface">
    <AText tag="h3" variant="title-md">
      {{ title }}
    </AText>

    <div
      v-if="expanded"
      class="text-on-surface-variant text-sm prose-content"
      v-html="renderedContent"
    />

    <AText v-else tag="p" variant="body-sm" class="text-on-surface-variant">
      {{ preview }}
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
import { ref, computed } from 'vue'
import AText from '~/components/atoms/AText.vue'
import AButton from '~/components/atoms/AButton.vue'

export interface MContentPreviewProps {
  title: string
  preview: string
  fullContent: string
}

const props = defineProps<MContentPreviewProps>()

const expanded = ref(false)

/**
 * Simple markdown-to-HTML renderer for article content.
 * Handles: headings (##), bold (**), bullet lists (*), paragraphs.
 */
function renderMarkdown(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      // Heading
      if (line.match(/^### (.+)/)) {
        return `<h4 class="font-semibold text-on-surface mt-4 mb-1">${line.replace(/^### /, '')}</h4>`
      }
      if (line.match(/^## (.+)/)) {
        return `<h3 class="font-bold text-on-surface mt-4 mb-2">${line.replace(/^## /, '')}</h3>`
      }
      // Bold text
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface">$1</strong>')
      // List items
      if (line.match(/^- (.+)/)) {
        return `<li class="ml-4 mb-1 list-disc">${line.replace(/^- /, '')}</li>`
      }
      // Empty line
      if (line.trim() === '') {
        return '<br />'
      }
      // Wrap bullet lists
      return `<p class="mb-2">${line}</p>`
    })
    .join('\n')
    // Wrap adjacent <li> elements in <ul>
    .replace(/((?:<li class="ml-4 mb-1 list-disc">[^<]*<\/li>\n?)+)/g, '<ul class="mb-2">$1</ul>')
}

const renderedContent = computed(() => renderMarkdown(props.fullContent))
</script>

<style scoped>
.prose-content :deep(h3) {
  font-weight: 700;
  color: var(--color-on-surface);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.prose-content :deep(h4) {
  font-weight: 600;
  color: var(--color-on-surface);
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}
.prose-content :deep(strong) {
  font-weight: 600;
  color: var(--color-on-surface);
}
.prose-content :deep(ul) {
  padding-left: 1rem;
}
.prose-content :deep(p) {
  margin-bottom: 0.5rem;
}
</style>
