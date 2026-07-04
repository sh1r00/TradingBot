/**
 * Auth Store — localStorage-based authentication for static PWA.
 * No backend required. Users persist in localStorage.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'money_auth'
const USERS_KEY = 'money_users'

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

  return {
    session,
    initialized,
    isAuthenticated,
    currentUser,
    initialize,
    signup,
    login,
    logout,
  }
})
