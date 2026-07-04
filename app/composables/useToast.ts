import { useToastStore } from '~/stores/toast'

/**
 * Convenience composable for triggering toast notifications.
 * Wraps the toast Pinia store to provide an ergonomic API
 * for components to display success, error, warning, and info toasts.
 *
 * @example
 * const toast = useToast()
 * toast.success('Link saved successfully')
 * toast.error('Network error', 'Check your connection and retry')
 */
export function useToast() {
  const store = useToastStore()

  function success(message: string): void {
    store.add({ type: 'success', message, duration: 5000 })
  }

  function error(message: string, action?: string): void {
    store.add({ type: 'error', message, action, duration: 5000 })
  }

  function warning(message: string): void {
    store.add({ type: 'warning', message, duration: 5000 })
  }

  function info(message: string): void {
    store.add({ type: 'info', message, duration: 5000 })
  }

  return { success, error, warning, info }
}
