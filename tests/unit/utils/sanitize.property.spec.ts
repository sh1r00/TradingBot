// Feature: money-conversion-spa, Properties 22, 23, 24, 27
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { sanitizeInput, encodeForHtml, rejectControlChars } from '~/utils/sanitize'

/**
 * Helper: Generate a string from a set of allowed characters using integer codes.
 */
function safeTextArb(minLength = 1, maxLength = 50) {
  // Printable ASCII range (0x20-0x7E) excluding < and >
  return fc
    .array(
      fc.integer({ min: 0x20, max: 0x7e }).filter((c) => c !== 0x3c && c !== 0x3e),
      { minLength, maxLength },
    )
    .map((codes) => codes.map((c) => String.fromCharCode(c)).join(''))
}

/**
 * Validates: Requirements 21.1
 *
 * Property 22: HTML/Script Sanitization
 * For any input containing HTML tags (script, iframe, object, embed, link, style),
 * event handlers (onclick, onerror, onload), or javascript: URIs, sanitizeInput shall
 * remove all dangerous content while preserving safe plain text.
 */
describe('Property 22: HTML/Script Sanitization', () => {
  const dangerousTagNames = ['script', 'iframe', 'object', 'embed', 'link', 'style'] as const
  const eventHandlers = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'] as const

  const dangerousTagArb = fc.constantFrom(...dangerousTagNames)
  const eventHandlerArb = fc.constantFrom(...eventHandlers)

  it('removes dangerous tags while preserving surrounding safe text', () => {
    fc.assert(
      fc.property(
        safeTextArb(),
        safeTextArb(),
        dangerousTagArb,
        fc.string({ minLength: 0, maxLength: 20 }),
        (before, after, tag, content) => {
          const input = `${before}<${tag}>${content}</${tag}>${after}`
          const result = sanitizeInput(input)

          // Dangerous tag and its content must be removed
          expect(result).not.toContain(`<${tag}`)
          expect(result).not.toContain(`</${tag}>`)

          // Safe surrounding text must be preserved (trimmed result)
          expect(result).toContain(before.trim())
          expect(result).toContain(after.trim())
        },
      ),
    )
  })

  it('removes event handler attributes from any tag', () => {
    fc.assert(
      fc.property(
        safeTextArb(2, 50),
        eventHandlerArb,
        fc.string({ minLength: 1, maxLength: 20 }),
        (text, handler, handlerValue) => {
          // Ensure text has non-whitespace content that survives trim
          const trimmedText = text.trim()
          fc.pre(trimmedText.length > 0)

          const safeHandlerValue = handlerValue.replace(/"/g, '')
          const input = `<div ${handler}="${safeHandlerValue}">${text}</div>`
          const result = sanitizeInput(input)

          // Event handler must be removed
          expect(result.toLowerCase()).not.toContain(handler)

          // Safe text content must be preserved
          expect(result).toContain(trimmedText)
        },
      ),
    )
  })

  it('removes javascript: URIs', () => {
    fc.assert(
      fc.property(
        safeTextArb(2, 50),
        safeTextArb(1, 30),
        (linkText, jsCode) => {
          // Ensure linkText has non-whitespace content that survives trim
          const trimmedLinkText = linkText.trim()
          fc.pre(trimmedLinkText.length > 0)

          const safeJsCode = jsCode.replace(/"/g, '').replace(/'/g, '')
          const input = `<a href="javascript:${safeJsCode}">${linkText}</a>`
          const result = sanitizeInput(input)

          // javascript: protocol must be removed
          expect(result.toLowerCase()).not.toContain('javascript:')

          // Link text should be preserved
          expect(result).toContain(trimmedLinkText)
        },
      ),
    )
  })

  it('preserves pure safe plain text unchanged', () => {
    fc.assert(
      fc.property(safeTextArb(), (text) => {
        const result = sanitizeInput(text)
        expect(result).toBe(text.trim())
      }),
    )
  })
})

/**
 * Validates: Requirements 21.2
 *
 * Property 23: HTML Entity Encoding Round-Trip
 * For any string containing < > & " ', encodeForHtml shall produce entity-encoded output.
 * Encoding must be idempotent (encoding an already-encoded string shall not double-encode).
 */
describe('Property 23: HTML Entity Encoding Round-Trip', () => {
  // Arbitrary strings built from a mix of special and normal characters
  const htmlSpecialCharsArb = fc
    .array(
      fc.constantFrom('<', '>', '&', '"', "'", 'a', 'b', ' ', '1', '!', '?'),
      { minLength: 1, maxLength: 100 },
    )
    .map((chars) => chars.join(''))

  it('encodes all special HTML characters', () => {
    fc.assert(
      fc.property(htmlSpecialCharsArb, (input) => {
        const encoded = encodeForHtml(input)

        // Encoded output must not contain raw < or >
        expect(encoded).not.toContain('<')
        expect(encoded).not.toContain('>')

        // Raw & should only appear as part of entity references
        const ampersands = encoded.match(/&/g) || []
        const entityStarts = encoded.match(/&(amp|lt|gt|quot|#x27);/g) || []
        expect(ampersands.length).toBe(entityStarts.length)
      }),
    )
  })

  it('is idempotent - encoding an already-encoded string produces the same output', () => {
    fc.assert(
      fc.property(htmlSpecialCharsArb, (input) => {
        const once = encodeForHtml(input)
        const twice = encodeForHtml(once)
        expect(twice).toBe(once)
      }),
    )
  })

  it('does not double-encode pre-existing entities', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('&amp;', '&lt;', '&gt;', '&quot;', '&#x27;'),
        fc
          .array(fc.constantFrom('a', 'b', 'c', ' ', '1'), { minLength: 0, maxLength: 20 })
          .map((chars) => chars.join('')),
        (entity, suffix) => {
          const input = entity + suffix
          const encoded = encodeForHtml(input)

          // The entity should remain as-is (not double-encoded)
          expect(encoded).toContain(entity)
          // Should NOT contain double-encoded forms
          expect(encoded).not.toContain('&amp;amp;')
          expect(encoded).not.toContain('&amp;lt;')
          expect(encoded).not.toContain('&amp;gt;')
          expect(encoded).not.toContain('&amp;quot;')
          expect(encoded).not.toContain('&amp;#x27;')
        },
      ),
    )
  })
})

/**
 * Validates: Requirements 21.5
 *
 * Property 24: Control Character Rejection
 * For any string containing null bytes, control chars (U+0000-U+001F except tab/newline/CR),
 * or content exceeding max byte length by 4x, rejectControlChars shall return true.
 */
describe('Property 24: Control Character Rejection', () => {
  // Arbitrary for forbidden control characters (U+0000-U+001F except 0x09, 0x0A, 0x0D)
  const forbiddenControlCharArb = fc
    .integer({ min: 0x00, max: 0x1f })
    .filter((code) => code !== 0x09 && code !== 0x0a && code !== 0x0d)
    .map((code) => String.fromCharCode(code))

  it('rejects strings containing null bytes', () => {
    fc.assert(
      fc.property(safeTextArb(), safeTextArb(), (before, after) => {
        const input = `${before}\0${after}`
        expect(rejectControlChars(input)).toBe(true)
      }),
    )
  })

  it('rejects strings containing forbidden control characters', () => {
    fc.assert(
      fc.property(
        safeTextArb(),
        forbiddenControlCharArb,
        safeTextArb(),
        (before, controlChar, after) => {
          const input = `${before}${controlChar}${after}`
          expect(rejectControlChars(input)).toBe(true)
        },
      ),
    )
  })

  it('rejects strings exceeding 4x max byte length', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 500 }),
        (maxByteLength) => {
          // Create string that exceeds 4x the max (ASCII = 1 byte per char)
          const oversizedString = 'x'.repeat(maxByteLength * 4 + 1)
          expect(rejectControlChars(oversizedString, maxByteLength)).toBe(true)
        },
      ),
    )
  })

  it('accepts strings with only allowed whitespace (tab, newline, CR)', () => {
    fc.assert(
      fc.property(
        fc
          .array(
            fc.constantFrom('\t', '\n', '\r', 'a', 'b', 'c', ' ', '1', '2'),
            { minLength: 1, maxLength: 100 },
          )
          .map((chars) => chars.join('')),
        (input) => {
          // Safe text with allowed whitespace should not be rejected
          expect(rejectControlChars(input)).toBe(false)
        },
      ),
    )
  })

  it('accepts safe text within byte length limits', () => {
    fc.assert(
      fc.property(safeTextArb(), (input) => {
        // With default maxByteLength of 10000, safe text (max 50 chars) is well within limits
        expect(rejectControlChars(input)).toBe(false)
      }),
    )
  })
})

