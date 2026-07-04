<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'
import { useI18n } from 'vue-i18n'

const darkMode = useDarkModeStore()
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()

const isMenuOpen = ref(false)

const availableLocales = computed(() =>
  locales.value.filter((l) => (typeof l === 'string' ? l : l.code) !== locale.value)
)

const currentLocaleName = computed(() => {
  const current = locales.value.find((l) => (typeof l === 'string' ? l : l.code) === locale.value)
  return current ? (typeof current === 'string' ? current : current.name) : ''
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

async function switchLocale(code: string) {
  await setLocale(code as 'en' | 'es' | 'am')
  closeMenu()
}

// Emit navigation change event when locale changes
const emit = defineEmits<{
  navigate: []
}>()

watch(locale, () => {
  emit('navigate')
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-surface border-b border-outline-variant" role="banner">
    <nav
      class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"
      aria-label="Primary"
    >
      <!-- Logo / Brand -->
      <NuxtLink
        :to="localePath('/')"
        class="font-bold text-lg text-primary hover:text-primary-container transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {{ t('common.appName') }}
      </NuxtLink>

      <!-- Desktop nav links -->
      <ul class="hidden md:flex items-center gap-6 list-none" role="list">
        <li>
          <NuxtLink
            :to="localePath('/')"
            class="text-sm font-medium text-on-surface hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {{ t('nav.home') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/resources')"
            class="text-sm font-medium text-on-surface hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {{ t('nav.resources') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/admin')"
            class="text-sm font-medium text-on-surface hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {{ t('nav.admin') }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Right side controls -->
      <div class="flex items-center gap-2">
        <!-- Language switcher -->
        <MLanguageSwitcher
          :current-locale="currentLocaleName"
          :locales="availableLocales"
          @select="switchLocale"
        />

        <!-- Dark mode toggle (ClientOnly to avoid hydration mismatch) -->
        <ClientOnly>
          <button
            class="p-2 rounded-full hover:bg-surface-variant transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            :aria-label="darkMode.isDark ? t('nav.lightMode') : t('nav.darkMode')"
            :aria-pressed="darkMode.isDark"
            @click="darkMode.toggle()"
          >
            <AIcon
              :name="darkMode.isDark ? 'light_mode' : 'dark_mode'"
              class="text-on-surface"
            />
          </button>
        </ClientOnly>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden p-2 rounded-full hover:bg-surface-variant transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          :aria-label="isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <AIcon :name="isMenuOpen ? 'close' : 'menu'" class="text-on-surface" />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen"
      id="mobile-menu"
      class="md:hidden border-t border-outline-variant bg-surface"
    >
      <ul class="px-4 py-2 space-y-1 list-none" role="list">
        <li>
          <NuxtLink
            :to="localePath('/')"
            class="block px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-variant rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            @click="closeMenu"
          >
            {{ t('nav.home') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/resources')"
            class="block px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-variant rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            @click="closeMenu"
          >
            {{ t('nav.resources') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/admin')"
            class="block px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-variant rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            @click="closeMenu"
          >
            {{ t('nav.admin') }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>