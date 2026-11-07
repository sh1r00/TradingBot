import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'resource-links'

const SEED_RESOURCES: Omit<ResourceLink, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Scrambly — Get Paid to Play Games',
    description: 'Earn cash and gift cards by playing games, testing apps, and completing quick offers. One of the easiest entry points into making money online in your spare time.',
    category: 'Gaming',
    url: 'https://scrambly.io',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Webull — Commission-Free Investing',
    description: 'Trade stocks, ETFs, and options with zero commissions and fractional shares. A beginner-friendly way to start building long-term wealth.',
    category: 'Investing',
    url: 'https://www.webull.com',
    thumbnail: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Mercor — Work in the AI Field',
    description: 'Get paid to train and evaluate AI models. Flexible, remote, technical-adjacent work that does not require a CS degree to start.',
    category: 'AI Work',
    url: 'https://mercor.com',
    thumbnail: null,
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Upwork & Fiverr — Freelancing',
    description: 'Sell your skills on the world\'s largest freelance marketplaces. Writing, design, programming, and more — set your own rates and find clients worldwide.',
    category: 'Freelancing',
    url: 'https://www.upwork.com',
    thumbnail: null,
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Amazon Associates — Affiliate Marketing',
    description: 'Earn commissions by promoting products you already use and love. Amazon\'s affiliate program is one of the lowest-friction ways to start earning online.',
    category: 'Affiliate Marketing',
    url: 'https://affiliate-program.amazon.com',
    thumbnail: null,
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Depop — Sell & Resell Items',
    description: 'Turn clothes, shoes, and collectibles you no longer use into cash. Reselling on Depop is a proven side income with zero upfront inventory cost.',
    category: 'Reselling',
    url: 'https://www.depop.com',
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

export interface ResourceLink {
  id: string
  title: string
  description: string
  category: string
  url: string
  thumbnail: string | null
  displayOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
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
    // Validate required fields
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
