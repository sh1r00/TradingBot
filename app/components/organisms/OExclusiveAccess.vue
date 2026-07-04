<template>
  <section
    class="py-12 px-4 bg-tertiary-container"
    aria-labelledby="exclusive-heading"
  >
    <div class="max-w-2xl mx-auto text-center">
      <h2
        id="exclusive-heading"
        class="text-2xl font-bold text-on-tertiary-container mb-4"
      >
        {{ $t('exclusive.title') }}
      </h2>

      <div
        v-if="!unlockedGatedContent"
        class="bg-surface rounded-2xl p-8"
      >
        <AIcon
          name="lock"
          class="text-4xl text-on-surface-variant mb-4 mx-auto"
          aria-hidden="true"
        />
        <p class="text-on-surface-variant mb-6">{{ $t('exclusive.locked') }}</p>
        <div class="flex flex-wrap justify-center gap-3">
          <AButton
            variant="filled"
            @click="handleUnlockAttempt"
          >
            {{ $t('exclusive.unlock') }}
          </AButton>
        </div>
      </div>

      <div v-else>
        <button
          class="w-full bg-surface rounded-2xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
          :aria-expanded="isExpanded"
          aria-controls="exclusive-content"
          @click="toggleAccess"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <AIcon
                name="lock_open"
                class="text-primary"
              />
              <span class="font-semibold text-on-surface">{{ $t('exclusive.unlocked') }}</span>
            </div>
            <AIcon
              :name="isExpanded ? 'expand_less' : 'expand_more'"
              class="text-on-surface-variant"
            />
          </div>
        </button>

        <div
          id="exclusive-content"
          v-show="isExpanded"
          class="bg-surface rounded-b-2xl p-6 -mt-2"
          :aria-hidden="!isExpanded"
        >
          <p class="text-on-surface-variant mb-4">{{ $t('exclusive.content') }}</p>
          
          <div
            v-if="showingUnlockToast"
            class="inline-flex items-center gap-2 px-3 py-2 bg-primary-container text-on-primary-container rounded-full text-sm"
            role="alert"
            aria-live="polite"
          >
            <AIcon name="celebration" size="sm" decorative />
            <span>{{ $t('exclusive.unlockedMessage') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAchievements } from '~/composables/useAchievements'
import { useToast } from '~/composables/useToast'
import AIcon from '~/components/atoms/AIcon.vue'
import AButton from '~/components/atoms/AButton.vue'

const { unlockedGatedContent, triggerShare } = useAchievements()
const toast = useToast()

const isExpanded = ref(false)
const showingUnlockToast = ref(false)

function toggleAccess(): void {
  if (unlockedGatedContent.value) {
    isExpanded.value = !isExpanded.value
  }
}

function handleUnlockAttempt(): void {
  // If user has already unlocked, expand the content
  if (unlockedGatedContent.value) {
    isExpanded.value = true
    return
  }

  // If not unlocked, prompt user to share
  toast.info($t('exclusive.shareToUnlock'))
  
  // Show temporary toast indicating what's needed
  showingUnlockToast.value = true
  setTimeout(() => {
    showingUnlockToast.value = false
  }, 3000)
}
</script>
