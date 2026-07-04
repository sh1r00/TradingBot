import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  sanitizeUrl,
  encodeForHtml,
  isValidHttpsUrl,
  stripDangerousTags,
  rejectControlChars,
  validateEmail,
} from '~/utils/sanitize'

describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('preserves safe plain text', () => {
    expect(sanitizeInput('Hello world')).toBe('Hello world')
  })

  it('strips script tags and content', () => {
    expect(sanitizeInput('Hello<script>alert("xss")</script>World')).toBe(
      'HelloWorld',
    )
  })

  it('strips iframe tags', () => {
    expect(sanitizeInput('text<iframe src="evil.com"></iframe>more')).toBe(
      'textmore',
    )
  })

  it('strips object and embed tags', () => {
    expect(sanitizeInput('<object data="x"></object>safe')).toBe('safe')
    expect(sanitizeInput('<embed src="x"/>safe')).toBe('safe')
  })

  it('strips link and style tags', () => {
    expect(sanitizeInput('<link rel="stylesheet">text')).toBe('text')
    expect(sanitizeInput('<style>body{}</style>text')).toBe('text')
  })

  it('removes event handler attributes', () => {
    expect(sanitizeInput('<div onclick="alert(1)">text</div>')).toBe('text')
    expect(sanitizeInput('<img onerror="alert(1)">')).toBe('')
  })

  it('removes javascript: URIs', () => {
    expect(sanitizeInput('click <a href="javascript:alert(1)">here</a>')).toBe(
      'click here',
    )
  })

  it('strips all HTML tags preserving text content', () => {
    expect(sanitizeInput('<p>paragraph</p>')).toBe('paragraph')
    expect(sanitizeInput('<b>bold</b> and <i>italic</i>')).toBe(
      'bold and italic',
    )
  })

  it('handles case-insensitive dangerous tags', () => {
    expect(sanitizeInput('<SCRIPT>alert(1)</SCRIPT>safe')).toBe('safe')
    expect(sanitizeInput('<Script>alert(1)</Script>safe')).toBe('safe')
  })
})

describe('sanitizeUrl', () => {
  it('returns null for empty input', () => {
    expect(sanitizeUrl('')).toBeNull()
  })

  it('returns valid https URL', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('returns null for http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBeNull()
  })

  it('returns null for javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull()
  })

  it('returns null for data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
  })

  it('returns null for vbscript: URLs', () => {
    expect(sanitizeUrl('vbscript:msgbox("xss")')).toBeNull()
  })

  it('returns null for ftp: URLs', () => {
    expect(sanitizeUrl('ftp://files.example.com')).toBeNull()
  })

  it('returns null for protocol-relative URLs', () => {
    expect(sanitizeUrl('//example.com/path')).toBeNull()
  })

  it('returns null for invalid URL syntax', () => {
    expect(sanitizeUrl('not a url at all')).toBeNull()
  })

  it('handles URLs with paths and query params', () => {
    expect(sanitizeUrl('https://example.com/path?q=1')).toBe(
      'https://example.com/path?q=1',
    )
  })

  it('rejects URLs with whitespace-obfuscated protocols', () => {
    expect(sanitizeUrl('java\tscript:alert(1)')).toBeNull()
  })
})

