/**
 * Composable for managing locale-aware <head> meta tags.
 * Sets <html lang>, hreflang alternate links, and document direction
 * based on the active i18n locale.
 *
 * Should be called in app.vue or the default layout.
 */
export function useLocaleHead() {
  const { locale, locales } = useI18n()
  const config = useRuntimeConfig()

  const baseUrl = computed(() => config.public.baseUrl as string)

  const dir = computed(() => {
    // All supported locales (en, es, am) use LTR direction.
    // Amharic (Ge'ez script) is written left-to-right.
    return 'ltr'
  })

  const hreflangLinks = computed(() => {
    return locales.value.map((loc) => {
      const code = typeof loc === 'string' ? loc : loc.code
      const href =
        code === 'en' ? baseUrl.value : `${baseUrl.value}/${code}`

      return {
        rel: 'alternate',
        hreflang: code,
        href,
      }
    })
  })

  useHead({
    htmlAttrs: {
      lang: locale,
      dir,
    },
    link: hreflangLinks,
  })
}
