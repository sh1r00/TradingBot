/**
 * Auth Store — localStorage-based authentication for static PWA.
 * No backend required. Users persist in localStorage.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'money_auth'
const USERS_KEY = 'money_users'
const RESET_TOKENS_KEY = 'money_reset_tokens'

export interface AuthUser {
  id: string
  email: string
  name: string
  joinedAt: string
}

interface StoredUser extends AuthUser {
  password: string
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession(): { token: string; user: AuthUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session: { token: string; user: AuthUser } | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function loadResetTokens(): Record<string, { email: string; createdAt: number }> {
  try {
    const raw = localStorage.getItem(RESET_TOKENS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveResetTokens(tokens: Record<string, { email: string; createdAt: number }>): void {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens))
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<{ token: string; user: AuthUser } | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!session.value?.token)
  const currentUser = computed(() => session.value?.user || null)

  function initialize(): void {
    if (initialized.value) return
    session.value = loadSession()
    initialized.value = true
  }

  /**
   * Register a new user.
   */
  function signup(email: string, password: string, name: string): AuthUser | null {
    const users = loadUsers()
    const existing = users.find((u) => u.email === email)
    if (existing) return null // Email already registered

    const id = 'usr_' + Date.now().toString(36)
    const user: StoredUser = {
      id,
      email,
      name,
      password, // In production, hash this!
      joinedAt: new Date().toISOString(),
    }
    users.push(user)
    saveUsers(users)

    // Auto-login after signup
    const token = 'tok_' + user.id + '_' + Date.now().toString(36)
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, joinedAt: user.joinedAt }
    session.value = { token, user: authUser }
    saveSession(session.value)
    return authUser
  }

  /**
   * Login with email and password.
   */
  function login(email: string, password: string): AuthUser | null {
    const users = loadUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) return null

    const token = 'tok_' + user.id + '_' + Date.now().toString(36)
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, joinedAt: user.joinedAt }
    session.value = { token, user: authUser }
    saveSession(session.value)
    return authUser
  }

  /**
   * Logout.
   */
  function logout(): void {
    session.value = null
    saveSession(null)
  }

  /**
   * Request a password reset by email.
   * Returns the reset token if email found (so user can use it directly in PWA flow).
   */
  function requestPasswordReset(email: string): string | null {
    const users = loadUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return null

    const token = 'reset_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    const resetTokens = loadResetTokens()
    resetTokens[token] = { email, createdAt: Date.now() }
    saveResetTokens(resetTokens)
    return token
  }

  /**
   * Reset password using a valid reset token.
   */
  function resetPassword(token: string, newPassword: string): boolean {
    const resetTokens = loadResetTokens()
    const entry = resetTokens[token]
    if (!entry) return false

    // Token expires after 1 hour
    if (Date.now() - entry.createdAt > 3600000) {
      delete resetTokens[token]
      saveResetTokens(resetTokens)
      return false
    }

    const users = loadUsers()
    const userIndex = users.findIndex((u) => u.email === entry.email)
    if (userIndex === -1) {
      delete resetTokens[token]
      saveResetTokens(resetTokens)
      return false
    }

    users[userIndex].password = newPassword
    saveUsers(users)

    // Clean up used token
    delete resetTokens[token]
    saveResetTokens(resetTokens)
    return true
  }

  return {
    session,
    initialized,
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
