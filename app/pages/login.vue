<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Login - Money Conversion SPA',
  description: 'Sign in to access exclusive content, daily check-ins, and free tools.',
})

const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')

// Check if redirected from signup
onMounted(() => {
  if (route.query.registered === 'true') {
    successMessage.value = 'Account created successfully! Please sign in.'
  }
})

function handleLogin() {
  error.value = ''

  if (!email.value.trim()) {
    error.value = 'Email is required'
    return
  }
  if (!password.value.trim()) {
    error.value = 'Password is required'
    return
  }

  isSubmitting.value = true
  const result = auth.login(email.value.trim(), password.value)
  isSubmitting.value = false

  if (result) {
    const redirect = (route.query.redirect as string) || localePath('/')
    router.push(redirect)
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-surface rounded-2xl p-8 shadow-lg border border-outline-variant">
      <h1 class="text-2xl font-bold text-on-surface mb-2 text-center">
        Sign In
      </h1>
      <p class="text-on-surface-variant text-center mb-6">
        Welcome back! Sign in to access your account.
      </p>

      <!-- Success message -->
      <div
        v-if="successMessage"
        class="bg-primary-container text-on-primary-container px-4 py-3 rounded-xl mb-4 text-sm"
        role="alert"
      >
        {{ successMessage }}
      </div>

      <!-- Error message -->
      <div
        v-if="error"
        class="bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-4 text-sm"
        role="alert"
        aria-live="assertive"
      >
        {{ error }}
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label
            for="login-email"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Email
          </label>
          <input
            id="login-email"
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
            for="login-password"
            class="block text-sm font-medium text-on-surface mb-1"
          >
            Password
          </label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-full font-medium text-sm tracking-wide bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-sm text-on-surface-variant text-center mt-6">
        Don't have an account?
        <NuxtLink
          :to="localePath('/signup')"
          class="text-primary hover:underline font-medium"
        >
          Create one
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
