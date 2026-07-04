import { describe, it, expect } from 'vitest'
import {
  useFormValidation,
  type ValidationRule,
  type FieldConfig,
} from '~/composables/useFormValidation'

const requiredRule: ValidationRule = {
  name: 'required',
  validator: (value: unknown) => {
    const str = String(value ?? '')
    return str.length > 0
  },
  message: 'validation.required',
}

const httpsUrlRule: ValidationRule = {
  name: 'httpsUrl',
  validator: (value: unknown) => {
    const str = String(value ?? '')
    if (!str.startsWith('https://')) return false
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  },
  message: 'validation.invalidUrl',
}

function createTestConfig(): Record<string, FieldConfig> {
  return {
    title: {
      rules: [requiredRule],
      maxLength: 100,
      minLength: 3,
    },
    description: {
      rules: [requiredRule],
      maxLength: 500,
      minLength: 10,
    },
    url: {
      rules: [requiredRule, httpsUrlRule],
      maxLength: 2048,
    },
  }
}

describe('useFormValidation', () => {
  describe('initialization', () => {
    it('initializes all fields in pristine state', () => {
      const { fields } = useFormValidation(createTestConfig())

      expect(fields.title.status).toBe('pristine')
      expect(fields.title.error).toBeNull()
      expect(fields.title.touched).toBe(false)
      expect(fields.title.value.value).toBe('')

      expect(fields.description.status).toBe('pristine')
      expect(fields.url.status).toBe('pristine')
    })

    it('creates a field for each config entry', () => {
      const { fields } = useFormValidation(createTestConfig())

      expect(Object.keys(fields)).toEqual(['title', 'description', 'url'])
    })
  })

  describe('validate (single field)', () => {
    it('transitions from pristine to dirty then invalid on failed validation', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      const result = validate('title')

      expect(result).toBe(false)
      expect(fields.title.status).toBe('invalid')
      expect(fields.title.error).toBe('validation.required')
      expect(fields.title.touched).toBe(true)
    })

    it('transitions to valid when all rules pass', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.title.value.value = 'My Title'
      const result = validate('title')

      expect(result).toBe(true)
      expect(fields.title.status).toBe('valid')
      expect(fields.title.error).toBeNull()
      expect(fields.title.touched).toBe(true)
    })

    it('trims whitespace before validation', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.title.value.value = '   Hello World   '
      const result = validate('title')

      expect(result).toBe(true)
      expect(fields.title.status).toBe('valid')
    })

    it('fails when trimmed value is empty for required field', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.title.value.value = '   '
      const result = validate('title')

      expect(result).toBe(false)
      expect(fields.title.status).toBe('invalid')
    })

    it('fails when value is below minLength', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.title.value.value = 'ab'
      const result = validate('title')

      expect(result).toBe(false)
      expect(fields.title.status).toBe('invalid')
      expect(fields.title.error).toBe('validation.minLength')
    })

    it('fails when value exceeds maxLength', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.title.value.value = 'a'.repeat(101)
      const result = validate('title')

      expect(result).toBe(false)
      expect(fields.title.status).toBe('invalid')
      expect(fields.title.error).toBe('validation.maxLength')
    })

    it('runs custom rules after length checks', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.url.value.value = 'http://example.com'
      const result = validate('url')

      expect(result).toBe(false)
      expect(fields.url.status).toBe('invalid')
      expect(fields.url.error).toBe('validation.invalidUrl')
    })

    it('passes valid https URL', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      fields.url.value.value = 'https://example.com/path'
      const result = validate('url')

      expect(result).toBe(true)
      expect(fields.url.status).toBe('valid')
    })

    it('returns false for unknown field name', () => {
      const { validate } = useFormValidation(createTestConfig())

      const result = validate('nonexistent')

      expect(result).toBe(false)
    })

    it('clears error when previously invalid field is corrected', () => {
      const { fields, validate } = useFormValidation(createTestConfig())

      // First, make it invalid
      fields.title.value.value = ''
      validate('title')
      expect(fields.title.status).toBe('invalid')
      expect(fields.title.error).toBe('validation.required')

      // Now correct it
      fields.title.value.value = 'Valid Title'
      validate('title')
      expect(fields.title.status).toBe('valid')
      expect(fields.title.error).toBeNull()
    })
  })

  describe('validateAll', () => {
    it('returns false when any field is invalid', () => {
      const { fields, validateAll } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      // description and url are empty

      const result = validateAll()

      expect(result).toBe(false)
    })

    it('returns true when all fields are valid', () => {
      const { fields, validateAll } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      fields.description.value.value = 'This is a valid description with enough characters'
      fields.url.value.value = 'https://example.com'

      const result = validateAll()

      expect(result).toBe(true)
    })

    it('validates all fields and marks each as touched', () => {
      const { fields, validateAll } = useFormValidation(createTestConfig())

      validateAll()

      expect(fields.title.touched).toBe(true)
      expect(fields.description.touched).toBe(true)
      expect(fields.url.touched).toBe(true)
    })
  })

  describe('reset', () => {
    it('resets all fields to pristine state', () => {
      const { fields, validate, reset } = useFormValidation(createTestConfig())

      // Dirty up the fields
      fields.title.value.value = 'Hello'
      validate('title')
      expect(fields.title.status).toBe('valid')
      expect(fields.title.touched).toBe(true)

      // Reset
      reset()

      expect(fields.title.value.value).toBe('')
      expect(fields.title.status).toBe('pristine')
      expect(fields.title.error).toBeNull()
      expect(fields.title.touched).toBe(false)
    })

    it('resets all fields including invalid ones', () => {
      const { fields, validateAll, reset } = useFormValidation(createTestConfig())

      validateAll() // All will be invalid (empty)

      reset()

      for (const fieldName of Object.keys(fields)) {
        expect(fields[fieldName].status).toBe('pristine')
        expect(fields[fieldName].error).toBeNull()
        expect(fields[fieldName].touched).toBe(false)
      }
    })
  })

  describe('computed properties', () => {
    it('isValid is false when not all fields are valid', () => {
      const { fields, validate, isValid } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      validate('title')

      expect(isValid.value).toBe(false)
    })

    it('isValid is true when all fields pass validation', () => {
      const { fields, validateAll, isValid } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      fields.description.value.value = 'This description is long enough to pass'
      fields.url.value.value = 'https://example.com'

      validateAll()

      expect(isValid.value).toBe(true)
    })

    it('firstInvalidField returns the first invalid field name', () => {
      const { fields, validateAll, firstInvalidField } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      // description is empty, url is empty
      validateAll()

      expect(firstInvalidField.value).toBe('description')
    })

    it('firstInvalidField returns null when no fields are invalid', () => {
      const { fields, validateAll, firstInvalidField } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      fields.description.value.value = 'This description is long enough to pass'
      fields.url.value.value = 'https://example.com'

      validateAll()

      expect(firstInvalidField.value).toBeNull()
    })

    it('errorCount returns the number of invalid fields', () => {
      const { fields, validateAll, errorCount } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      // description and url are empty
      validateAll()

      expect(errorCount.value).toBe(2)
    })

    it('errorCount is 0 when all fields are valid', () => {
      const { fields, validateAll, errorCount } = useFormValidation(createTestConfig())

      fields.title.value.value = 'Valid Title'
      fields.description.value.value = 'This description is long enough to pass'
      fields.url.value.value = 'https://example.com'

      validateAll()

      expect(errorCount.value).toBe(0)
    })
  })

  describe('shouldShowCharCount', () => {
    it('returns false when field has no maxLength configured', () => {
      const config: Record<string, FieldConfig> = {
        notes: { rules: [] },
      }
      const { shouldShowCharCount } = useFormValidation(config)

      expect(shouldShowCharCount('notes')).toBe(false)
    })

    it('returns false when value length is at or below 80% of maxLength', () => {
      const { fields, shouldShowCharCount } = useFormValidation(createTestConfig())

      // maxLength for title is 100, 80% = 80
      fields.title.value.value = 'a'.repeat(80)
      expect(shouldShowCharCount('title')).toBe(false)
    })

    it('returns true when value length exceeds 80% of maxLength', () => {
      const { fields, shouldShowCharCount } = useFormValidation(createTestConfig())

      // maxLength for title is 100, 80% = 80
      fields.title.value.value = 'a'.repeat(81)
      expect(shouldShowCharCount('title')).toBe(true)
    })

    it('returns true when value is at maxLength', () => {
      const { fields, shouldShowCharCount } = useFormValidation(createTestConfig())

      fields.title.value.value = 'a'.repeat(100)
      expect(shouldShowCharCount('title')).toBe(true)
    })

    it('returns false for unknown field name', () => {
      const { shouldShowCharCount } = useFormValidation(createTestConfig())

      expect(shouldShowCharCount('nonexistent')).toBe(false)
    })
  })
})
