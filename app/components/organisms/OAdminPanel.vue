<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useResourcesStore, type ResourceLink } from '~/stores/resources'
import { useFormValidation, type ValidationRule, type FieldConfig } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'
import AButton from '~/components/atoms/AButton.vue'
import AIcon from '~/components/atoms/AIcon.vue'
import AText from '~/components/atoms/AText.vue'
import AInput from '~/components/atoms/AInput.vue'
import ATextarea from '~/components/atoms/ATextarea.vue'
import ABadge from '~/components/atoms/ABadge.vue'
import ASpinner from '~/components/atoms/ASpinner.vue'
import ACard from '~/components/atoms/ACard.vue'
import ADivider from '~/components/atoms/ADivider.vue'

const resourcesStore = useResourcesStore()
const toast = useToast()

// Modal states
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedLinkId = ref<string | null>(null)

// Form validation for create/edit
const createEditFieldConfig: Record<string, FieldConfig> = {
  title: {
    rules: [
      {
        name: 'required',
        validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
        message: 'validation.required',
      },
      {
        name: 'minLength',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          return value.trim().length >= 3
        },
        message: 'validation.minLength',
      },
      {
        name: 'maxLength',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          return value.trim().length <= 100
        },
        message: 'validation.maxLength',
      },
    ],
    minLength: 3,
    maxLength: 100,
  },
  description: {
    rules: [
      {
        name: 'required',
        validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
        message: 'validation.required',
      },
      {
        name: 'minLength',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          return value.trim().length >= 10
        },
        message: 'validation.minLength',
      },
      {
        name: 'maxLength',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          return value.trim().length <= 500
        },
        message: 'validation.maxLength',
      },
    ],
    minLength: 10,
    maxLength: 500,
  },
  category: {
    rules: [
      {
        name: 'required',
        validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
        message: 'validation.required',
      },
    ],
  },
  url: {
    rules: [
      {
        name: 'required',
        validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
        message: 'validation.required',
      },
      {
        name: 'validHttpsUrl',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          const trimmed = value.trim()
          if (trimmed.length === 0) return false
          try {
            const parsed = new URL(trimmed)
            return parsed.protocol === 'https:'
          } catch {
            return false
          }
        },
        message: 'validation.invalidUrl',
      },
      {
        name: 'maxLength',
        validator: (value: unknown) => {
          if (typeof value !== 'string') return false
          return value.trim().length <= 2048
        },
        message: 'validation.maxLength',
      },
    ],
    maxLength: 2048,
  },
  thumbnailFile: {
    rules: [
      {
        name: 'validFileType',
        validator: (value: unknown) => {
          if (!(value instanceof File)) return false
          return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
        },
        message: 'validation.invalidFileType',
      },
      {
        name: 'fileSize',
        validator: (value: unknown) => {
          if (!(value instanceof File)) return false
          return value.size <= 2 * 1024 * 1024 // 2MB
        },
        message: 'validation.fileTooLarge',
      },
    ],
  },
}

const { fields: createEditFields, validate: validateForm, validateAll: validateAllForm, reset: resetForm, isValid: isCreateEditFormValid } =
  useFormValidation(createEditFieldConfig)

// Form validation for category
const categoryFieldConfig: Record<string, FieldConfig> = {
  category: {
    rules: [
      {
        name: 'required',
        validator: (value: unknown) => typeof value === 'string' && value.trim().length > 0,
        message: 'validation.required',
      },
    ],
  },
}

const { fields: categoryFields, validate: validateCategory } = useFormValidation(categoryFieldConfig)

// Initialize resources on mount
onMounted(() => {
  resourcesStore.fetchAll()
})

// Close modals and reset form when closing
function closeCreateModal(): void {
  isCreateModalOpen.value = false
  resetForm()
}

function closeEditModal(): void {
  isEditModalOpen.value = false
  resetForm()
}

function closeDeleteModal(): void {
  isDeleteModalOpen.value = false
  selectedLinkId.value = null
}

