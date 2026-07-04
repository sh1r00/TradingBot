<template>
  <div
    class="py-4 px-6 bg-surface-variant text-on-surface-variant"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="max-w-4xl mx-auto text-center">
      <div class="flex items-center justify-center gap-3">
        <AIcon
          v-if="notificationType === 'morning'"
          name="brightness_5"
          size="md"
          decorative
        />
        <AIcon
          v-else-if="notificationType === 'evening'"
          name="brightness_3"
          size="md"
          decorative
        />
        <AIcon
          v-else-if="notificationType === 'weekend'"
          name="weekend"
          size="md"
          decorative
        />
        <AIcon
          v-else-if="notificationType === 'weekday'"
          name="work"
          size="md"
          decorative
        />
        <AIcon
          v-else
          name="info"
          size="md"
          decorative
        />
        
        <p class="font-medium">
          {{ message }}
        </p>
      </div>
      
      <p class="text-sm text-on-surface-variant mt-2">
        {{ lastActivityMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEngagementStore } from '~/stores/engagement'
import AIcon from '~/components/atoms/AIcon.vue'

interface Props {
  showWelcomeBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showWelcomeBack: true,
})

const { t } = useI18n()
const engagementStore = useEngagementStore()

// Determine notification type based on time of day and day of week
const notificationType = computed(() => {
  const hour = new Date().getHours()
  const dayOfWeek = new Date().getDay()
  
  // Weekend (Saturday=6, Sunday=0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'weekend'
  }
  
  // Morning (5 AM - 12 PM)
  if (hour >= 5 && hour < 12) {
    return 'morning'
  }
  
  // Evening (6 PM - 10 PM)
  if (hour >= 18 && hour < 22) {
    return 'evening'
  }
  
  // Default to weekday message
  return 'weekday'
})

// Get notification message based on type
const message = computed(() => {
  const type = notificationType.value
  
  switch (type) {
    case 'morning':
      return t('notification.morning')
    case 'evening':
      return t('notification.evening')
    case 'weekend':
      return t('notification.weekend')
    case 'weekday':
      return t('notification.weekday')
    default:
      return ''
  }
})

// Get last activity message
const lastActivityMessage = computed(() => {
  if (!props.showWelcomeBack) {
    return ''
  }
  
  if (!engagementStore.lastVisit) {
    return t('notification.welcomeFirst')
  }
  
  const lastVisitDate = new Date(engagementStore.lastVisit)
  const now = new Date()
  const diffMs = now.getTime() - lastVisitDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  let activityText: string
  if (diffDays === 0) {
    const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60))
    if (hoursAgo === 0) {
      activityText = t('notification.activityNow')
    } else if (hoursAgo === 1) {
      activityText = t('notification.activityHour', { count: 1 })
    } else {
      activityText = t('notification.activityHours', { count: hoursAgo })
    }
  } else if (diffDays === 1) {
    activityText = t('notification.activityDay', { count: 1 })
  } else {
    activityText = t('notification.activityDays', { count: diffDays })
  }
  
  return t('notification.welcomeBack', { activity: activityText })
})
</script>
