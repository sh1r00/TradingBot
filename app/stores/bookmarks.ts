/**
 * Bookmarks Store — localStorage-backed resource bookmarks (retention loop).
 *
 * Persists the set of bookmarked resource IDs to localStorage so a user's
 * "saved" list survives reloads and revisits. Client-only: `load()` touches
 * localStorage and must be called from `onMounted` (never during SSR setup).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'resource-bookmarks'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const ids = ref<string[]>([])

  /** Reactive Set view — used by components via `bookmarkedIds.has(id)`. */
  const bookmarkedIds = computed<Set<string>>(() => new Set(ids.value))

  function load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      ids.value = raw ? (JSON.parse(raw) as string[]) : []
      if (!Array.isArray(ids.value)) ids.value = []
    } catch {
      ids.value = []
    }
  }

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  function isBookmarked(id: string): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: string): void {
    const index = ids.value.indexOf(id)
    if (index === -1) {
      ids.value.push(id)
    } else {
      ids.value.splice(index, 1)
    }
    persist()
  }

  return { ids, bookmarkedIds, load, persist, isBookmarked, toggle }
})