// Handle file selection for thumbnail
function handleFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    // Update the field value
    createEditFields.thumbnailFile.value.value = file
    // Validate the file field
    validateForm('thumbnailFile')
  }
}

// Create link
async function handleCreateLink(): void {
  const allValid = validateAllForm()
  if (!allValid) {
    toast.error('validation.fieldsNeedAttention', 'Please fix the errors and try again')
    return
  }

  try {
    const title = createEditFields.title.value.value.trim()
    const description = createEditFields.description.value.value.trim()
    const category = createEditFields.category.value.value.trim()
    const url = createEditFields.url.value.value.trim()
    const thumbnailFile = createEditFields.thumbnailFile.value.value as File | null

    // Convert file to base64 for storage
    let thumbnail: string | null = null
    if (thumbnailFile) {
      thumbnail = await fileToBase64(thumbnailFile)
    }

    resourcesStore.create({
      title,
      description,
      category,
      url,
      thumbnail,
      displayOrder: resourcesStore.links.length,
      isPublished: true,
    })

    toast.success('toast.linkCreated')
    closeCreateModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred while creating the link')
  }
}

// Edit link
async function handleEditLink(): void {
  const allValid = validateAllForm()
  if (!allValid) {
    toast.error('validation.fieldsNeedAttention', 'Please fix the errors and try again')
    return
  }

  if (!selectedLinkId.value) return

  try {
    const link = resourcesStore.links.find((l) => l.id === selectedLinkId.value)
    if (!link) return

    const title = createEditFields.title.value.value.trim()
    const description = createEditFields.description.value.value.trim()
    const category = createEditFields.category.value.value.trim()
    const url = createEditFields.url.value.value.trim()
    const thumbnailFile = createEditFields.thumbnailFile.value.value as File | null

    // Convert file to base64 if new file selected
    let thumbnail: string | null = link.thumbnail
    if (thumbnailFile) {
      thumbnail = await fileToBase64(thumbnailFile)
    }

    resourcesStore.update(selectedLinkId.value, {
      title,
      description,
      category,
      url,
      thumbnail,
    })

    toast.success('toast.linkUpdated')
    closeEditModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred while updating the link')
  }
}

// Delete link
function handleDeleteLink(): void {
  if (!selectedLinkId.value) return

  try {
    resourcesStore.delete(selectedLinkId.value)
    toast.success('toast.linkDeleted')
    closeDeleteModal()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred while deleting the link')
  }
}

// Prepare edit form
function openEditLink(link: ResourceLink): void {
  selectedLinkId.value = link.id
  createEditFields.title.value.value = link.title
  createEditFields.description.value.value = link.description
  createEditFields.category.value.value = link.category
  createEditFields.url.value.value = link.url
  createEditFields.thumbnailFile.value.value = null // Reset file field
  isEditModalOpen.value = true
}

// Prepare delete confirmation
function openDeleteLink(link: ResourceLink): void {
  selectedLinkId.value = link.id
  isDeleteModalOpen.value = true
}

// File to base64 converter
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

// Drag and drop for reordering
const dragState = ref<{
  draggedId: string | null
  draggedOverId: string | null
  dragStartIndex: number | null
}>({
  draggedId: null,
  draggedOverId: null,
  dragStartIndex: null,
})

