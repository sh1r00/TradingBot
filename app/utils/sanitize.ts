/**
 * Pure input sanitization utility functions.
 * All functions are stateless, side-effect-free, and independently testable.
 *
 * @module utils/sanitize
 */

/**
 * Strips HTML tags, script content, event handler attributes, and javascript: URIs
 * from input while preserving safe plain text.
 *
 * @param input - The raw user input string
 * @returns Sanitized plain text with dangerous content removed
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  let result = input

  // Remove dangerous tags and their content: script, iframe, object, embed, link, style
  result = result.replace(
    /<(script|iframe|object|embed|link|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    '',
  )
  // Remove self-closing or unclosed dangerous tags
  result = result.replace(
    /<(script|iframe|object|embed|link|style)\b[^>]*\/?>/gi,
    '',
  )

  // Remove event handler attributes from remaining tags (onclick, onerror, onload, etc.)
  result = result.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')

  // Remove javascript: URIs in href/src/action attributes
  result = result.replace(
    /(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,
    '',
  )

  // Strip all remaining HTML tags but keep text content
  result = result.replace(/<[^>]*>/g, '')

  // Remove any standalone javascript: URIs that might remain
  result = result.replace(/javascript\s*:/gi, '')

  return result.trim()
}

/**
 * Validates and sanitizes a URL, returning a safe https:// URL or null if invalid.
 * Rejects javascript:, data:, vbscript:, http://, ftp://, and protocol-relative URLs.
 *
 * @param url - The URL string to validate and sanitize
 * @returns The sanitized https:// URL string, or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null

  const trimmed = url.trim()

  // Reject empty strings
  if (!trimmed) return null

  // Reject protocol-relative URLs
  if (trimmed.startsWith('//')) return null

  // Reject dangerous protocols (case-insensitive, handle whitespace/encoding tricks)
  const normalized = trimmed.toLowerCase().replace(/[\s\x00-\x1f]/g, '')
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('http:') ||
    normalized.startsWith('ftp:')
  ) {
    return null
  }

  // Must start with https://
  if (!trimmed.toLowerCase().startsWith('https://')) return null

  // Validate URL using WHATWG URL Standard
  try {
    const parsed = new URL(trimmed)

    // Ensure protocol is https after parsing
    if (parsed.protocol !== 'https:') return null

    // Ensure hostname exists
    if (!parsed.hostname) return null

    return parsed.href
  } catch {
    return null
  }
}

/**
 * Entity-encodes special HTML characters. Idempotent — does not double-encode
 * already-encoded entities.
 *
 * @param input - The string to encode for safe HTML insertion
 * @returns Entity-encoded string
 */
export function encodeForHtml(input: string): string {
  if (!input) return ''

  // First, decode any existing entities to avoid double-encoding
  let decoded = input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")

  // Now encode all special characters
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Validates whether a URL is a valid https:// URL per WHATWG URL Standard.
 *
 * @param url - The URL string to validate
 * @returns true if the URL is a valid https:// URL, false otherwise
 */
export function isValidHttpsUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false

  const trimmed = url.trim()

  // Must start with https://
  if (!trimmed.toLowerCase().startsWith('https://')) return false

  try {
    const parsed = new URL(trimmed)

    // Protocol must be https:
    if (parsed.protocol !== 'https:') return false

    // Must have a valid hostname
    if (!parsed.hostname) return false

    return true
  } catch {
    return false
  }
}

/**
 * Removes dangerous HTML tags (script, iframe, object, embed, link, style)
 * and event handler attributes (onclick, onerror, onload, etc.) from HTML content.
 * Preserves safe structural HTML.
 *
 * @param html - The HTML string to sanitize
 * @returns HTML with dangerous tags and event handlers removed
 */
export function stripDangerousTags(html: string): string {
  if (!html) return ''

  let result = html

  // Remove dangerous tags and their content
  result = result.replace(
    /<(script|iframe|object|embed|link|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    '',
  )
  // Remove self-closing or unclosed dangerous tags
  result = result.replace(
    /<(script|iframe|object|embed|link|style)\b[^>]*\/?>/gi,
    '',
  )

  // Remove event handler attributes (on*) from all remaining tags
  // Use a loop to handle multiple event handlers on a single tag
  let prev = ''
  while (prev !== result) {
    prev = result
    result = result.replace(
      /(<[^>]*?)\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
      '$1',
    )
  }

  return result
}

/**
 * Checks if input contains null bytes, control characters (U+0000-U+001F except
 * tab U+0009, newline U+000A, carriage return U+000D), or exceeds the maximum
 * byte length by 4x.
 *
 * @param input - The string to check
 * @param maxByteLength - Maximum allowed byte length (default: 10000)
 * @returns true if the input should be rejected (contains dangerous chars or is oversized)
 */
export function rejectControlChars(
  input: string,
  maxByteLength: number = 10000,
): boolean {
  if (!input) return false

  // Check for null bytes
  if (input.includes('\0')) return true

  // Check for control characters U+0000-U+001F except tab (U+0009), newline (U+000A), CR (U+000D)
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i)
    if (code >= 0x00 && code <= 0x1f) {
      // Allow tab (0x09), newline (0x0a), carriage return (0x0d)
      if (code !== 0x09 && code !== 0x0a && code !== 0x0d) {
        return true
      }
    }
  }

  // Check if byte length exceeds 4x the max
  const byteLength = new TextEncoder().encode(input).length
  if (byteLength > maxByteLength * 4) return true

  return false
}

/**
 * Validates an email address against RFC 5322 simplified format.
 * Format: local@domain.tld
 * - Maximum 254 characters total
 * - Domain must have at least 2 characters
 * - Local part and domain are required
 *
 * @param email - The email string to validate
 * @returns true if the email is valid per RFC 5322 simplified format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const trimmed = email.trim()

  // Max 254 characters per RFC 5321
  if (trimmed.length > 254) return false

  // Must contain exactly one @
  const atIndex = trimmed.lastIndexOf('@')
  if (atIndex <= 0) return false

  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)

  // Local part must not be empty and max 64 chars
  if (!local || local.length > 64) return false

  // Domain must be at least 2 chars
  if (!domain || domain.length < 2) return false

  // Local part validation: allow alphanumeric, dots, underscores, hyphens, plus signs
  // Must not start or end with a dot, no consecutive dots
  if (local.startsWith('.') || local.endsWith('.')) return false
  if (local.includes('..')) return false

  // RFC 5322 simplified local part characters
  const localRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/
  if (!localRegex.test(local)) return false

  // Domain validation: must have at least one dot, each label 1-63 chars
  // Labels are alphanumeric + hyphens, cannot start/end with hyphen
  const domainParts = domain.split('.')
  if (domainParts.length < 2) return false

  // TLD must be at least 2 chars
  const tld = domainParts[domainParts.length - 1]
  if (!tld || tld.length < 2) return false

  // Each domain label must be valid
  const labelRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
  for (const part of domainParts) {
    if (!part || !labelRegex.test(part)) return false
  }

  return true
}
