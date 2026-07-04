/**
 * SEO helper utilities for generating consistent page meta tags.
 *
 * @module utils/seo
 */

const DEFAULT_DESCRIPTION =
  'Discover curated, vetted money-making resources and tools. Free calculators, checklists, and expert-selected opportunities.'

const DEFAULT_OG_IMAGE = '/og-image.png'

/**
 * Generates a page title with optional site suffix.
 *
 * @param title - The page-specific title
 * @param includeSuffix - Whether to append site name (default: true)
 * @returns Formatted page title
 */
export function generateTitle(title?: string, includeSuffix = true): string {
  const siteName = 'Money Conversion SPA'
  if (!title) return siteName
  return includeSuffix ? `${title} - ${siteName}` : title
}

/**
 * Generates meta description, truncated to 160 characters.
 *
 * @param description - The page-specific description
 * @returns Safe meta description
 */
export function generateDescription(description?: string): string {
  const text = description || DEFAULT_DESCRIPTION
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
}

/**
 * Generates absolute OG image URL.
 *
 * @param baseUrl - The site base URL
 * @param imagePath - Optional custom image path (default: /og-image.png)
 * @returns Absolute OG image URL
 */
export function generateOgImageUrl(baseUrl: string, imagePath?: string): string {
  const path = imagePath || DEFAULT_OG_IMAGE
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

/**
 * Generates canonical URL for a given path.
 *
 * @param baseUrl - The site base URL
 * @param path - The page path (e.g., '/resources')
 * @returns Canonical URL string
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

/**
 * Returns a complete set of SEO meta properties for useSeoMeta().
 *
 * @param options - Page-specific SEO options
 * @param baseUrl - The site base URL from runtimeConfig
 * @returns Object with all SEO meta properties
 */
export function buildPageMeta(
  options: {
    title?: string
    description?: string
    ogImage?: string
    path?: string
    ogType?: string
  },
  baseUrl: string,
) {
  const title = generateTitle(options.title)
  const description = generateDescription(options.description)
  const ogImage = generateOgImageUrl(baseUrl, options.ogImage)
  const url = options.path ? generateCanonicalUrl(baseUrl, options.path) : baseUrl

  return {
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogType: (options.ogType || 'website') as 'website' | 'article',
    ogUrl: url,
    ogImage,
  }
}