describe('encodeForHtml', () => {
  it('returns empty string for empty input', () => {
    expect(encodeForHtml('')).toBe('')
  })

  it('encodes < to &lt;', () => {
    expect(encodeForHtml('<')).toBe('&lt;')
  })

  it('encodes > to &gt;', () => {
    expect(encodeForHtml('>')).toBe('&gt;')
  })

  it('encodes & to &amp;', () => {
    expect(encodeForHtml('&')).toBe('&amp;')
  })

  it('encodes " to &quot;', () => {
    expect(encodeForHtml('"')).toBe('&quot;')
  })

  it("encodes ' to &#x27;", () => {
    expect(encodeForHtml("'")).toBe('&#x27;')
  })

  it('encodes a complex string', () => {
    expect(encodeForHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
  })

  it('is idempotent - does not double-encode', () => {
    const once = encodeForHtml('<b>test</b>')
    const twice = encodeForHtml(once)
    expect(twice).toBe(once)
  })

  it('does not double-encode already-encoded entities', () => {
    expect(encodeForHtml('&amp;')).toBe('&amp;')
    expect(encodeForHtml('&lt;')).toBe('&lt;')
    expect(encodeForHtml('&gt;')).toBe('&gt;')
    expect(encodeForHtml('&quot;')).toBe('&quot;')
    expect(encodeForHtml('&#x27;')).toBe('&#x27;')
  })
})

describe('isValidHttpsUrl', () => {
  it('returns false for empty input', () => {
    expect(isValidHttpsUrl('')).toBe(false)
  })

  it('returns true for valid https URL', () => {
    expect(isValidHttpsUrl('https://example.com')).toBe(true)
  })

  it('returns true for https URL with path', () => {
    expect(isValidHttpsUrl('https://example.com/path/to/page')).toBe(true)
  })

  it('returns false for http URL', () => {
    expect(isValidHttpsUrl('http://example.com')).toBe(false)
  })

  it('returns false for javascript: URL', () => {
    expect(isValidHttpsUrl('javascript:alert(1)')).toBe(false)
  })

  it('returns false for invalid URL', () => {
    expect(isValidHttpsUrl('not-a-url')).toBe(false)
  })

  it('returns false for data: URL', () => {
    expect(isValidHttpsUrl('data:text/html,test')).toBe(false)
  })
})

describe('stripDangerousTags', () => {
  it('returns empty string for empty input', () => {
    expect(stripDangerousTags('')).toBe('')
  })

  it('removes script tags and content', () => {
    expect(stripDangerousTags('<p>safe</p><script>evil()</script>')).toBe(
      '<p>safe</p>',
    )
  })

  it('removes iframe tags', () => {
    expect(stripDangerousTags('<div><iframe src="x"></iframe></div>')).toBe(
      '<div></div>',
    )
  })

  it('removes object, embed, link, style tags', () => {
    expect(stripDangerousTags('<object data="x"></object>')).toBe('')
    expect(stripDangerousTags('<embed src="x"/>')).toBe('')
    expect(stripDangerousTags('<link rel="stylesheet">')).toBe('')
    expect(stripDangerousTags('<style>.x{}</style>')).toBe('')
  })

  it('removes event handler attributes but keeps the tag', () => {
    expect(stripDangerousTags('<div onclick="alert(1)">text</div>')).toBe(
      '<div>text</div>',
    )
  })

  it('removes multiple event handlers from one tag', () => {
    const input = '<img src="x" onerror="alert(1)" onload="track()">'
    const result = stripDangerousTags(input)
    expect(result).not.toContain('onerror')
    expect(result).not.toContain('onload')
    expect(result).toContain('src="x"')
  })

  it('preserves safe tags and attributes', () => {
    expect(
      stripDangerousTags('<a href="https://example.com">link</a>'),
    ).toBe('<a href="https://example.com">link</a>')
  })
})

describe('rejectControlChars', () => {
  it('returns false for normal text', () => {
    expect(rejectControlChars('Hello world')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(rejectControlChars('')).toBe(false)
  })

  it('returns true for null bytes', () => {
    expect(rejectControlChars('hello\0world')).toBe(true)
  })

  it('returns true for control characters', () => {
    expect(rejectControlChars('hello\x01world')).toBe(true)
    expect(rejectControlChars('hello\x1Fworld')).toBe(true)
  })

  it('allows tab, newline, and carriage return', () => {
    expect(rejectControlChars('hello\tworld')).toBe(false)
    expect(rejectControlChars('hello\nworld')).toBe(false)
    expect(rejectControlChars('hello\rworld')).toBe(false)
  })

  it('returns true when byte length exceeds 4x max', () => {
    // Create a string that when encoded exceeds 4x the max byte length
    const longString = 'a'.repeat(40001)
    expect(rejectControlChars(longString, 10000)).toBe(true)
  })

  it('returns false when byte length is within 4x max', () => {
    const normalString = 'a'.repeat(39999)
    expect(rejectControlChars(normalString, 10000)).toBe(false)
  })

  it('accounts for multi-byte characters', () => {
    // Each emoji is 4 bytes in UTF-8
    const emojis = '😀'.repeat(10001)
    expect(rejectControlChars(emojis, 10000)).toBe(true)
  })
})

describe('validateEmail', () => {
  it('returns false for empty input', () => {
    expect(validateEmail('')).toBe(false)
  })

  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('returns true for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true)
  })

  it('returns true for email with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true)
  })

  it('returns false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })

  it('returns false for email without domain', () => {
    expect(validateEmail('user@')).toBe(false)
  })

  it('returns false for email without local part', () => {
    expect(validateEmail('@example.com')).toBe(false)
  })

  it('returns false for email with domain less than 2 chars', () => {
    expect(validateEmail('user@x')).toBe(false)
  })

  it('returns false for email exceeding 254 chars', () => {
    const longEmail = 'a'.repeat(245) + '@example.com'
    expect(validateEmail(longEmail)).toBe(false)
  })

  it('returns false for email with consecutive dots in local', () => {
    expect(validateEmail('user..name@example.com')).toBe(false)
  })

  it('returns false for email starting with dot in local', () => {
    expect(validateEmail('.user@example.com')).toBe(false)
  })

  it('returns false for email with no TLD', () => {
    expect(validateEmail('user@localhost')).toBe(false)
  })

  it('returns false for email with single-char TLD', () => {
    expect(validateEmail('user@example.c')).toBe(false)
  })

  it('returns true for email with numeric domain', () => {
    expect(validateEmail('user@123.456.com')).toBe(true)
  })

  it('returns false for email with hyphen-starting domain label', () => {
    expect(validateEmail('user@-example.com')).toBe(false)
  })
})
