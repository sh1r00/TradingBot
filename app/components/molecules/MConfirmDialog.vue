<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    :aria-describedby="messageId"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-on-surface/40 transition-opacity duration-200 motion-reduce:transition-none"
      aria-hidden="true"
      @click="$emit('cancel')"
    />

    <!-- Dialog content -->
    <ACard
      variant="elevated"
      padding="lg"
      class="relative z-10 w-full max-w-md mx-4"
    >
      <div class="flex flex-col gap-4">
        <AText :id="titleId" tag="h2" variant="headline-sm">
          {{ title }}
        </AText>

        <AText :id="messageId" tag="p" variant="body-md" class="text-on-surface-variant">
          {{ message }}
        </AText>

        <div class="flex items-center justify-end gap-3 pt-2">
          <AButton
            variant="text"
            :aria-label="cancelLabel"
            @click="$emit('cancel')"
          >
            {{ cancelLabel }}
          </AButton>

          <AButton
            variant="filled"
            :aria-label="confirmLabel"
            @click="$emit('confirm')"
          >
            {{ confirmLabel }}
          </AButton>
        </div>
      </div>
    </ACard>
  </div>
</template>

<script setup lang="ts">
import ACard from '~/components/atoms/ACard.vue'
import AText from '~/components/atoms/AText.vue'
import AButton from '~/components/atoms/AButton.vue'

export interface MConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

withDefaults(defineProps<MConfirmDialogProps>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
})

defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = 'confirm-dialog-title'
const messageId = 'confirm-dialog-message'
</script>
