<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const toast = useToast()
const { t } = useI18n()

interface Tool {
  id: string
  title: string
  description: string
  icon: string
  type: 'calculator' | 'checklist' | 'template'
}

const tools: Tool[] = [
  {
    id: 'income-tracker',
    title: 'Income Tracker Template',
    description: 'A free spreadsheet template to track all your income streams in one place.',
    icon: 'table_chart',
    type: 'template',
  },
  {
    id: 'side-hustle-checklist',
    title: 'Side Hustle Launch Checklist',
    description: '20 essential steps to validate and launch your side hustle in 30 days.',
    icon: 'checklist',
    type: 'checklist',
  },
  {
    id: 'rate-calculator',
    title: 'Freelance Rate Calculator',
    description: 'Calculate the exact hourly rate you need to charge to hit your income goals.',
    icon: 'calculate',
    type: 'calculator',
  },
]

const expandedTool = ref<string | null>(null)

function toggleTool(id: string) {
  expandedTool.value = expandedTool.value === id ? null : id
}

function handleGetAccess(tool: Tool) {
  toast.success(t('toolkit.access') + ': ' + tool.title + ' unlocked! 🎉')
}
</script>

<template>
  <section
    class="py-12 px-4 bg-secondary-container"
    aria-labelledby="toolkit-heading"
  >
    <div class="max-w-4xl mx-auto">
      <h2
        id="toolkit-heading"
        class="text-2xl font-bold text-on-secondary-container mb-2 text-center"
      >
        {{ $t('toolkit.title') }}
      </h2>
      <p class="text-on-secondary-container/70 text-center mb-8">
        {{ $t('toolkit.subtitle') }}
      </p>

      <ul class="space-y-3" role="list">
        <li
          v-for="tool in tools"
          :key="tool.id"
          class="bg-surface rounded-2xl overflow-hidden"
        >
          <button
            class="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset min-h-[44px]"
            :aria-expanded="expandedTool === tool.id"
            :aria-controls="`tool-content-${tool.id}`"
            @click="toggleTool(tool.id)"
          >
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center"
              aria-hidden="true"
            >
              <AIcon :name="tool.icon" class="text-on-primary-container" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-on-surface">{{ tool.title }}</p>
              <p class="text-sm text-on-surface-variant capitalize">{{ tool.type }}</p>
            </div>
            <AIcon
              :name="expandedTool === tool.id ? 'expand_less' : 'expand_more'"
              class="text-on-surface-variant flex-shrink-0"
            />
          </button>

          <div
            :id="`tool-content-${tool.id}`"
            v-show="expandedTool === tool.id"
            class="px-5 pb-5"
          >
            <p class="text-on-surface-variant mb-4">{{ tool.description }}</p>

            <!-- Gated: redirect to login if not authenticated -->
            <NuxtLink
              v-if="!auth.isAuthenticated"
              to="/login"
              :aria-label="`Access ${tool.title}`"
              class="inline-flex items-center justify-center gap-2 min-h-11 min-w-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {{ $t('toolkit.access') }}
            </NuxtLink>
            <AButton
              v-else
              variant="filled"
              size="sm"
              :aria-label="`Access ${tool.title}`"
              @click="handleGetAccess(tool)"
            >
              {{ $t('toolkit.access') }}
            </AButton>
          </div>
        </li>
      </ul>

      <p v-if="!auth.isAuthenticated" class="text-xs text-center mt-6 text-on-secondary-container/60">
        <NuxtLink to="/login" class="text-primary hover:underline font-medium">
          Sign in
        </NuxtLink>
        to access your free tools
      </p>
    </div>
  </section>
</template>
