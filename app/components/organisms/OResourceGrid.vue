<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResourcesStore, type ResourceLink } from '~/stores/resources'
import { useBookmarksStore } from '~/stores/bookmarks'

const { t } = useI18n()
const resourcesStore = useResourcesStore()
const bookmarksStore = useBookmarksStore()

const showSavedOnly = ref(false)

/**
 * Resolve a resource's display text. Seeded resources (`key`) render from i18n
 * (`resources.items.<key>.*`); admin-created links fall back to literal text.
 */
function displayTitle(link: ResourceLink): string {
  return link.key ? t(`resources.items.${link.key}.title`) : (link.title || '')
}

function displayDescription(link: ResourceLink): string {
  return link.key ? t(`resources.items.${link.key}.description`) : (link.description || '')
}

function displayCategory(link: ResourceLink): string {
  return link.key ? t(`resources.items.${link.key}.category`) : (link.category || t('resources.categories.general'))
}

// Links to render, narrowed to bookmarked items when the "saved" filter is active.
const visibleLinks = computed(() => {
  const links = resourcesStore.links || []
  if (!showSavedOnly.value) return links
  return links.filter((link) => bookmarksStore.isBookmarked(link.id))
})

const hasBookmarks = computed(() => bookmarksStore.ids.length > 0)

// Group published resource links by category
const groupedResources = computed(() => {
  const groups = new Map<string, ResourceLink[]>()

  for (const link of visibleLinks.value) {
    // Only show published links
    if (!link.isPublished) continue

    const category = displayCategory(link)
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
  bookmarksStore.load()
  resourcesStore.fetchAll()
})
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="resources-heading"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1
          id="resources-heading"
          class="text-3xl font-bold text-on-surface text-center sm:text-left"
        >
          {{ t('resources.title') }}
        </h1>

        <!-- Saved / all filter -->
        <button
          type="button"
          class="inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-full text-sm font-medium bg-surface-variant text-on-surface-variant hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-pressed="showSavedOnly"
          @click="showSavedOnly = !showSavedOnly"
        >
          <AIcon
            :name="showSavedOnly ? 'favorite' : 'favorite_border'"
            size="sm"
            aria-hidden="true"
          />
          {{ showSavedOnly ? t('resources.showAll') : t('resources.savedOnly') }}
        </button>
      </div>

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

      <!-- Saved filter active, but nothing bookmarked -->
      <div
        v-else-if="showSavedOnly && !hasBookmarks"
        class="text-center py-16 px-4"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant mb-4">
          <AIcon name="favorite_border" class="text-on-surface-variant" aria-hidden="true" />
        </div>
        <h2 class="text-xl font-semibold text-on-surface mb-2">
          {{ t('resources.noSavedTitle') }}
        </h2>
        <p class="text-on-surface-variant max-w-md mx-auto">
          {{ t('resources.noSavedDescription') }}
        </p>
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
                :resource-id="link.id"
                :title="displayTitle(link)"
                :description="displayDescription(link)"
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
