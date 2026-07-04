import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue'

/**
 * A validation rule defines a named check with a validator function
 * and an i18n message key for the error.
 */
export interface ValidationRule {
  name: string
  validator: (value: unknown) => boolean
  message: string // i18n key
}

/**
 * Configuration for a single form field, including its validation rules
 * and optional length constraints.
 */
export interface FieldConfig {
  rules: ValidationRule[]
  maxLength?: number
  minLength?: number
}

/**
 * The reactive state of a single form field.
 */
export interface FieldState {
  value: Ref<string>
  status: 'pristine' | 'dirty' | 'valid' | 'invalid'
  error: string | null
  touched: boolean
}

/**
 * Return type of the useFormValidation composable.
 */
export interface UseFormValidation {
  fields: Record<string, FieldState>
  validate: (fieldName: string) => boolean
  validateAll: () => boolean
  reset: () => void
  isValid: ComputedRef<boolean>
  firstInvalidField: ComputedRef<string | null>
  errorCount: ComputedRef<number>
  shouldShowCharCount: (fieldName: string) => boolean
}

/**
 * Declarative form validation composable.
 *
 * Manages field states through a pristine → dirty → valid/invalid lifecycle.
 * Validates on blur (first interaction) and on demand via validate/validateAll.
 * Trims whitespace before validation. Error display and clear happens within 100ms.
 *
 * @param config - A record mapping field names to their FieldConfig
 * @returns UseFormValidation interface with fields, validation methods, and computed state
 */
export function useFormValidation(
  config: Record<string, FieldConfig>,
): UseFormValidation {
  const fields: Record<string, FieldState> = {}

  // Initialize field states
  for (const fieldName of Object.keys(config)) {
    fields[fieldName] = {
      value: ref(''),
      status: 'pristine',
      error: null,
      touched: false,
    }
  }

  /**
   * Validate a single field by name.
   * Trims whitespace before running rules.
   * Transitions field to 'valid' or 'invalid' state.
   * Returns true if the field passes all rules.
   */
  function validate(fieldName: string): boolean {
    const field = fields[fieldName]
    const fieldConfig = config[fieldName]

    if (!field || !fieldConfig) {
      return false
    }

    // Mark as touched and dirty on first validation
    field.touched = true
    if (field.status === 'pristine') {
      field.status = 'dirty'
    }

    // Trim whitespace before validation
    const trimmedValue = field.value.value.trim()

    // Check minLength constraint
    if (
      fieldConfig.minLength !== undefined &&
      trimmedValue.length > 0 &&
      trimmedValue.length < fieldConfig.minLength
    ) {
      field.status = 'invalid'
      field.error = 'validation.minLength'
      nextTick()
      return false
    }

    // Check maxLength constraint
    if (
      fieldConfig.maxLength !== undefined &&
      trimmedValue.length > fieldConfig.maxLength
    ) {
      field.status = 'invalid'
      field.error = 'validation.maxLength'
      nextTick()
      return false
    }

    // Run all validation rules in order
    for (const rule of fieldConfig.rules) {
      if (!rule.validator(trimmedValue)) {
        field.status = 'invalid'
        field.error = rule.message
        nextTick()
        return false
      }
    }

    // All rules passed
    field.status = 'valid'
    field.error = null
    nextTick()
    return true
  }

  /**
   * Validate all fields. Returns true only if every field passes.
   */
  function validateAll(): boolean {
    let allValid = true

    for (const fieldName of Object.keys(config)) {
      const result = validate(fieldName)
      if (!result) {
        allValid = false
      }
    }

    return allValid
  }

  /**
   * Reset all fields to pristine state with empty values.
   */
  function reset(): void {
    for (const fieldName of Object.keys(config)) {
      const field = fields[fieldName]
      field.value.value = ''
      field.status = 'pristine'
      field.error = null
      field.touched = false
    }
  }

  /**
   * Computed: true when all fields are in 'valid' status.
   */
  const isValid = computed(() => {
    return Object.keys(config).every(
      (fieldName) => fields[fieldName].status === 'valid',
    )
  })

  /**
   * Computed: returns the name of the first invalid field, or null if none.
   */
  const firstInvalidField = computed<string | null>(() => {
    for (const fieldName of Object.keys(config)) {
      if (fields[fieldName].status === 'invalid') {
        return fieldName
      }
    }
    return null
  })

  /**
   * Computed: returns the number of fields in 'invalid' status.
   */
  const errorCount = computed(() => {
    return Object.keys(config).filter(
      (fieldName) => fields[fieldName].status === 'invalid',
    ).length
  })

  /**
   * Determines whether the character count indicator should be shown for a field.
   * Shows when the current value length exceeds 80% of the configured maxLength.
   */
  function shouldShowCharCount(fieldName: string): boolean {
    const field = fields[fieldName]
    const fieldConfig = config[fieldName]

    if (!field || !fieldConfig || fieldConfig.maxLength === undefined) {
      return false
    }

    const currentLength = field.value.value.length
    const threshold = fieldConfig.maxLength * 0.8

    return currentLength > threshold
  }

  return {
    fields,
    validate,
    validateAll,
    reset,
    isValid,
    firstInvalidField,
    errorCount,
    shouldShowCharCount,
  }
}
