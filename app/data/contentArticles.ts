import { contentArticles as en } from './contentArticles.en'
import { contentArticles as es } from './contentArticles.es'
import { contentArticles as am } from './contentArticles.am'

export interface ContentArticle {
  id: string
  title: string
  summary: string
  category: string
  article: string
}

const BY_LOCALE: Record<string, ContentArticle[]> = { en, es, am }

/**
 * Get the content articles for the active locale.
 * Falls back to English when a locale has no translation.
 */
export function getContentArticles(locale = 'en'): ContentArticle[] {
  return BY_LOCALE[locale] || en
}

/**
 * Get a single content article by its ID for the given locale.
 */
export function getContentArticleById(id: string, locale = 'en'): ContentArticle | undefined {
  return getContentArticles(locale).find((a) => a.id === id)
}
