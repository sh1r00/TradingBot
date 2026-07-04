<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-label="ariaLabel || undefined"
    :aria-invalid="ariaInvalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :aria-errormessage="ariaErrormessage || undefined"
    :aria-required="required || undefined"
    :class="[
      'min-h-11 min-w-11 w-full px-4 py-3',
      'rounded-lg border bg-surface text-on-surface',
      'text-base placeholder:text-on-surface-variant/60',
      'transition-colors duration-150 motion-reduce:transition-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:opacity-38 disabled:pointer-events-none',
      ariaInvalid
        ? 'border-error focus-visible:ring-error'
        : 'border-outline hover:border-on-surface',
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup lang="ts">
export interface AInputProps {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'url' | 'number' | 'tel' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  id?: string
  ariaLabel?: string
  ariaInvalid?: boolean
  ariaDescribedby?: string
  ariaErrormessage?: string
}

withDefaults(defineProps<AInputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
</script>
