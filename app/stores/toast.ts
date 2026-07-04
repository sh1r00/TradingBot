import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  action?: string
  duration: number
  remainingTime: number
  isPaused: boolean
}

const MAX_VISIBLE = 3
const TICK_INTERVAL = 100

/**
 * Toast notification store.
 * Manages the toast queue with a max of 3 visible toasts,
 * auto-dismiss timers with pause/resume support.
 *
 * Requirements: 7.1–7.8
 */
export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  const timers = new Map<string, ReturnType<typeof setInterval>>()

  function startTimer(id: string): void {
    // Clear any existing timer for this id
    clearTimer(id)

    const interval = setInterval(() => {
      const toast = toasts.value.find((t) => t.id === id)
      if (!toast) {
        clearTimer(id)
        return
      }

      if (toast.isPaused) return

      toast.remainingTime -= TICK_INTERVAL

      if (toast.remainingTime <= 0) {
        remove(id)
      }
    }, TICK_INTERVAL)

    timers.set(id, interval)
  }

  function clearTimer(id: string): void {
    const timer = timers.get(id)
    if (timer) {
      clearInterval(timer)
      timers.delete(id)
    }
  }

  function add(toast: Omit<Toast, 'id' | 'remainingTime' | 'isPaused'>): void {
    const newToast: Toast = {
      ...toast,
      id: crypto.randomUUID(),
      remainingTime: toast.duration,
      isPaused: false,
    }

    // Evict oldest toast if max visible reached
    if (toasts.value.length >= MAX_VISIBLE) {
      const oldest = toasts.value[0]
      remove(oldest.id)
    }

    toasts.value.push(newToast)
    startTimer(newToast.id)
  }

  function remove(id: string): void {
    clearTimer(id)
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function pause(id: string): void {
    const toast = toasts.value.find((t) => t.id === id)
    if (toast) {
      toast.isPaused = true
    }
  }

  function resume(id: string): void {
    const toast = toasts.value.find((t) => t.id === id)
    if (toast) {
      toast.isPaused = false
    }
  }

  return { toasts, add, remove, pause, resume }
})
