import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null | undefined

/**
 * Returns a Supabase client when `NUXT_PUBLIC_SUPABASE_URL` + `NUXT_PUBLIC_SUPABASE_ANON_KEY`
 * are configured, otherwise `null` — in which case auth is disabled and the UI
 * shows an honest "not configured" state instead of a fake localStorage login.
 */
export function useSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client
  const config = useRuntimeConfig()
  const url = (config.public.supabaseUrl as string) || ''
  const anonKey = (config.public.supabaseAnonKey as string) || ''
  _client = url && anonKey ? createClient(url, anonKey) : null
  return _client
}
