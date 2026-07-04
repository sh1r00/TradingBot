// Feature: money-conversion-spa, Property 2: URL Validation Rejects Non-HTTPS Protocols
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { isValidHttpsUrl, sanitizeUrl } from '~/utils/sanitize'

/**
 * Validates: Requirements 1.5, 20.5, 21.4
 *
 * Property 2: URL Validation Rejects Non-HTTPS Protocols
 * For any string that does not begin with https:// or does not conform to valid URL syntax
 * per WHATWG URL Standard, the URL validator (isValidHttpsUrl and sanitizeUrl) shall reject it.
 * Strings containing javascript:, data:, vbscript:, http://, ftp://, protocol-relative (//),
 * or malformed syntax must all be rejected.
 */

const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('')
const ALPHA_NUM = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
const PATH_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('')

/**
 * Helper: generate a string from an array of characters.
 */
function charArrayToString(minLen: number, maxLen: number, chars: string[]) {
  return fc
    .array(fc.constantFrom(...chars), { minLength: minLen, maxLength: maxLen })
    .map((arr) => arr.join(''))
}

/**
 * Arbitrary: valid HTTPS URLs with random hostnames, paths, and query strings.
 * These should always pass validation.
 */
const validHttpsUrlArb = fc
  .record({
    subdomain: charArrayToString(1, 10, ALPHA_NUM),
    domain: charArrayToString(2, 15, ALPHA_NUM),
    tld: fc.constantFrom('com', 'org', 'net', 'io', 'dev', 'co', 'app'),
    path: fc.array(charArrayToString(1, 10, PATH_CHARS), { minLength: 0, maxLength: 3 }),
    queryKey: charArrayToString(1, 5, ALPHA_LOWER),
    queryValue: charArrayToString(1, 8, ALPHA_NUM),
    hasQuery: fc.boolean(),
  })
  .map(({ subdomain, domain, tld, path, queryKey, queryValue, hasQuery }) => {
    const pathStr = path.length > 0 ? '/' + path.join('/') : ''
    const queryStr = hasQuery ? `?${queryKey}=${queryValue}` : ''
    return `https://${subdomain}.${domain}.${tld}${pathStr}${queryStr}`
  })

/**
 * Arbitrary: non-HTTPS URLs using dangerous protocols.
 * These should always be rejected.
 */
const dangerousProtocolArb = fc
  .record({
    protocol: fc.constantFrom(
      'javascript:',
      'data:',
      'vbscript:',
      'http://',
      'ftp://',
    ),
    suffix: charArrayToString(1, 30, 'abcdefghijklmnopqrstuvwxyz0123456789./:?=&_-'.split('')),
  })
  .map(({ protocol, suffix }) => `${protocol}${suffix}`)

/**
 * Arbitrary: protocol-relative URLs (starting with //).
 * These should always be rejected.
 */
const protocolRelativeArb = fc
  .record({
    host: charArrayToString(3, 20, 'abcdefghijklmnopqrstuvwxyz0123456789.'.split('')),
    path: charArrayToString(0, 15, 'abcdefghijklmnopqrstuvwxyz0123456789/-_'.split('')),
  })
  .map(({ host, path }) => `//${host}${path ? '/' + path : ''}`)

/**
 * Arbitrary: malformed strings that are not valid URLs.
 * These should always be rejected.
 */
const malformedStringArb = fc.oneof(
  // Random strings without any protocol prefix
  charArrayToString(1, 50, 'abcdefghijklmnopqrstuvwxyz 0123456789!@#$%^&*()'.split(''))
    .filter((s) => !s.trim().toLowerCase().startsWith('https://')),
  // Strings that look like URLs but have no protocol
  fc
    .record({
      host: charArrayToString(2, 10, ALPHA_LOWER),
      tld: fc.constantFrom('com', 'org', 'net'),
    })
    .map(({ host, tld }) => `${host}.${tld}/path`),
  // Empty or whitespace-only strings
  fc.constantFrom('', '   ', '\t', '\n'),
)

/**
 * Arbitrary: dangerous protocol with obfuscation (whitespace/control chars inserted).
 * These should always be rejected.
 */
const obfuscatedProtocolArb = fc
  .record({
    protocol: fc.constantFrom('javascript', 'data', 'vbscript'),
    obfuscation: fc.constantFrom('\t', '\n', '\r', ' ', '\x00'),
    suffix: charArrayToString(1, 20, 'abcdefghijklmnopqrstuvwxyz()0123456789'.split('')),
  })
  .map(({ protocol, obfuscation, suffix }) => `${protocol}${obfuscation}:${suffix}`)

describe('Property 2: URL Validation Rejects Non-HTTPS Protocols', () => {
  describe('isValidHttpsUrl', () => {
    it('accepts arbitrary valid https:// URLs', () => {
      fc.assert(
        fc.property(validHttpsUrlArb, (url) => {
          expect(isValidHttpsUrl(url)).toBe(true)
        }),
      )
    })

    it('rejects arbitrary non-https dangerous protocol URLs', () => {
      fc.assert(
        fc.property(dangerousProtocolArb, (url) => {
          expect(isValidHttpsUrl(url)).toBe(false)
        }),
      )
    })

    it('rejects arbitrary protocol-relative URLs', () => {
      fc.assert(
        fc.property(protocolRelativeArb, (url) => {
          expect(isValidHttpsUrl(url)).toBe(false)
        }),
      )
    })

    it('rejects arbitrary malformed strings', () => {
      fc.assert(
        fc.property(malformedStringArb, (url) => {
          expect(isValidHttpsUrl(url)).toBe(false)
        }),
      )
    })

    it('rejects obfuscated dangerous protocols', () => {
      fc.assert(
        fc.property(obfuscatedProtocolArb, (url) => {
          expect(isValidHttpsUrl(url)).toBe(false)
        }),
      )
    })
  })

  describe('sanitizeUrl', () => {
    it('returns a valid string for arbitrary valid https:// URLs', () => {
      fc.assert(
        fc.property(validHttpsUrlArb, (url) => {
          const result = sanitizeUrl(url)
          expect(result).not.toBeNull()
          expect(result).toMatch(/^https:\/\//)
        }),
      )
    })

    it('returns null for arbitrary non-https dangerous protocol URLs', () => {
      fc.assert(
        fc.property(dangerousProtocolArb, (url) => {
          expect(sanitizeUrl(url)).toBeNull()
        }),
      )
    })

    it('returns null for arbitrary protocol-relative URLs', () => {
      fc.assert(
        fc.property(protocolRelativeArb, (url) => {
          expect(sanitizeUrl(url)).toBeNull()
        }),
      )
    })

    it('returns null for arbitrary malformed strings', () => {
      fc.assert(
        fc.property(malformedStringArb, (url) => {
          expect(sanitizeUrl(url)).toBeNull()
        }),
      )
    })

    it('returns null for obfuscated dangerous protocols', () => {
      fc.assert(
        fc.property(obfuscatedProtocolArb, (url) => {
          expect(sanitizeUrl(url)).toBeNull()
        }),
      )
    })

    it('sanitizeUrl output always starts with https:// when not null', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 0, maxLength: 100 }), (url) => {
          const result = sanitizeUrl(url)
          if (result !== null) {
            expect(result).toMatch(/^https:\/\//)
          }
        }),
      )
    })
  })
})
