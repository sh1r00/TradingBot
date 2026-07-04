<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()

const currentYear = new Date().getFullYear()

// Prepare locale options for language switcher
const localeOptions = computed(() =>
  locales.value.map((l) => {
    const code = typeof l === 'string' ? l : l.code
    const name = typeof l === 'string' ? l : l.name
    return { code, name }
  })
)

// Current locale code (not name) for the switcher
const currentLocaleCode = computed(() => locale.value)

// Handle locale change
async function handleLocaleChange(code: string) {
  await setLocale(code)
}
</script>

<template>
  <footer
    class="border-t border-outline-variant bg-surface-variant mt-auto"
    :aria-label="t('accessibility.siteFooter')"
  >
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Brand and tagline -->
        <div class="flex flex-col items-center md:items-start gap-2">
          <p class="font-bold text-on-surface">{{ t('common.appName') }}</p>
          <p class="text-sm text-on-surface-variant">{{ t('footer.tagline') }}</p>
        </div>

        <!-- Navigation links -->
        <nav :aria-label="t('footer.navigation')">
          <ul class="flex flex-wrap gap-4 list-none justify-center" role="list">
            <li>
              <NuxtLink
                :to="localePath('/')"
                class="text-sm text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/resources')"
                class="text-sm text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {{ t('nav.resources') }}
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://example.com/privacy"
                class="text-sm text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('footer.privacy') }}
              </a>
            </li>
            <li>
              <a
                href="https://example.com/terms"
                class="text-sm text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('footer.terms') }}
              </a>
            </li>
            <li>
              <a
                href="https://example.com/contact"
                class="text-sm text-on-surface-variant hover:text-primary transition-colors rounded px-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('footer.contact') }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- Language switcher and copyright -->
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- Language attribution -->
          <div class="flex items-center gap-2" :aria-label="t('footer.language')">
            <span class="text-sm text-on-surface-variant whitespace-nowrap">
              {{ t('footer.language') }}:
            </span>
            <MLanguageSwitcher
              :current-locale="currentLocaleCode"
              :locales="localeOptions"
              @select="handleLocaleChange"
            />
          </div>

          <!-- Copyright -->
          <p class="text-sm text-on-surface-variant text-center md:text-right">
            &copy; {{ currentYear }} {{ t('common.appName') }}
          </p>

          <!-- Admin cog (discreet, no label) -->
          <NuxtLink
            :to="localePath('/admin')"
            :aria-label="$t('nav.admin')"
            class="p-1.5 rounded-full hover:bg-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Admin"
          >
            <AIcon name="settings" size="sm" class="text-on-surface-variant" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
