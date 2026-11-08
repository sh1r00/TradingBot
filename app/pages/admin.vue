<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const adminEmails = (config.public.adminEmails as string[]) || []

const isAdmin = computed(() => {
  const email = (auth.currentUser?.email || '').toLowerCase()
  return !!email && adminEmails.includes(email)
})

onMounted(() => {
  auth.initialize()
})

async function handleLogout() {
  await auth.logout()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Auth not configured -->
    <div v-if="!auth.isConfigured" class="max-w-md mx-auto text-center py-12">
      <h1 class="text-2xl font-bold text-on-surface mb-3">Admin not configured</h1>
      <p class="text-on-surface-variant">
        Set <code>NUXT_PUBLIC_SUPABASE_URL</code> and
        <code>NUXT_PUBLIC_SUPABASE_ANON_KEY</code> (plus
        <code>NUXT_PUBLIC_ADMIN_EMAILS</code>) to enable the admin panel.
      </p>
    </div>

    <!-- Signed out -->
    <div v-else-if="!auth.isAuthenticated" class="max-w-md mx-auto text-center py-12">
      <h1 class="text-2xl font-bold text-on-surface mb-3">Sign in to continue</h1>
      <p class="text-on-surface-variant mb-6">You must be signed in to manage resources.</p>
      <NuxtLink
        :to="localePath('/login?redirect=/admin')"
        class="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90"
      >
        Sign In
      </NuxtLink>
    </div>

    <!-- Signed in but not an admin -->
    <div v-else-if="!isAdmin" class="max-w-md mx-auto text-center py-12">
      <h1 class="text-2xl font-bold text-on-surface mb-3">Access denied</h1>
      <p class="text-on-surface-variant">Your account does not have admin access.</p>
    </div>

    <!-- Admin panel -->
    <div v-else>
      <div class="flex justify-end mb-4">
        <AButton variant="outline" @click="handleLogout">Logout</AButton>
      </div>
      <OAdminPanel />
    </div>
  </div>
</template>
