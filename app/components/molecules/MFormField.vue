<template>
  <div class="flex flex-col gap-1">
    <AText
      tag="label"
      variant="label-lg"
      :class="['cursor-pointer', error ? 'text-error' : '']"
      :for="fieldId"
    >
      {{ label }}
    </AText>

    <slot>
      <AInput
        :id="fieldId"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedByIds"
        :aria-errormessage="error ? errorId : undefined"
      />
    </slot>

    <div class="flex items-center justify-between gap-2 min-h-5">
      <AText
        v-if="error"
        :id="errorId"
        tag="span"
        variant="body-sm"
        class="text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ error }}
      </AText>

      <AText
        v-else-if="helpText"
        :id="helpId"
        tag="span"
        variant="body-sm"
        class="text-on-surface-variant"
      >
        {{ helpText }}
      </AText>

      <AText
        v-if="showCharCount"
        tag="span"
        variant="label-sm"
        :class="[
          'ml-auto',
          charCount !== undefined && maxLength && charCount > maxLength
            ? 'text-error'
            : 'text-on-surface-variant',
        ]"
        :aria-label="`${charCount} of ${maxLength} characters used`"
      >
        {{ charCount }}/{{ maxLength }}
      </AText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AInput from '~/components/atoms/AInput.vue'
import AText from '~/components/atoms/AText.vue'

export interface MFormFieldProps {
  label: string
  error?: string
  helpText?: string
  charCount?: number
  maxLength?: number
  fieldId: string
}

const props = defineProps<MFormFieldProps>()

const errorId = computed(() => `${props.fieldId}-error`)
const helpId = computed(() => `${props.fieldId}-help`)

const describedByIds = computed(() => {
  const ids: string[] = []
  if (props.error) ids.push(errorId.value)
  else if (props.helpText) ids.push(helpId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const showCharCount = computed(() => {
  if (props.charCount === undefined || !props.maxLength) return false
  return props.charCount > 0.8 * props.maxLength
})
</script>
