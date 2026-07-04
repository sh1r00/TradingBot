/**
 * Audit Log Utility
 *
 * Pure utility for logging sanitization rejections.
 * Never logs raw malicious input — only metadata about the rejection.
 * Uses crypto.subtle for SHA-256 hashing of IP addresses.
 */

export interface AuditLogEntry {
  timestamp: string
  hashedIp: string
  field: string
  reason: string
}

export interface AuditLogInput {
  ip: string
  field: string
  reason: string
}

/**
 * Hash a string using SHA-256 via crypto.subtle.
 * Returns the hex-encoded hash.
 */
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Log a sanitization rejection event.
 * Produces a structured audit log entry with:
 * - ISO 8601 timestamp
 * - SHA-256 hashed IP address (never raw IP in production logs)
 * - Field name that triggered the rejection
 * - Reason for rejection (generic category, not raw input)
 */
export async function logSanitizationRejection(entry: AuditLogInput): Promise<AuditLogEntry> {
  const hashedIp = await sha256Hex(entry.ip)

  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    hashedIp,
    field: entry.field,
    reason: entry.reason,
  }

  // In production, this would write to a structured log sink.
  // For now, log to console in a structured format.
  if (typeof console !== 'undefined') {
    console.info('[AUDIT]', JSON.stringify(logEntry))
  }

  return logEntry
}
