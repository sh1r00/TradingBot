<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResourcesStore } from '~/stores/resources'

const { t } = useI18n()
const resourcesStore = useResourcesStore()

// Sort resources by displayOrder (admin-defined order) for leaderboard
const topResources = computed(() => {
  const links = resourcesStore.links || []
  return [...links]
    .filter(link => link.isPublished !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, 5)
})

const hasResources = computed(() => topResources.value.length > 0)

onMounted(() => {
  resourcesStore.fetchAll()
})
</script>

<template>
  <section
    class="py-12 px-4 bg-surface"
    aria-labelledby="leaderboard-heading"
  >
    <div class="max-w-4xl mx-auto">
      <h2
        id="leaderboard-heading"
        class="text-2xl font-bold text-on-surface mb-6 text-center"
      >
        {{ t('viral.leaderboardTitle') }}
      </h2>

      <!-- Loading state -->
      <div
        v-if="resourcesStore.isLoading"
        class="space-y-3"
        aria-busy="true"
        :aria-label="t('accessibility.loading')"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-4 h-16 bg-surface-variant rounded-xl animate-pulse px-4"
          aria-hidden="true"
        >
          <div class="w-8 h-8 rounded-full bg-surface-variant" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-surface-variant rounded w-3/4" />
            <div class="h-3 bg-surface-variant rounded w-1/2" />
          </div>
          <div class="w-6 h-6 rounded-full bg-surface-variant" />
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="resourcesStore.error"
        class="text-center py-8"
        role="alert"
      >
        <p class="text-error text-lg mb-2">{{ t('resources.error') }}</p>
        <p class="text-on-surface-variant mb-6">{{ resourcesStore.error }}</p>
        <AButton
          variant="primary"
          @click="resourcesStore.fetchAll()"
        >
          {{ t('common.retry') }}
        </AButton>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!hasResources"
        class="text-center py-12"
      >
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant mb-4"
          aria-hidden="true"
        >
          <span class="text-3xl">🏆</span>
        </div>
        <h3 class="text-lg font-semibold text-on-surface mb-2">
          {{ t('resources.noResourcesTitle') }}
        </h3>
        <p class="text-on-surface-variant max-w-md mx-auto">
          {{ t('resources.noResourcesDescription') }}
        </p>
      </div>

      <!-- Leaderboard list -->
      <ol
        v-else
        class="space-y-3"
        role="list"
        :aria-label="t('viral.leaderboardTitle')"
      >
        <li
          v-for="(resource, index) in topResources"
          :key="resource.id"
          class="group flex items-center gap-4 bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors duration-150"
        >
          <!-- Rank indicator -->
          <span
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-150"
            :class="{
              'bg-primary text-on-primary shadow-md': index === 0,
              'bg-secondary text-on-secondary': index === 1,
              'bg-tertiary text-on-tertiary': index === 2,
              'bg-surface-variant text-on-surface-variant': index >= 3,
            }"
            :aria-label="`Rank ${index + 1} of ${topResources.length}`"
          >
            {{ index + 1 }}
          </span>

          <!-- Resource content -->
          <div class="flex-1 min-w-0">
            <p
              class="font-medium text-on-surface truncate group-hover:text-primary transition-colors"
            >
              {{ resource.title }}
            </p>
            <p class="text-sm text-on-surface-variant truncate">
              {{ resource.category || t('resources.categories.general') }}
            </p>
          </div>

          <!-- External link icon -->
          <ALink
            :href="resource.url"
            :aria-label="`${resource.title} - ${t('common.openInNewTab', { resource: resource.title })}`"
            external
          >
            <AIcon
              name="open_in_new"
              size="sm"
              decorative
            />
          </ALink>
        </li>
      </ol>
    </div>
  </section>
</template>
