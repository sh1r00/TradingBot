import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'resource-links'

const SEED_RESOURCES: Omit<ResourceLink, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Freelance Platforms — Upwork & Fiverr',
    description: 'Start earning by offering your skills on the world\'s largest freelance marketplaces. From writing to programming, find clients worldwide.',
    category: 'Freelancing',
    url: 'https://www.upwork.com',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Affiliate Marketing with Amazon Associates',
    description: 'Earn commissions by promoting products you love. Amazon\'s affiliate program is one of the easiest ways to start making money online.',
    category: 'Affiliate Marketing',
    url: 'https://affiliate-program.amazon.com',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Sell Digital Products on Gumroad',
    description: 'Create and sell ebooks, courses, templates, and digital downloads. No inventory, no shipping — just pure profit from your creativity.',
    category: 'Digital Products',
    url: 'https://gumroad.com',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'YouTube Content Creation',
    description: 'Build a channel around your passion and earn through ads, sponsorships, and memberships. YouTube pays creators billions every year.',
    category: 'Content Creation',
    url: 'https://www.youtube.com/creators',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Stock Photography — Shutterstock',
    description: 'Turn your photos into passive income. Upload once and earn every time someone downloads your images from the world\'s largest stock platform.',
    category: 'Passive Income',
    url: 'https://www.shutterstock.com/contributors',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Print on Demand with Printful',
    description: 'Design custom products and sell them without holding inventory. Printful handles printing, shipping, and customer service.',
    category: 'E-Commerce',
    url: 'https://www.printful.com',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Online Courses — Teachable',
    description: 'Package your knowledge into online courses and earn while you sleep. Teachable makes it easy to create, market, and sell courses.',
    category: 'Digital Products',
    url: 'https://teachable.com',
    thumbnail: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Remote Customer Support Jobs',
    description: 'Work from home providing customer support for leading companies. Flexible hours and no commute required.',
    category: 'Remote Work',
    url: 'https://weworkremotely.com',
    thumbnail: null,
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Blogging with Medium Partner Program',
    description: 'Write articles on topics you care about and earn based on reader engagement. Medium pays writers monthly through their partner program.',
    category: 'Content Creation',
    url: 'https://medium.com/creators',
    thumbnail: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Real Estate Crowdfunding — Fundrise',
    description: 'Invest in real estate with as little as $10. Fundrise lets you access institutional-quality real estate investments from your phone.',
    category: 'Investing',
    url: 'https://fundrise.com',
    thumbnail: null,
    displayOrder: 0,
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
