import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { useResourcesStore } from '~/stores/resources'
import OLeaderboard from '~/components/organisms/OLeaderboard.vue'
import AButton from '~/components/atoms/AButton.vue'
import AIcon from '~/components/atoms/AIcon.vue'
import ALink from '~/components/atoms/ALink.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      viral: { leaderboardTitle: 'Top Shared Resources' },
      resources: {
        categories: { general: 'General' },
        noResourcesTitle: 'No Resources Available Yet',
        noResourcesDescription: 'Check back soon for curated money-making resources.',
        error: 'Failed to load resources',
      },
      accessibility: { loading: 'Loading...' },
      common: { retry: 'Retry', openInNewTab: '{resource} - opens in new tab' },
    },
  },
})

const mockResources = [
  { id: '1', title: 'Top Resource', description: 'Desc 1', category: 'Investment', url: 'https://example.com/1', thumbnail: null, displayOrder: 0, isPublished: true, createdAt: '', updatedAt: '' },
  { id: '2', title: 'Second Resource', description: 'Desc 2', category: 'Trading', url: 'https://example.com/2', thumbnail: null, displayOrder: 1, isPublished: true, createdAt: '', updatedAt: '' },
  { id: '3', title: 'Third Resource', description: 'Desc 3', category: 'Education', url: 'https://example.com/3', thumbnail: null, displayOrder: 2, isPublished: true, createdAt: '', updatedAt: '' },
]

describe('OLeaderboard', () => {
  let store: ReturnType<typeof useResourcesStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useResourcesStore()
    store.fetchAll = vi.fn()
  })

  it('renders the leaderboard title', () => {
    store.links = mockResources
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.text()).toContain('Top Shared Resources')
  })

  it('renders rank indicators for each resource', () => {
    store.links = mockResources
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    // Should show ranks 1, 2, 3
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })

  it('renders resource titles', () => {
    store.links = mockResources
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.text()).toContain('Top Resource')
    expect(wrapper.text()).toContain('Second Resource')
  })

  it('shows loading skeleton when isLoading is true', () => {
    store.links = []
    store.isLoading = true
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('shows error message when error exists', () => {
    store.links = []
    store.isLoading = false
    store.error = 'Network error'

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load resources')
    expect(wrapper.text()).toContain('Network error')
    expect(wrapper.text()).toContain('Retry')
  })

  it('shows empty state when no resources', () => {
    store.links = []
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.text()).toContain('No Resources Available Yet')
  })

  it('excludes unpublished resources', () => {
    store.links = [
      ...mockResources,
      { id: '99', title: 'Hidden', description: 'Hidden', category: 'Hidden', url: 'https://example.com/99', thumbnail: null, displayOrder: 100, isPublished: false, createdAt: '', updatedAt: '' },
    ]
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(wrapper.text()).not.toContain('Hidden')
  })

  it('uses role="list" and aria-label on the list', () => {
    store.links = mockResources
    store.isLoading = false
    store.error = null

    const wrapper = mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    const list = wrapper.find('ol')
    expect(list.attributes('role')).toBe('list')
    expect(list.attributes('aria-label')).toBe('Top Shared Resources')
  })

  it('calls fetchAll on mount', () => {
    mount(OLeaderboard, { global: { plugins: [i18n], components: { AButton, AIcon, ALink } } })
    expect(store.fetchAll).toHaveBeenCalled()
  })
})
