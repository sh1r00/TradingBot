/**
 * Auth gate composable — redirect to login if not authenticated.
 * Call `await requireAuth()` before running gated actions.
 *
 * NOTE: `initialize()` is async (Supabase session restore), so both helpers
 * await it before reading `isAuthenticated`.
 */
import { useAuthStore } from '~/stores/auth'

export function useAuthGate() {
  const auth = useAuthStore()
  const router = useRouter()
  const localePath = useLocalePath()

  /**
   * Returns true if authenticated, otherwise redirects to login.
   * Pass returnUrl to redirect back after login.
   */
  async function requireAuth(returnUrl?: string): Promise<boolean> {
    await auth.initialize()
    if (auth.isAuthenticated) return true

    const redirect = returnUrl || router.currentRoute.value.fullPath
    router.push(localePath(`/login?redirect=${encodeURIComponent(redirect)}`))
    return false
  }

  /**
   * Reactive auth check (does not redirect).
   */
  const isAuthenticated = computed(() => auth.isAuthenticated)

  return { requireAuth, isAuthenticated, auth }
}
