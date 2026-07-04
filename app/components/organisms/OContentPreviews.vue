<script setup lang="ts">
interface ContentItem {
  id: string
  title: string
  summary: string
  category: string
}

const items: ContentItem[] = [
  { id: '1', title: 'The Complete Guide to Freelancing', summary: 'How to land your first client in 30 days using LinkedIn and cold outreach.', category: 'Freelancing' },
  { id: '2', title: 'Passive Income Blueprint', summary: 'Build a portfolio of revenue streams that generate income around the clock.', category: 'Investing' },
  { id: '3', title: 'E-Commerce Starter Kit', summary: 'Launch a profitable online store in a weekend with zero inventory.', category: 'E-Commerce' },
]

const expandedId = ref<string | null>(null)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <section
    class="py-12 px-4 bg-surface-container"
    aria-labelledby="content-previews-heading"
  >
    <div class="max-w-4xl mx-auto">
      <h2
        id="content-previews-heading"
        class="text-2xl font-bold text-on-surface mb-6 text-center"
      >
        {{ $t('content.previewsTitle') }}
      </h2>

      <ul class="space-y-3" role="list">
        <li
          v-for="item in items"
          :key="item.id"
          class="bg-surface rounded-2xl overflow-hidden"
        >
          <button
            class="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset min-h-[44px]"
            :aria-expanded="expandedId === item.id"
            :aria-controls="`preview-content-${item.id}`"
            @click="toggle(item.id)"
          >
            <div class="flex-1">
              <p class="font-semibold text-on-surface">{{ item.title }}</p>
              <ABadge :label="item.category" class="mt-1" />
            </div>
            <AIcon
              :name="expandedId === item.id ? 'expand_less' : 'expand_more'"
              class="text-on-surface-variant flex-shrink-0"
            />
          </button>

          <div
            :id="`preview-content-${item.id}`"
            v-show="expandedId === item.id"
            class="px-5 pb-5"
          >
            <p class="text-on-surface-variant mb-3">{{ item.summary }}</p>
            <MContentPreview :item="item" />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
