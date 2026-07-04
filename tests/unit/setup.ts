import { configureGlobal } from 'fast-check'
import { vi } from 'vitest'

// Configure fast-check with minimum 100 iterations per property test
configureGlobal({
  numRuns: 100,
  verbose: false,
})

// Provide Nuxt auto-import stubs that aren't available in vitest
vi.stubGlobal('useRouter', () => ({
  push: vi.fn(),
  replace: vi.fn(),
  currentRoute: { value: { fullPath: '/' } },
}))

vi.stubGlobal('useRoute', () => ({
  query: {},
  params: {},
  fullPath: '/',
  path: '/',
}))

vi.stubGlobal('useLocalePath', () => (path: string) => path)
vi.stubGlobal('localePath', (path: string) => path)
vi.stubGlobal('useRuntimeConfig', () => ({ public: { baseUrl: 'http://localhost:3000' } }))
