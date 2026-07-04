<template>
  <label
    :for="htmlFor"
    :class="[
      'inline-flex items-center gap-1 cursor-pointer',
      'text-sm font-medium tracking-wide',
      error ? 'text-error' : 'text-on-surface',
    ]"
  >
    <slot />
    <span
      v-if="required"
      class="text-error"
      aria-hidden="true"
    >*</span>
  </label>
</template>

<script setup lang="ts">
export interface ALabelProps {
  htmlFor: string
  required?: boolean
  error?: boolean
}

withDefaults(defineProps<ALabelProps>(), {
  required: false,
  error: false,
})
</script>
