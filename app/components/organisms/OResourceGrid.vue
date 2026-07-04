<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResourcesStore } from '~/stores/resources'

const { t } = useI18n()
const resourcesStore = useResourcesStore()

// Group published resource links by category
const groupedResources = computed(() => {
  const groups = new Map<string, typeof resourcesStore.links>()
  
  for (const link of resourcesStore.links || []) {
    // Only show published links
    if (!link.isPublished) continue
    
    const category = link.category || t('resources.categories.general')
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(link)
  }
  
  // Sort links within each category by displayOrder
  for (const [category, links] of groups.entries()) {
    links.sort((a, b) => a.displayOrder - b.displayOrder)
  }
  
  return groups
})

// Check if any category has resources
const hasResources = computed(() => {
  for (const [category, links] of groupedResources.value.entries()) {
    if (links.length > 0) return true
  }
  return false
})

// Get empty state message for a category
const getCategoryEmptyMessage = (category: string): string => {
  return t('resources.emptyCategory', { category })
}

onMounted(() => {
  resourcesStore.fetchAll()
})
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="resources-heading"
  >
    <div class="max-w-7xl mx-auto">
      <h1
        id="resources-heading"
        class="text-3xl font-bold text-on-surface mb-8 text-center"
      >
        {{ t('resources.title') }}
      </h1>

      <!-- Loading state with aria-busy -->
      <div
        v-if="resourcesStore.isLoading"
        class="space-y-8"
        aria-busy="true"
        :aria-label="t('accessibility.loading')"
      >
        <div
          v-for="i in 3"
          :key="`skeleton-${i}`"
          class="space-y-3"
          aria-hidden="true"
        >
          <div class="h-6 w-48 bg-surface-variant rounded animate-pulse" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="j in 3"
              :key="`skeleton-${i}-${j}`"
              class="h-48 bg-surface-variant rounded-xl animate-pulse"
            />
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="resourcesStore.error"
        class="text-center py-12"
        role="alert"
      >
        <p class="text-error text-lg mb-4">{{ t('resources.error') }}</p>
        <p class="text-on-surface-variant mb-6">{{ resourcesStore.error }}</p>
        <AButton
          variant="primary"
          @click="resourcesStore.fetchAll()"
        >
          {{ t('common.retry') }}
        </AButton>
      </div>

      <!-- No resources found -->
      <div
        v-else-if="!hasResources"
        class="text-center py-16 px-4"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant mb-4">
          <span class="text-3xl">📚</span>
        </div>
        <h2 class="text-xl font-semibold text-on-surface mb-2">
          {{ t('resources.noResourcesTitle') }}
        </h2>
        <p class="text-on-surface-variant max-w-md mx-auto">
          {{ t('resources.noResourcesDescription') }}
        </p>
      </div>

      <!-- Grouped resources by category -->
      <div
        v-else
        class="space-y-12"
      >
        <div
          v-for="[category, links] in groupedResources"
          :key="category"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <h2
            class="text-2xl font-semibold text-on-surface mb-6 pb-2 border-b border-outline-variant"
          >
            {{ category }}
          </h2>

          <!-- Empty state for category -->
          <div
            v-if="links.length === 0"
            class="text-on-surface-variant text-center py-8 bg-surface-variant/30 rounded-xl"
            role="status"
            :aria-label="t('resources.emptyCategory', { category })"
          >
            <p>{{ getCategoryEmptyMessage(category) }}</p>
          </div>

          <!-- Resource links grid -->
          <ul
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            :aria-label="`${category} resources`"
          >
            <li
              v-for="link in links"
              :key="link.id"
            >
              <MResourceCard
                :title="link.title"
                :description="link.description"
                :category="category"
                :url="link.url"
                :thumbnail="link.thumbnail || ''"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
