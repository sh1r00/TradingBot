/**
 * Auth Store — localStorage-based authentication for static PWA.
 * No backend required. Users persist in localStorage.
 *
 * NOTE: this is a client-only auth shim. Account lockout / rate limiting here is
 * "consistent with the existing auth" (in-memory + localStorage), but it is
 * fundamentally bypassable — anyone can clear localStorage or open a private
 * window. Real protection needs a server (see TODO_POST_DEPLOY.md).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'money_auth'
const USERS_KEY = 'money_users'
const RESET_TOKENS_KEY = 'money_reset_tokens'
const LOGIN_FAILURES_KEY = 'money_login_failures'
const RESET_THROTTLE_KEY = 'money_reset_throttle'
const SIGNUP_THROTTLE_KEY = 'money_signup_throttle'

// Lockout / throttle tuning.
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000
const RESET_MIN_INTERVAL_MS = 60 * 1000
const RESET_MAX_PER_HOUR = 5
const SIGNUP_MAX_PER_HOUR = 10
const HOUR_MS = 3600 * 1000

export interface AuthUser {
  id: string
  email: string
  name: string
  joinedAt: string
}

interface StoredUser extends AuthUser {
  password: string
}

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'invalid-credentials' }
  | { ok: false; reason: 'locked'; lockedUntil: number }

export type SignupResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'email-exists' }
  | { ok: false; reason: 'throttled'; retryAfterMs: number }

export type ResetRequestResult =
  | { ok: true; token: string }
  | { ok: false; reason: 'no-account' }
  | { ok: false; reason: 'throttled'; retryAfterMs: number }

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

// ── Login lockout (per-email failed-attempt tracking) ────────────────────────

interface LoginFailureRecord {
  count: number
  firstAt: number
  lockedUntil: number
}

function loadLoginFailures(): Record<string, LoginFailureRecord> {
  try {
    const raw = localStorage.getItem(LOGIN_FAILURES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLoginFailures(data: Record<string, LoginFailureRecord>): void {
  localStorage.setItem(LOGIN_FAILURES_KEY, JSON.stringify(data))
}

function loginLockedUntil(email: string): number | null {
  const rec = loadLoginFailures()[email]
  if (!rec || rec.lockedUntil <= Date.now()) return null
  return rec.lockedUntil
}

function recordLoginFailure(email: string): void {
  const all = loadLoginFailures()
  const now = Date.now()
  const existing = all[email]
  if (!existing || existing.lockedUntil <= now) {
    all[email] = { count: 1, firstAt: now, lockedUntil: 0 }
  } else {
    existing.count += 1
    if (existing.count >= MAX_LOGIN_ATTEMPTS) {
      existing.lockedUntil = now + LOGIN_LOCKOUT_MS
    }
  }
  saveLoginFailures(all)
}

function clearLoginFailures(email: string): void {
  const all = loadLoginFailures()
  delete all[email]
  saveLoginFailures(all)
}

// ── Generic timestamp-based throttle (reset requests + signup attempts) ─────

function loadThrottle(key: string): Record<string, number[]> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveThrottle(key: string, data: Record<string, number[]>): void {
  localStorage.setItem(key, JSON.stringify(data))
}

/** Returns remaining ms until allowed, or null if not throttled. */
function throttleRetryAfter(
  key: string,
  email: string,
  minIntervalMs: number,
  maxPerHour: number,
): number | null {
  const data = loadThrottle(key)
  const now = Date.now()
  const recent = (data[email] || []).filter((ts) => now - ts < HOUR_MS)
  if (recent.length === 0) return null
  const sinceLast = now - recent[recent.length - 1]
  if (sinceLast < minIntervalMs) return minIntervalMs - sinceLast
  if (recent.length >= maxPerHour) return HOUR_MS - (now - recent[0])
  return null
}

function recordThrottleEvent(key: string, email: string): void {
  const data = loadThrottle(key)
  const now = Date.now()
  const recent = (data[email] || []).filter((ts) => now - ts < HOUR_MS)
  recent.push(now)
  data[email] = recent
  saveThrottle(key, data)
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
   * Register a new user (rate-limited per email).
   */
  function signup(email: string, password: string, name: string): SignupResult {
    const retryAfter = throttleRetryAfter(SIGNUP_THROTTLE_KEY, email, 0, SIGNUP_MAX_PER_HOUR)
    if (retryAfter !== null) return { ok: false, reason: 'throttled', retryAfterMs: retryAfter }

    const users = loadUsers()
    const existing = users.find((u) => u.email === email)
    if (existing) return { ok: false, reason: 'email-exists' } // Email already registered

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
    recordThrottleEvent(SIGNUP_THROTTLE_KEY, email)

    // Auto-login after signup
    const token = 'tok_' + user.id + '_' + Date.now().toString(36)
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, joinedAt: user.joinedAt }
    session.value = { token, user: authUser }
    saveSession(session.value)
    return { ok: true, user: authUser }
  }

  /**
   * Login with email and password (with per-email account lockout).
   */
  function login(email: string, password: string): LoginResult {
    const lockedUntil = loginLockedUntil(email)
    if (lockedUntil !== null) {
      return { ok: false, reason: 'locked', lockedUntil }
    }

    const users = loadUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      recordLoginFailure(email)
      const nowLocked = loginLockedUntil(email)
      if (nowLocked !== null) return { ok: false, reason: 'locked', lockedUntil: nowLocked }
      return { ok: false, reason: 'invalid-credentials' }
    }

    clearLoginFailures(email)
    const token = 'tok_' + user.id + '_' + Date.now().toString(36)
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, joinedAt: user.joinedAt }
    session.value = { token, user: authUser }
    saveSession(session.value)
    return { ok: true, user: authUser }
  }

  /**
   * Logout.
   */
  function logout(): void {
    session.value = null
    saveSession(null)
  }

  /**
   * Request a password reset by email (rate-limited per email).
   */
  function requestPasswordReset(email: string): ResetRequestResult {
    const retryAfter = throttleRetryAfter(RESET_THROTTLE_KEY, email, RESET_MIN_INTERVAL_MS, RESET_MAX_PER_HOUR)
    if (retryAfter !== null) return { ok: false, reason: 'throttled', retryAfterMs: retryAfter }

    const users = loadUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return { ok: false, reason: 'no-account' }

    const token = 'reset_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    const resetTokens = loadResetTokens()
    resetTokens[token] = { email, createdAt: Date.now() }
    saveResetTokens(resetTokens)
    recordThrottleEvent(RESET_THROTTLE_KEY, email)
    return { ok: true, token }
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
