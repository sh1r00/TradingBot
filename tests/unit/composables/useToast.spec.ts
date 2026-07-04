import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToast } from '~/composables/useToast'
import { useToastStore } from '~/stores/toast'

describe('useToast', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns success, error, warning, and info methods', () => {
    const toast = useToast()
    expect(toast.success).toBeTypeOf('function')
    expect(toast.error).toBeTypeOf('function')
    expect(toast.warning).toBeTypeOf('function')
    expect(toast.info).toBeTypeOf('function')
  })

  it('success() adds a success toast with 5000ms duration', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.success('Item saved')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[0].message).toBe('Item saved')
    expect(store.toasts[0].duration).toBe(5000)
  })

  it('error() adds an error toast with message and optional action', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.error('Network failed', 'Check your connection')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('error')
    expect(store.toasts[0].message).toBe('Network failed')
    expect(store.toasts[0].action).toBe('Check your connection')
    expect(store.toasts[0].duration).toBe(5000)
  })

  it('error() works without an action parameter', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.error('Something went wrong')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('error')
    expect(store.toasts[0].message).toBe('Something went wrong')
    expect(store.toasts[0].action).toBeUndefined()
  })

  it('warning() adds a warning toast with 5000ms duration', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.warning('Low storage')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('warning')
    expect(store.toasts[0].message).toBe('Low storage')
    expect(store.toasts[0].duration).toBe(5000)
  })

  it('info() adds an info toast with 5000ms duration', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.info('New version available')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('info')
    expect(store.toasts[0].message).toBe('New version available')
    expect(store.toasts[0].duration).toBe(5000)
  })

  it('multiple calls add multiple toasts to the store', () => {
    const toast = useToast()
    const store = useToastStore()

    toast.success('First')
    toast.info('Second')
    toast.warning('Third')

    expect(store.toasts).toHaveLength(3)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[1].type).toBe('info')
    expect(store.toasts[2].type).toBe('warning')
  })
})
