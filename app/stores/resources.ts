import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'resource-links'

export interface ResourceLink {
  id: string
  /**
   * i18n slug. Present on the 6 seeded resources so their title / description /
   * category render via `$t('resources.items.<key>.*')` (en/es/am lockstep).
   * Absent on admin-created links, which store literal text instead.
   */
  key?: string
  /** Literal title — only used for admin-created links (seeded links use `key`). */
  title?: string
  /** Literal description — only used for admin-created links (seeded links use `key`). */
  description?: string
  /** Stable grouping value. Seeded links use the English category label; admin links use free text. */
  category: string
  /** Official, non-tracking URL (the working href). */
  url: string
  /**
   * Affiliate / tracking link.
   * PENDING: empty until the owner pastes their affiliate URL. The public `url`
   * remains the official, non-tracking href. Never invent affiliate IDs.
   */
  trackingUrl?: string
  thumbnail: string | null
  displayOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

/**
 * The 6 seeded money-making resources.
 * title / description are NOT stored here — they live in i18n
 * (`resources.items.<key>.*`) and render via $t(), keeping en/es/am in lockstep.
 * `url` is the official, non-tracking URL; `trackingUrl` is intentionally empty
 * until the owner supplies their affiliate tracking links.
 */
const SEED_RESOURCES: Omit<ResourceLink, 'id' | 'title' | 'description' | 'createdAt' | 'updatedAt'>[] = [
  {
    key: 'scrambly',
    category: 'Gaming',
    url: 'https://scrambly.io',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    key: 'webull',
    category: 'Investing',
    url: 'https://www.webull.com',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    key: 'mercor',
    category: 'AI Work',
    url: 'https://mercor.com',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 2,
    isPublished: true,
  },
  {
    key: 'upwork-fiverr',
    category: 'Freelancing',
    url: 'https://www.upwork.com',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 3,
    isPublished: true,
  },
  {
    key: 'amazon-associates',
    category: 'Affiliate Marketing',
    url: 'https://affiliate-program.amazon.com',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 4,
    isPublished: true,
  },
  {
    key: 'depop',
    category: 'Reselling',
    url: 'https://www.depop.com',
    trackingUrl: '', // PENDING: paste affiliate URL when available
    thumbnail: null,
    displayOrder: 5,
    isPublished: true,
  },
]

function seedResources(): ResourceLink[] {
  const now = new Date().toISOString()
  return SEED_RESOURCES.map((resource, index) => ({
    ...resource,
    id: `seed-${index}`,
    createdAt: now,
    updatedAt: now,
  }))
}

/**
 * Resource links store.
 * Manages CRUD operations for resource links persisted in localStorage.
 *
 * Requirements: 1.1–1.8
 */
export const useResourcesStore = defineStore('resources', () => {
  const links = ref<ResourceLink[]>([])
  const categories = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links.value))
  }

  function updateCategories(): void {
    const unique = new Set(links.value.map((link) => link.category))
    categories.value = [...unique]
  }

  function fetchAll(): void {
    isLoading.value = true
    error.value = null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        links.value = JSON.parse(stored)
      } else {
        links.value = seedResources()
        persist()
      }
      updateCategories()
    } catch (e) {
      error.value = 'Failed to load resources'
      links.value = []
    } finally {
      isLoading.value = false
    }
  }

  function create(data: Omit<ResourceLink, 'id' | 'createdAt' | 'updatedAt'>): void {
    // Validate required fields (admin-created links store literal text)
    if (!data.title || data.title.length < 3 || data.title.length > 100) {
      throw new Error('Title must be between 3 and 100 characters')
    }
    if (!data.description || data.description.length < 10 || data.description.length > 500) {
      throw new Error('Description must be between 10 and 500 characters')
    }
    if (!data.category) {
      throw new Error('Category is required')
    }
    if (!data.url || !isValidHttpsUrl(data.url) || data.url.length > 2048) {
      throw new Error('A valid HTTPS URL is required (max 2048 characters)')
    }

    const now = new Date().toISOString()
    const newLink: ResourceLink = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }

    links.value.push(newLink)
    updateCategories()
    persist()
  }

  function update(id: string, data: Partial<ResourceLink>): void {
    const index = links.value.findIndex((link) => link.id === id)
    if (index === -1) {
      throw new Error(`Resource link with id "${id}" not found`)
    }

    links.value[index] = {
      ...links.value[index],
      ...data,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    }

    updateCategories()
    persist()
  }

  function remove(id: string): void {
    links.value = links.value.filter((link) => link.id !== id)
    updateCategories()
    persist()
  }

  function reorder(category: string, orderedIds: string[]): void {
    orderedIds.forEach((linkId, index) => {
      const link = links.value.find((l) => l.id === linkId && l.category === category)
      if (link) {
        link.displayOrder = index
      }
    })
    persist()
  }

  return { links, categories, isLoading, error, fetchAll, create, update, delete: remove, reorder }
})

function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}
