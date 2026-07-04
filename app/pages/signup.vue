<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Sign Up - Money Conversion SPA',
  description: 'Create an account to access exclusive content, daily check-ins, and free tools.',
})

const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isSubmitting = ref(false)

function handleSignup() {
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Name is required'
    return
  }
  if (!email.value.trim()) {
    error.value = 'Email is required'
    return
  }
  if (!password.value.trim()) {
    error.value = 'Password is required'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true
  const result = auth.signup(email.value.trim(), password.value, name.value.trim())
  isSubmitting.value = false

  if (result) {
    // Auto-login successful, redirect to home
    router.push(localePath('/'))
  } else {
    error.value = 'An account with this email already exists'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-surface rounded-2xl p-8 shadow-lg border border-outline-variant">
      <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
        Create Account
      </h1>
      <p class="text-on-surface-variant text-center mb-6">
        Join to unlock exclusive content, daily check-ins, and free tools.
      </p>

      <!-- Error message -->
      <div
        v-if="error"
        class="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-4 text-sm"
        role="alert"
        aria-live="assertive"
      >
        {{ error }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSignup">
        <div>
          <label
            for="signup-name"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Name
          </label>
          <input
            id="signup-name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            for="signup-email"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Email
          </label>
          <input
            id="signup-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            for="signup-password"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Password
          </label>
          <input
            id="signup-password"
            v-model="password"
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
            for="signup-confirm"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Confirm Password
          </label>
          <input
            id="signup-confirm"
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
          {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-sm text-on-surface-variant text-center mt-6">
        Already have an account?
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
