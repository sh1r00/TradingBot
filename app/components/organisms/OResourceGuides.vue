<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResourcesStore, type ResourceLink } from '~/stores/resources'
import { useAffiliateLinks } from '~/composables/useAffiliateLinks'

const { t } = useI18n()
const resourcesStore = useResourcesStore()
const { hrefFor } = useAffiliateLinks()

// Only seeded resources (`key`) carry the 3-part blog guide content
// (blogHowItWorks / blogHowToStart / blogExpectations) in i18n.
const guideResources = computed(() =>
  (resourcesStore.links || [])
    .filter((link) => link.key && link.isPublished !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
)

function guideTitle(link: ResourceLink): string {
  return link.key ? t(`resources.items.${link.key}.title`) : (link.title || '')
}

function guideSection(
  link: ResourceLink,
  section: 'blogHowItWorks' | 'blogHowToStart' | 'blogExpectations',
): string {
  return link.key ? t(`resources.items.${link.key}.${section}`) : ''
}

onMounted(() => {
  resourcesStore.fetchAll()
})
</script>

<template>
  <section class="py-12 px-4" aria-labelledby="guides-heading">
    <div class="max-w-3xl mx-auto">
      <h2
        id="guides-heading"
        class="text-2xl font-bold text-on-surface mb-2 text-center"
      >
        {{ t('resources.guidesTitle') }}
      </h2>
      <p class="text-on-surface-variant text-center mb-10">
        {{ t('resources.guidesSubtitle') }}
      </p>

      <p
        v-if="guideResources.length === 0"
        class="text-center text-on-surface-variant py-8"
      >
        {{ t('resources.noResourcesTitle') }}
      </p>

      <div v-else class="space-y-6">
        <article
          v-for="link in guideResources"
          :key="link.id"
          class="rounded-2xl border border-outline-variant bg-surface overflow-hidden"
        >
          <details class="group">
            <summary
              class="flex items-center justify-between gap-4 cursor-pointer select-none list-none px-6 py-5 font-semibold text-on-surface hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset min-h-[44px] [&::-webkit-details-marker]:hidden"
            >
              <span>{{ guideTitle(link) }}</span>
              <AIcon
                name="expand_more"
                class="text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div class="px-6 pb-6 space-y-6">
              <div>
                <h3 class="text-base font-semibold text-primary mb-1">
                  {{ t('resources.howItWorks') }}
                </h3>
                <p class="text-on-surface-variant text-sm leading-relaxed">
                  {{ guideSection(link, 'blogHowItWorks') }}
                </p>
              </div>
              <div>
                <h3 class="text-base font-semibold text-primary mb-1">
                  {{ t('resources.howToStart') }}
                </h3>
                <p class="text-on-surface-variant text-sm leading-relaxed">
                  {{ guideSection(link, 'blogHowToStart') }}
                </p>
              </div>
              <div>
                <h3 class="text-base font-semibold text-primary mb-1">
                  {{ t('resources.expectations') }}
                </h3>
                <p class="text-on-surface-variant text-sm leading-relaxed">
                  {{ guideSection(link, 'blogExpectations') }}
                </p>
              </div>

              <a
                :href="hrefFor(link)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 min-h-11 px-5 py-2 rounded-full bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary no-underline"
                :aria-label="t('resources.visitSite', { title: guideTitle(link) })"
              >
                {{ t('resources.visitSite', { title: guideTitle(link) }) }}
              </a>
            </div>
          </details>
        </article>
      </div>
    </div>
  </section>
</template>
