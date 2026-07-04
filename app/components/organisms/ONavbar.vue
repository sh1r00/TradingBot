<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'
import { useAuthStore } from '~/stores/auth'
import { useI18n } from 'vue-i18n'

const darkMode = useDarkModeStore()
const auth = useAuthStore()
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()

const isMenuOpen = ref(false)
const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

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

const emit = defineEmits<{
  navigate: []
}>()

watch(locale, () => {
  emit('navigate')
})
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-surface border-b border-outline-variant transition-all duration-300"
    :class="isScrolled ? 'shadow-md' : ''"
    role="banner"
  >
    <nav
      class="max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300"
      :class="isScrolled ? 'h-14' : 'h-16'"
      aria-label="Primary"
    >
      <!-- Logo / Brand -->
      <NuxtLink
        :to="localePath('/')"
        class="font-bold text-primary hover:text-primary-container transition-all duration-300 rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        :class="isScrolled ? 'text-base' : 'text-lg'"
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
      </ul>

      <!-- Right side controls -->
      <div class="flex items-center gap-2">
        <!-- Auth links -->
        <template v-if="auth.isAuthenticated">
          <span class="text-sm text-on-surface-variant hidden md:inline">
            {{ auth.currentUser?.name }}
          </span>
          <button
            class="text-sm text-on-surface-variant hover:text-primary transition-colors hidden md:inline px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="auth.logout()"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <NuxtLink
            :to="localePath('/login')"
            class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            :to="localePath('/signup')"
            class="text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 rounded-full px-4 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Sign Up
          </NuxtLink>
        </template>
        <!-- Language switcher -->
        <MLanguageSwitcher
          :current-locale="locale"
          :locales="availableLocales"
          @select="switchLocale"
        />

        <!-- Dark mode toggle (ClientOnly to avoid hydration mismatch) -->
        <ClientOnly>
          <button
            class="p-2 rounded-full hover:bg-surface-variant transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
          class="md:hidden p-2 rounded-full hover:bg-surface-variant transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
