/**
 * Client-side rate limiter for static site.
 * Uses localStorage to approximate rate limiting per session/day.
 *
 * Requirements: 21.9
 */

const WINDOW_MINUTES = 15
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000
const MAX_REQUESTS = 3

interface RateLimitRecord {
  timestamps: number[]
}

function getKey(date?: string): string {
  const d = date || new Date().toISOString().slice(0, 10)
  return `rate-limit-${d}`
}

/**
 * Check whether the current session is allowed to proceed.
 * Tracks up to MAX_REQUESTS per WINDOW_MINUTES window.
 *
 * @param _ip - Unused on client (localStorage is per-browser), kept for interface compatibility
 * @returns allowed, remaining count, and resetAt timestamp
 */
export function checkRateLimit(_ip?: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const key = getKey()
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  let record: RateLimitRecord = { timestamps: [] }

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      record = JSON.parse(stored) as RateLimitRecord
    }
  } catch {
    record = { timestamps: [] }
  }

  // Prune timestamps outside the window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = record.timestamps[0]
    const resetAt = oldestInWindow + WINDOW_MS
    return { allowed: false, remaining: 0, resetAt }
  }

  // Allow — record this timestamp
  record.timestamps.push(now)

  try {
    localStorage.setItem(key, JSON.stringify(record))
  } catch {
    // Storage full — still allow but don't persist
  }

  const remaining = MAX_REQUESTS - record.timestamps.length
  const resetAt = record.timestamps[0] + WINDOW_MS

  return { allowed: true, remaining, resetAt }
}

/**
 * Log an audit event to localStorage without logging raw input.
 * Entries are stored in the 'audit-log' array.
 *
 * @param fieldName - The form field that triggered the event
 * @param reason - Generic rejection reason (never raw input)
 */
export function logAuditEvent(fieldName: string, reason: string): void {
  const entry = {
    timestamp: new Date().toISOString(),
    fieldName,
    reason,
  }

  try {
    const stored = localStorage.getItem('audit-log')
    const log: typeof entry[] = stored ? JSON.parse(stored) : []
    log.push(entry)
    // Cap log at 100 entries
    if (log.length > 100) log.splice(0, log.length - 100)
    localStorage.setItem('audit-log', JSON.stringify(log))
  } catch {
    // Storage unavailable — silent fail
  }
}
