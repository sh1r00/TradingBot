/**
 * Auth gate composable — redirect to login if not authenticated.
 * Call requireAuth() before running gated actions.
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
  function requireAuth(returnUrl?: string): boolean {
    auth.initialize()
    if (auth.isAuthenticated) return true

    const redirect = returnUrl || router.currentRoute.value.fullPath
    router.push(localePath(`/login?redirect=${encodeURIComponent(redirect)}`))
    return false
  }

  /**
   * Returns just the auth check without redirect.
   */
  const isAuthenticated = computed(() => {
    auth.initialize()
    return auth.isAuthenticated
  })

  return { requireAuth, isAuthenticated, auth }
}
