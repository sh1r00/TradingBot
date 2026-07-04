<template>
  <div class="relative">
    <AButton
      variant="text"
      size="sm"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Change language. Current: ${currentLocale}`"
      @click="isOpen = !isOpen"
    >
      <AText tag="span" variant="label-lg">
        {{ currentLocale.toUpperCase() }}
      </AText>
    </AButton>

    <ul
      v-if="isOpen"
      role="listbox"
      :aria-label="'Available languages'"
      class="absolute right-0 top-full mt-1 z-50 min-w-32 rounded-xl border border-outline-variant bg-surface shadow-lg py-1"
    >
      <li
        v-for="locale in locales"
        :key="locale.code"
        role="option"
        :aria-selected="locale.code === currentLocale"
      >
        <button
          type="button"
          :class="[
            'w-full text-left px-4 py-2 min-h-11',
            'text-sm font-medium',
            'transition-colors duration-150 motion-reduce:transition-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'hover:bg-on-surface/8',
            locale.code === currentLocale
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface',
          ]"
          @click="handleSelect(locale.code)"
        >
          <AText tag="span" variant="body-md">
            {{ locale.name }}
          </AText>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AButton from '~/components/atoms/AButton.vue'
import AText from '~/components/atoms/AText.vue'

export interface LocaleOption {
  code: string
  name: string
}

export interface MLanguageSwitcherProps {
  currentLocale: string
  locales: LocaleOption[]
}

defineProps<MLanguageSwitcherProps>()

const emit = defineEmits<{
  select: [code: string]
}>()

const isOpen = ref(false)

function handleSelect(code: string) {
  emit('select', code)
  isOpen.value = false
}
</script>
