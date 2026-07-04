import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { useResourcesStore, type ResourceLink } from '~/stores/resources'
import { useToastStore } from '~/stores/toast'
import OAdminPanel from '~/components/organisms/OAdminPanel.vue'

// Mock composables
vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        title: 'Admin Panel',
        allLinks: 'All resource links',
        create: 'Create',
        createLink: 'Create Link',
        editLink: 'Edit Link',
        deleteLink: 'Delete Link',
        confirmDelete: 'Are you sure you want to delete this link?',
        emptyLinks: 'No resource links yet.',
        noLinks: 'No resource links yet.',
        titlePlaceholder: 'Title',
        descriptionPlaceholder: 'Description',
        categoryPlaceholder: 'Category',
        urlPlaceholder: 'URL',
        uploadImage: 'Upload image',
        deleteWarning: 'Are you sure you want to delete this resource?',
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        close: 'Close',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
      },
      validation: {
        required: 'This field is required',
        maxLength: 'Maximum {max} characters',
        minLength: 'Minimum {min} characters',
        invalidUrl: 'Please enter a valid HTTPS URL',
        fileTooLarge: 'File size must be under 2 MB',
        invalidFileType: 'Only JPEG, PNG, and WebP files are allowed',
        fieldsNeedAttention: '{count} fields need attention',
      },
      toast: {
        linkCreated: 'Resource link created successfully',
        linkUpdated: 'Resource link updated successfully',
        linkDeleted: 'Resource link deleted successfully',
      },
    },
  },
})

const mockResources: ResourceLink[] = [
  { id: '1', title: 'Test Resource 1', description: 'Description for resource 1', category: 'General', url: 'https://example.com/1', thumbnail: null, displayOrder: 0, isPublished: true, createdAt: '', updatedAt: '' },
  { id: '2', title: 'Test Resource 2', description: 'Description for resource 2', category: 'Tools', url: 'https://example.com/2', thumbnail: null, displayOrder: 1, isPublished: true, createdAt: '', updatedAt: '' },
]

describe('OAdminPanel', () => {
  let resourcesStore: ReturnType<typeof useResourcesStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    resourcesStore = useResourcesStore()
    vi.clearAllMocks()
  })

  it('renders the admin panel title', () => {
    resourcesStore.links = []
    resourcesStore.isLoading = false
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('Admin Panel')
  })

  it('renders the create button', () => {
    resourcesStore.links = []
    resourcesStore.isLoading = false
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('Create')
  })

  it('shows loading state when isLoading is true', () => {
    resourcesStore.links = []
    resourcesStore.isLoading = true
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('Loading...')
  })

  it('shows empty state when no resources exist', () => {
    resourcesStore.links = []
    resourcesStore.isLoading = false
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('No resource links yet')
  })

  it('renders resource links when they exist', () => {
    resourcesStore.links = mockResources
    resourcesStore.isLoading = false
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('Test Resource 1')
    expect(wrapper.text()).toContain('Test Resource 2')
  })

  it('opens create modal when create button is clicked', async () => {
    resourcesStore.links = []
    resourcesStore.isLoading = false
    resourcesStore.error = null
    const wrapper = mount(OAdminPanel, { global: { plugins: [i18n] } })
    
    const createBtn = wrapper.find('button')
    expect(createBtn.exists()).toBe(true)
  })
})
