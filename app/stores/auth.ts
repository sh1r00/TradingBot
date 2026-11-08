/**
 * Auth Store — Supabase Auth (real auth).
 *
 * Replaces the old localStorage auth shim: no more plaintext passwords or a
 * bypassable `localStorage['admin-auth']` flag. All credential checks happen
 * against Supabase Auth. When Supabase is not configured (no URL / anon key),
 * `isConfigured` is false and every auth method returns `reason: 'not-configured'`
 * so the UI can show an honest message instead of pretending to log in.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { useSupabase } from '~/composables/useSupabase'

export interface AuthUser {
  id: string
  email: string
  name: string
  joinedAt: string
}

export type AuthNotConfigured = { ok: false; reason: 'not-configured' }

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'invalid-credentials' }
  | { ok: false; reason: 'error'; message: string }
  | AuthNotConfigured

export type SignupResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'email-exists' }
  | { ok: false; reason: 'error'; message: string }
  | AuthNotConfigured

export type ResetRequestResult =
  | { ok: true }
  | { ok: false; reason: 'error'; message: string }
  | AuthNotConfigured

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    name: (user.user_metadata?.name as string) || user.email || '',
    joinedAt: user.created_at || new Date().toISOString(),
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<{ token: string; user: AuthUser } | null>(null)
  const initialized = ref(false)
  const loading = ref(false)

  const isConfigured = computed(() => useSupabase() !== null)
  const isAuthenticated = computed(() => !!session.value?.token)
  const currentUser = computed(() => session.value?.user || null)

  function applySession(s: { access_token: string; user: User } | null): void {
    if (s?.user) {
      session.value = { token: s.access_token, user: toAuthUser(s.user) }
    } else {
      session.value = null
    }
  }

  async function initialize(): Promise<void> {
    if (initialized.value) return
    initialized.value = true
    const supabase = useSupabase()
    if (!supabase) return

    const { data } = await supabase.auth.getSession()
    applySession(data.session)

    supabase.auth.onAuthStateChange((_event, s) => applySession(s))
  }

  async function signup(email: string, password: string, name: string): Promise<SignupResult> {
    const supabase = useSupabase()
    if (!supabase) return { ok: false, reason: 'not-configured' }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      if (/already registered|already been registered/i.test(error.message)) {
        return { ok: false, reason: 'email-exists' }
      }
      return { ok: false, reason: 'error', message: error.message }
    }
    const user = data.user
    if (!user) return { ok: false, reason: 'error', message: 'Signup failed' }

    const authUser = toAuthUser(user)
    if (data.session) {
      session.value = { token: data.session.access_token, user: authUser }
    }
    return { ok: true, user: authUser }
  }

  async function login(email: string, password: string): Promise<LoginResult> {
    const supabase = useSupabase()
    if (!supabase) return { ok: false, reason: 'not-configured' }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) return { ok: false, reason: 'invalid-credentials' }

    const authUser = toAuthUser(data.session.user)
    session.value = { token: data.session.access_token, user: authUser }
    return { ok: true, user: authUser }
  }

  async function logout(): Promise<void> {
    const supabase = useSupabase()
    if (supabase) await supabase.auth.signOut()
    session.value = null
  }

  async function requestPasswordReset(email: string): Promise<ResetRequestResult> {
    const supabase = useSupabase()
    if (!supabase) return { ok: false, reason: 'not-configured' }

    const config = useRuntimeConfig()
    const redirectTo = `${config.public.baseUrl}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) return { ok: false, reason: 'error', message: error.message }
    return { ok: true }
  }

  async function resetPassword(newPassword: string): Promise<boolean> {
    const supabase = useSupabase()
    if (!supabase) return false
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return !error
  }

  return {
    session,
    initialized,
    loading,
    isConfigured,
    isAuthenticated,
    currentUser,
    initialize,
    signup,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
  }
})
