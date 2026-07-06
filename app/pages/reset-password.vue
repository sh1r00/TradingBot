<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Reset Password - Money Conversion SPA',
  description: 'Set a new password for your account.',
})

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const token = ref((route.query.token as string) || '')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const isSubmitting = ref(false)
const isValidToken = ref(true)

// Check token validity on mount
onMounted(() => {
  if (!token.value.trim()) {
    isValidToken.value = false
  }
})

function handleReset() {
  error.value = ''

  if (!token.value.trim()) {
    isValidToken.value = false
    return
  }

  if (!newPassword.value.trim()) {
    error.value = 'Please enter a new password'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true
  const result = auth.resetPassword(token.value.trim(), newPassword.value)
  isSubmitting.value = false

  if (result) {
    success.value = true
  } else {
    error.value = 'Invalid or expired reset link. Please request a new one.'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-surface rounded-2xl p-8 shadow-lg border border-outline-variant">
      <!-- Invalid token -->
      <template v-if="!isValidToken">
        <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
          Invalid Link
        </h1>
        <p class="text-on-surface-variant text-center mb-6">
          This password reset link is invalid or missing. Please request a new one.
        </p>
        <NuxtLink
          :to="localePath('/forgot-password')"
          class="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors w-full text-center"
        >
          Request New Reset Link
        </NuxtLink>
      </template>

      <!-- Success -->
      <template v-else-if="success">
        <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
          Password Reset!
        </h1>
        <div class="bg-primary-container text-on-primary-container px-4 py-3 rounded-xl mb-4 text-sm text-center" role="alert">
          Your password has been updated successfully.
        </div>
        <NuxtLink
          :to="localePath('/login')"
          class="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors w-full text-center"
        >
          Sign In →
        </NuxtLink>
      </template>

      <!-- Reset form -->
      <template v-else>
        <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
          Reset Password
        </h1>
        <p class="text-on-surface-variant text-center mb-6">
          Enter your new password below.
        </p>

        <div
          v-if="error"
          class="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-4 text-sm"
          role="alert"
          aria-live="assertive"
        >
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleReset">
          <div>
            <label
              for="reset-password"
              class="block text-sm font-medium text-on-surface mb-1"
            >
              New Password
            </label>
            <input
              id="reset-password"
              v-model="newPassword"
              type="password"
              required
              autocomplete="new-password"
              minlength="6"
              class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label
              for="reset-confirm"
              class="block text-sm font-medium text-on-surface mb-1"
            >
              Confirm Password
            </label>
            <input
              id="reset-confirm"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>
