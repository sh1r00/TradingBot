<script setup lang="ts">
const toast = useToast()
const { t } = useI18n()
const config = useRuntimeConfig()

const shareUrl = computed(() => config.public.baseUrl as string)
const shareText = 'Check out these curated money-making resources!'

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    toast.success(t('viral.copySuccess'))
  } catch {
    toast.error(t('common.error'))
  }
}

function shareOnTwitter() {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  toast.success(t('viral.shareSuccess'))
}

function shareOnLinkedIn() {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  toast.success(t('viral.shareSuccess'))
}
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="share-heading"
  >
    <div class="max-w-2xl mx-auto text-center">
      <h2
        id="share-heading"
        class="text-2xl font-bold text-on-surface mb-2"
      >
        {{ $t('share.title') }}
      </h2>
      <p class="text-on-surface-variant mb-8">{{ $t('share.subtitle') }}</p>

      <div class="flex flex-wrap gap-3 justify-center">
        <AButton
          variant="filled"
          :aria-label="$t('share.copyLink')"
          @click="copyLink"
        >
          <AIcon name="link" class="mr-2" />
          {{ $t('share.copyLink') }}
        </AButton>
        <AButton
          variant="outlined"
          :aria-label="$t('share.twitter')"
          @click="shareOnTwitter"
        >
          {{ $t('share.twitter') }}
        </AButton>
        <AButton
          variant="outlined"
          :aria-label="$t('share.linkedin')"
          @click="shareOnLinkedIn"
        >
          {{ $t('share.linkedin') }}
        </AButton>
      </div>
    </div>
  </section>
</template>
