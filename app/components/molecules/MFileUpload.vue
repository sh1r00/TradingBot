<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <AButton
        variant="tonal"
        size="sm"
        :aria-label="'Choose file'"
        @click="triggerFileInput"
      >
        <AText tag="span" variant="label-lg">
          Choose File
        </AText>
      </AButton>

      <AText
        v-if="fileName"
        tag="span"
        variant="body-sm"
        class="text-on-surface-variant truncate max-w-48"
      >
        {{ fileName }}
      </AText>

      <AText
        v-else
        tag="span"
        variant="body-sm"
        class="text-on-surface-variant"
      >
        No file selected
      </AText>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      class="sr-only"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      @change="handleFileChange"
    />

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AButton from '~/components/atoms/AButton.vue'
import AText from '~/components/atoms/AText.vue'

export interface MFileUploadProps {
  accept?: string
  maxSize?: number
  error?: string
}

withDefaults(defineProps<MFileUploadProps>(), {
  accept: 'image/jpeg,image/png,image/webp',
  maxSize: 2097152,
})

const emit = defineEmits<{
  'file-selected': [file: File]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const fileName = ref('')
const errorId = 'file-upload-error'

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    fileName.value = file.name
    emit('file-selected', file)
  }
}
</script>
