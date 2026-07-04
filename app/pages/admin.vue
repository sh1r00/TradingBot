<script setup lang="ts">
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')

onMounted(() => {
  if (localStorage.getItem('admin-auth')) {
    isAuthenticated.value = true
  }
})

function handleLogin() {
  loginError.value = ''
  if (password.value.trim()) {
    localStorage.setItem('admin-auth', 'true')
    isAuthenticated.value = true
  } else {
    loginError.value = 'Password is required'
  }
}

function handleLogout() {
  localStorage.removeItem('admin-auth')
  isAuthenticated.value = false
  password.value = ''
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <template v-if="isAuthenticated">
      <div class="flex justify-end mb-4">
        <AButton
          variant="outline"
          aria-label="Log out of admin panel"
          @click="handleLogout"
        >
          Logout
        </AButton>
      </div>
      <OAdminPanel />
    </template>

    <template v-else>
      <div class="max-w-md mx-auto mt-16">
        <h1 class="text-2xl font-bold text-on-surface mb-6 text-center">
          Admin Login
        </h1>
        <form
          class="space-y-4"
          @submit.prevent="handleLogin"
        >
          <div>
            <label
              for="admin-password"
              class="block text-sm font-medium text-on-surface mb-1"
            >
              Password
            </label>
            <input
              id="admin-password"
              v-model="password"
              type="password"
              class="w-full px-4 py-3 rounded-lg border border-outline bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              :aria-invalid="loginError ? 'true' : undefined"
              :aria-errormessage="loginError ? 'login-error' : undefined"
              autocomplete="current-password"
            />
            <p
              v-if="loginError"
              id="login-error"
              class="text-error text-sm mt-1"
              role="alert"
              aria-live="assertive"
            >
              {{ loginError }}
            </p>
          </div>
          <AButton
            type="submit"
            variant="filled"
            class="w-full"
          >
            Sign In
          </AButton>
        </form>
      </div>
    </template>
  </div>
</template>
