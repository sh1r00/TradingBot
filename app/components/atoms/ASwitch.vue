<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="[
      'relative inline-flex items-center shrink-0',
      'min-h-11 min-w-11 w-12 h-7 p-0.5',
      'rounded-full border-2 border-transparent',
      'transition-colors duration-200 motion-reduce:transition-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:opacity-38 disabled:pointer-events-none',
      modelValue ? 'bg-primary' : 'bg-outline',
    ]"
    @click="!disabled && $emit('update:modelValue', !modelValue)"
  >
    <span
      :class="[
        'pointer-events-none inline-block h-5 w-5 rounded-full shadow-sm',
        'transition-transform duration-200 motion-reduce:transition-none',
        modelValue ? 'translate-x-5 bg-on-primary' : 'translate-x-0 bg-surface',
      ]"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
export interface ASwitchProps {
  modelValue: boolean
  ariaLabel: string
  disabled?: boolean
}

withDefaults(defineProps<ASwitchProps>(), {
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