/**
 * Validates: Requirements 21.12
 *
 * Property 27: Silent Sanitization
 * For any user input modified by sanitization (tags stripped), no validation error should be
 * produced. The sanitized value should differ from original only by removal of dangerous content.
 */
describe('Property 27: Silent Sanitization', () => {
  const dangerousTagNames = ['script', 'iframe', 'object', 'embed', 'link', 'style'] as const
  const dangerousTagArb = fc.constantFrom(...dangerousTagNames)

  it('sanitization modifies input silently without producing errors (returns valid string)', () => {
    fc.assert(
      fc.property(
        safeTextArb(),
        dangerousTagArb,
        fc.string({ minLength: 0, maxLength: 20 }),
        safeTextArb(),
        (before, tag, tagContent, after) => {
          const input = `${before}<${tag}>${tagContent}</${tag}>${after}`
          const sanitized = sanitizeInput(input)

          // Sanitization must produce a valid string (not null, not undefined, no error thrown)
          expect(typeof sanitized).toBe('string')

          // The sanitized value should differ from the original (tags were stripped)
          expect(sanitized).not.toBe(input)

          // Sanitized output should only contain the safe text parts
          expect(sanitized).toContain(before.trim())
          expect(sanitized).toContain(after.trim())

          // No dangerous content should remain
          expect(sanitized).not.toContain(`<${tag}`)
          expect(sanitized).not.toContain(`</${tag}>`)
        },
      ),
    )
  })

  it('sanitized value preserves all safe plain text content', () => {
    fc.assert(
      fc.property(
        safeTextArb(),
        safeTextArb(),
        safeTextArb(),
        dangerousTagArb,
        (part1, part2, part3, tag) => {
          const input = `${part1}<${tag}>dangerous</${tag}>${part2}<${tag}>more</${tag}>${part3}`
          const sanitized = sanitizeInput(input)

          // All safe text parts must be present
          expect(sanitized).toContain(part1.trim())
          expect(sanitized).toContain(part2)
          expect(sanitized).toContain(part3.trim())

          // Only dangerous content was removed
          expect(sanitized).not.toContain(`<${tag}`)
        },
      ),
    )
  })

  it('already-safe input is not modified by sanitization', () => {
    fc.assert(
      fc.property(safeTextArb(), (input) => {
        const sanitized = sanitizeInput(input)

        // Safe text should pass through unchanged (only trimmed)
        expect(sanitized).toBe(input.trim())
      }),
    )
  })
})
