<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface LeadCaptureProps {
  title?: string
  description?: string
  ctaText?: string
}

const props = withDefaults(defineProps<LeadCaptureProps>(), {
  title: 'Get Your Free Toolkit',
  description: 'Subscribe to receive exclusive money-making resources',
  ctaText: 'Send Me The Toolkit',
})

const emit = defineEmits<{
  (e: 'submit', email: string): void
}>()

const { t } = useI18n()
const isSubmitting = ref(false)
const email = ref('')
const error = ref('')

/**
 * Simple email validation
 */
const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const handleSubmit = async (event: Event) => {
  error.value = ''
  
  if (!email.value.trim()) {
    error.value = 'Email is required'
    return
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email'
    return
  }

  isSubmitting.value = true

  try {
    // API integration point: POST to /api/lead-capture with { email }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('submit', email.value)
    email.value = ''
  } catch (err) {
    error.value = 'Failed to submit. Please try again.'
    console.error('Lead capture error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleEmailChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  email.value = target.value
  if (error.value) error.value = ''
}

</script>

<template>
  <section
    class="w-full max-w-md mx-auto px-4 py-8 bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl shadow-lg"
    :aria-label="`${title} form`"
  >
    <!-- Header -->
    <div class="space-y-2 mb-6 text-center">
      <h2 class="text-2xl font-bold text-on-surface">{{ title }}</h2>
      <p class="text-sm text-on-surface-variant">{{ description }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email Input -->
      <div class="space-y-2">
        <label for="lead-email" class="block text-sm font-medium text-on-surface">
          Email Address
        </label>
        <input
          id="lead-email"
          type="email"
          :value="email"
          :aria-invalid="!!error"
          :aria-errormessage="error ? 'lead-email-error' : undefined"
          aria-required="true"
          placeholder="you@example.com"
          class="w-full px-4 py-2 bg-surface text-on-surface border-2 border-outline rounded-lg transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          @input="handleEmailChange"
        />
        <div
          v-if="error"
          id="lead-email-error"
          class="text-error text-sm font-medium"
          role="alert"
        >
          {{ error }}
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3 px-4 bg-primary text-on-primary font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        {{ isSubmitting ? 'Sending...' : ctaText }}
      </button>

      <!-- Privacy Note -->
      <p class="text-xs text-on-surface-variant text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  </section>
</template>

<style scoped>
/* Component-scoped animations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
