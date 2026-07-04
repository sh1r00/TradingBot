<script setup lang="ts">
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
    aria-live="polite"
    aria-label="Notifications"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-2"
    >
      <MToastItem
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :id="toast.id"
        :type="toast.type"
        :message="toast.message"
        :action="toast.action"
        class="pointer-events-auto"
        @dismiss="toastStore.remove(toast.id)"
        @pause="toastStore.pause(toast.id)"
        @resume="toastStore.resume(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
