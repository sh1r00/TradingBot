<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Forgot Password - Money Conversion SPA',
  description: 'Reset your password to regain access to your account.',
})

const auth = useAuthStore()
const localePath = useLocalePath()

const email = ref('')
const error = ref('')
const sent = ref(false)
const isSubmitting = ref(false)

function handleForgotPassword() {
  error.value = ''

  if (!email.value.trim()) {
    error.value = 'Please enter your email address'
    return
  }

  isSubmitting.value = true
  const token = auth.requestPasswordReset(email.value.trim())
  isSubmitting.value = false

  if (token) {
    sent.value = true
  } else {
    error.value = 'No account found with that email address'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-surface rounded-2xl p-8 shadow-lg border border-outline-variant">
      <!-- Success state -->
      <template v-if="sent">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mb-2">
            Check Your Email
          </h1>
          <p class="text-on-surface-variant mb-6">
            If an account exists for <strong>{{ email }}</strong>, we've sent a password reset link. The link expires in 1 hour and can only be used once.
          </p>
          <div class="bg-surface-variant rounded-xl p-4 mb-4 text-sm text-on-surface-variant">
            <p class="mb-1"><strong>Didn't receive the email?</strong></p>
            <p>Check your spam folder, or try again with the correct email address.</p>
          </div>
          <button
            class="text-primary hover:underline font-medium"
            @click="sent = false; email = ''"
          >
            Try a different email
          </button>
        </div>
      </template>

      <!-- Form state -->
      <template v-else>
        <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
          Forgot Password
        </h1>
        <p class="text-on-surface-variant text-center mb-6">
          Enter your email and we'll send you a one-time link to reset your password.
        </p>

        <div
          v-if="error"
          class="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-4 text-sm"
          role="alert"
          aria-live="assertive"
        >
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleForgotPassword">
          <div>
            <label
              for="forgot-email"
              class="block text-sm font-medium text-on-surface mb-1"
            >
              Email
            </label>
            <input
              id="forgot-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {{ isSubmitting ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>
      </template>

      <p class="text-sm text-on-surface-variant text-center mt-6">
        Remember your password?
        <NuxtLink
          :to="localePath('/login')"
          class="text-primary hover:underline font-medium"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