function handleDragStart(event: DragEvent, link: ResourceLink, index: number): void {
  if (!(event.dataTransfer)) return
  dragState.value.draggedId = link.id
  dragState.value.dragStartIndex = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', link.id)
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function handleDragEnter(event: DragEvent, linkId: string): void {
  event.preventDefault()
  if (dragState.value.draggedId === linkId) return
  dragState.value.draggedOverId = linkId
}

function handleDragLeave(event: DragEvent, linkId: string): void {
  // Only clear if we're actually leaving the drop zone
  if (!event.currentTarget?.contains(event.relatedTarget as Node) && dragState.value.draggedOverId === linkId) {
    dragState.value.draggedOverId = null
  }
}

function handleDrop(event: DragEvent, targetLink: ResourceLink, targetIndex: number): void {
  event.preventDefault()
  if (!dragState.value.draggedId || dragState.value.dragStartIndex === null) return

  const draggedId = dragState.value.draggedId
  const startindex = dragState.value.dragStartIndex

  // Find the dragged link
  const draggedIndex = resourcesStore.links.findIndex((l) => l.id === draggedId)
  if (draggedIndex === -1) {
    dragState.value = {
      draggedId: null,
      draggedOverId: null,
      dragStartIndex: null,
    }
    return
  }

  // Remove from old position
  const [draggedLink] = resourcesStore.links.splice(draggedIndex, 1)
  
  // Insert at new position
  resourcesStore.links.splice(targetIndex, 0, draggedLink)

  // Reorder within each category
  const categories = new Set(resourcesStore.links.map((l) => l.category))
  categories.forEach((category) => {
    const categoryLinks = resourcesStore.links.filter((l) => l.category === category)
    resourcesStore.reorder(category, categoryLinks.map((l) => l.id))
  })

  toast.success('Link reordered')

  // Reset drag state
  dragState.value = {
    draggedId: null,
    draggedOverId: null,
    dragStartIndex: null,
  }
}

// Filter links by category
const selectedCategory = ref<string | null>(null)
const filteredLinks = computed(() => {
  if (!selectedCategory.value) {
    return resourcesStore.links
  }
  return resourcesStore.links.filter((link) => link.category === selectedCategory.value)
})

// Get all unique categories
const allCategories = computed(() => {
  const categories = new Set(resourcesStore.links.map((link) => link.category))
  return ['All', ...Array.from(categories).sort()]
})

// Helper to check if file was selected
function hasFileSelected(): boolean {
  return createEditFields.thumbnailFile.value.value instanceof File
}

// Helper to get thumbnail URL for display
function getThumbnailUrl(link: ResourceLink): string {
  if (link.thumbnail) {
    return link.thumbnail
  }
  // Default placeholder based on category
  const colors: Record<string, string> = {
    General: 'bg-blue-100 dark:bg-blue-900',
    'Learning Resources': 'bg-green-100 dark:bg-green-900',
    Tools: 'bg-purple-100 dark:bg-purple-900',
  }
  const categoryColor = colors[link.category] || 'bg-gray-100 dark:bg-gray-700'
  return `https://placehold.co/150x150/e5e7eb/6b7280?text=${encodeURIComponent(link.category)}`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <AText tag="h1" variant="headline-lg" class="text-on-surface">
          {{ $t('admin.title') }}
        </AText>
        <AText tag="p" variant="body-md" class="text-on-surface-variant mt-1">
          {{ $t('admin.allLinks') }}
        </AText>
      </div>
      <AButton @click="isCreateModalOpen = true">
        <template #icon-left>
          <AIcon name="add" />
        </template>
        {{ $t('admin.create') }}
      </AButton>
    </div>

    <!-- Category filter -->
    <div class="flex flex-wrap gap-2">
      <ABadge
        v-for="category in allCategories"
        :key="category"
        :variant="selectedCategory === category || (category === 'All' && !selectedCategory) ? 'filled' : 'outlined'"
        class="cursor-pointer transition-colors"
        @click="selectedCategory = category === 'All' ? null : category"
      >
        {{ category }}
      </ABadge>
    </div>

    <!-- Loading state -->
    <div v-if="resourcesStore.isLoading" class="flex flex-col items-center justify-center py-16">
      <ASpinner class="w-12 h-12 mb-4" />
      <AText tag="p" variant="body-md" class="text-on-surface-variant">
        {{ $t('common.loading') }}
      </AText>
    </div>

    <!-- Error state -->
    <div v-else-if="resourcesStore.error" class="flex flex-col items-center justify-center py-16">
      <AIcon name="error" class="w-16 h-16 text-error mb-4" />
      <AText tag="h3" variant="title-md" class="text-error mb-2">
        {{ $t('common.error') }}
      </AText>
      <AText tag="p" variant="body-md" class="text-on-surface-variant mb-6">
        {{ resourcesStore.error }}
      </AText>
      <AButton @click="resourcesStore.fetchAll">
        <template #icon-left>
          <AIcon name="refresh" />
        </template>
        {{ $t('common.retry') }}
      </AButton>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredLinks.length === 0" class="flex flex-col items-center justify-center py-16">
      <AIcon name="link_off" class="w-16 h-16 text-on-surface-variant mb-4" />
      <AText tag="h3" variant="title-md" class="text-on-surface mb-2">
        {{ $t('admin.emptyLinks') }}
      </AText>
      <AText tag="p" variant="body-md" class="text-on-surface-variant mb-6 max-w-md text-center">
        {{ $t('admin.noLinks') }}
      </AText>
      <AButton @click="isCreateModalOpen = true">
        <template #icon-left>
          <AIcon name="add" />
        </template>
        {{ $t('admin.create') }}
      </AButton>
    </div>

    <!-- Links grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ACard
        v-for="link in filteredLinks"
        :key="link.id"
        class="group transition-shadow hover:shadow-md"
        :draggable="true"
        @dragstart="handleDragStart($event, link, filteredLinks.indexOf(link))"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter($event, link.id)"
        @dragleave="handleDragLeave($event, link.id)"
        @drop="handleDrop($event, link, filteredLinks.indexOf(link))"
      >
        <div class="flex flex-col h-full">
          <!-- Thumbnail -->
          <div class="relative h-40 overflow-hidden rounded-t-lg">
            <AImage
              :src="getThumbnailUrl(link)"
              :alt="link.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              :fallback-classes="'w-full h-40 rounded-t-lg'"
            />
            <div class="absolute top-2 right-2">
              <ABadge variant="filled" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                {{ link.category }}
              </ABadge>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-col flex-grow p-4">
            <AText tag="h3" variant="title-md" class="text-on-surface mb-2 line-clamp-2" :title="link.title">
              {{ link.title }}
            </AText>
            <AText
              tag="p"
              variant="body-md"
              class="text-on-surface-variant mb-4 line-clamp-3 flex-grow"
              :title="link.description"
            >
              {{ link.description }}
            </AText>
            <AIcon name="language" class="w-4 h-4 text-on-surface-variant mb-2" />
            <AText tag="a" variant="body-sm" class="text-primary hover:underline truncate block">
              {{ link.url }}
            </AText>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 px-4 py-3 border-t border-outline-variant">
            <AButton variant="text" size="sm" @click="openEditLink(link)">
              <template #icon-left>
                <AIcon name="edit" size="sm" />
              </template>
              {{ $t('admin.edit') }}
            </AButton>
            <AButton variant="tonal" size="sm" class="text-error" @click="openDeleteLink(link)">
              <template #icon-left>
                <AIcon name="delete" size="sm" />
              </template>
              {{ $t('admin.delete') }}
            </AButton>
          </div>
        </div>
      </ACard>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div
    v-if="isCreateModalOpen || isEditModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
    @click.self="isCreateModalOpen ? closeCreateModal() : closeEditModal()"
  >
    <div
      class="w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden transition-all"
      role="dialog"
      :aria-modal="true"
      :aria-labelledby="isCreateModalOpen ? 'create-modal-title' : 'edit-modal-title'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <AText
          tag="h2"
          variant="title-lg"
          :id="isCreateModalOpen ? 'create-modal-title' : 'edit-modal-title'"
          class="text-on-surface"
        >
          {{ isCreateModalOpen ? $t('admin.createLink') : $t('admin.editLink') }}
        </AText>
        <button
          class="p-2 rounded-full hover:bg-outline-variant transition-colors"
          @click="isCreateModalOpen ? closeCreateModal() : closeEditModal()"
          :aria-label="$t('common.close')"
        >
          <AIcon name="close" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="isCreateModalOpen ? handleCreateLink() : handleEditLink()">
        <div class="p-6 space-y-4">
          <!-- Title -->
          <div class="space-y-1">
            <AText
              tag="label"
              variant="label-lg"
              class="cursor-pointer text-on-surface"
              for="title"
            >
              {{ $t('admin.titlePlaceholder') }}
            </AText>
            <AInput
              id="title"
              v-model="createEditFields.title.value"
              :aria-invalid="createEditFields.title.status === 'invalid' || undefined"
              :aria-describedby="createEditFields.title.status === 'invalid' ? 'title-error' : undefined"
              :aria-errormessage="createEditFields.title.status === 'invalid' ? 'title-error' : undefined"
              placeholder="Title"
              @blur="validateForm('title')"
            />
            <AText
              v-if="createEditFields.title.status === 'invalid'"
              id="title-error"
              tag="span"
              variant="body-sm"
              class="text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ $t(createEditFields.title.error || '') }}
            </AText>
            <AText
              v-else-if="createEditFields.title.value.value.length > 80"
              tag="span"
              variant="label-sm"
              class="text-on-surface-variant ml-auto"
              :aria-label="`${createEditFields.title.value.value.length} of 100 characters used`"
            >
              {{ createEditFields.title.value.value.length }}/100
            </AText>
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <AText
              tag="label"
              variant="label-lg"
              class="cursor-pointer text-on-surface"
              for="description"
            >
              {{ $t('admin.descriptionPlaceholder') }}
            </AText>
            <ATextarea
              id="description"
              v-model="createEditFields.description.value"
              :aria-invalid="createEditFields.description.status === 'invalid' || undefined"
              :aria-describedby="createEditFields.description.status === 'invalid' ? 'description-error' : undefined"
              :aria-errormessage="createEditFields.description.status === 'invalid' ? 'description-error' : undefined"
              :placeholder="$t('admin.descriptionPlaceholder')"
              rows="4"
              @blur="validateForm('description')"
            />
            <AText
              v-if="createEditFields.description.status === 'invalid'"
              id="description-error"
              tag="span"
              variant="body-sm"
              class="text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ $t(createEditFields.description.error || '') }}
            </AText>
            <AText
              v-else-if="createEditFields.description.value.value.length > 400"
              tag="span"
              variant="label-sm"
              class="text-on-surface-variant ml-auto"
              :aria-label="`${createEditFields.description.value.value.length} of 500 characters used`"
            >
              {{ createEditFields.description.value.value.length }}/500
            </AText>
          </div>

          <!-- Category -->
          <div class="space-y-1">
            <AText
              tag="label"
              variant="label-lg"
              class="cursor-pointer text-on-surface"
              for="category"
            >
              {{ $t('admin.categoryPlaceholder') }}
            </AText>
            <AInput
              id="category"
              v-model="createEditFields.category.value"
              :aria-invalid="createEditFields.category.status === 'invalid' || undefined"
              :aria-describedby="createEditFields.category.status === 'invalid' ? 'category-error' : undefined"
              :aria-errormessage="createEditFields.category.status === 'invalid' ? 'category-error' : undefined"
              :placeholder="$t('admin.categoryPlaceholder')"
              @blur="validateForm('category')"
            />
            <AText
              v-if="createEditFields.category.status === 'invalid'"
              id="category-error"
              tag="span"
              variant="body-sm"
              class="text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ $t(createEditFields.category.error || '') }}
            </AText>
          </div>

          <!-- URL -->
          <div class="space-y-1">
            <AText
              tag="label"
              variant="label-lg"
              class="cursor-pointer text-on-surface"
              for="url"
            >
              URL
            </AText>
            <AInput
              id="url"
              v-model="createEditFields.url.value"
              type="url"
              :aria-invalid="createEditFields.url.status === 'invalid' || undefined"
              :aria-describedby="createEditFields.url.status === 'invalid' ? 'url-error' : undefined"
              :aria-errormessage="createEditFields.url.status === 'invalid' ? 'url-error' : undefined"
              placeholder="https://"
              @blur="validateForm('url')"
            />
            <AText
              v-if="createEditFields.url.status === 'invalid'"
              id="url-error"
              tag="span"
              variant="body-sm"
              class="text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ $t(createEditFields.url.error || '') }}
            </AText>
            <AText
              v-else-if="createEditFields.url.value.value.length > 1638"
              tag="span"
              variant="label-sm"
              class="text-on-surface-variant ml-auto"
              :aria-label="`${createEditFields.url.value.value.length} of 2048 characters used`"
            >
              {{ createEditFields.url.value.value.length }}/2048
            </AText>
          </div>

          <!-- File Upload -->
          <div class="space-y-1">
            <AText
              tag="label"
              variant="label-lg"
              class="cursor-pointer text-on-surface"
              for="thumbnailFile"
            >
              {{ $t('admin.uploadImage') }}
            </AText>
            <div class="flex items-center gap-3">
              <input
                id="thumbnailFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                :aria-invalid="createEditFields.thumbnailFile.status === 'invalid' || undefined"
                :aria-describedby="createEditFields.thumbnailFile.status === 'invalid' ? 'thumbnailFile-error' : undefined"
                :aria-errormessage="createEditFields.thumbnailFile.status === 'invalid' ? 'thumbnailFile-error' : undefined"
                @change="handleFileSelect"
              />
              <AButton variant="outlined" size="sm" @click="document.getElementById('thumbnailFile')?.click()">
                {{ $t('common.select') || 'Select File' }}
              </AButton>
              <template v-if="hasFileSelected()">
                <div class="flex items-center gap-2">
                  <AIcon name="image" size="sm" class="text-on-surface-variant" />
                  <AText
                    tag="span"
                    variant="body-sm"
                    class="text-on-surface-variant"
                  >
                    {{ (createEditFields.thumbnailFile.value.value as File).name }}
                  </AText>
                </div>
              </template>
            </div>
            <AText
              v-if="createEditFields.thumbnailFile.status === 'invalid'"
              id="thumbnailFile-error"
              tag="span"
              variant="body-sm"
              class="text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ $t(createEditFields.thumbnailFile.error || '') }}
            </AText>
            <AText
              v-else-if="hasFileSelected()"
              tag="span"
              variant="body-sm"
              class="text-on-surface-variant"
            >
              {{ $t('validation.fileTooLarge') }}
            </AText>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-variant">
          <AButton @click="isCreateModalOpen ? closeCreateModal() : closeEditModal()">
            {{ $t('common.cancel') }}
          </AButton>
          <AButton
            type="submit"
            :loading="false"
            :disabled="!isCreateEditFormValid"
          >
            {{ isCreateModalOpen ? $t('common.save') : $t('common.save') }}
          </AButton>
        </div>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="isDeleteModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
    @click.self="closeDeleteModal()"
  >
    <div
      class="w-full max-w-md bg-surface rounded-xl shadow-xl overflow-hidden transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <AText tag="h2" variant="title-lg" id="delete-modal-title" class="text-on-surface">
          {{ $t('admin.deleteLink') }}
        </AText>
        <button
          class="p-2 rounded-full hover:bg-outline-variant transition-colors"
          @click="closeDeleteModal()"
          :aria-label="$t('common.close')"
        >
          <AIcon name="close" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-start gap-4">
          <AIcon name="warning" class="w-10 h-10 text-error shrink-0" />
          <div>
            <AText tag="p" variant="body-md" class="text-on-surface mb-2">
              {{ $t('admin.confirmDelete') }}
            </AText>
            <AText tag="p" variant="body-sm" class="text-on-surface-variant">
              {{ $t('admin.deleteWarning') }}
            </AText>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-variant">
        <AButton @click="closeDeleteModal()">
          {{ $t('common.cancel') }}
        </AButton>
        <AButton
          variant="tonal"
          class="text-error"
          @click="handleDeleteLink()"
        >
          {{ $t('common.delete') }}
        </AButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Drag and drop styles */
[draggable] {
  cursor: grab;
}

[draggable]:active {
  cursor: grabbing;
}

[draggable]:hover {
  border-color: var(--md-sys-color-outline-variant);
}

.drag-over {
  border-color: var(--md-sys-color-primary);
  background-color: var(--md-sys-color-primary-container);
}
</style>