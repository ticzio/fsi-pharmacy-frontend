<template>
  <div class="w-100 h-100 flex-grow-1">
    <div v-if="iframeUrl" class="w-100 h-100 flex-grow-1">
      <iframe
        :src="iframeUrl"
        allow="microphone"
        class="w-100 h-100 border-0 flex-grow-1"
      ></iframe>
    </div>
    <div v-else class="text-danger d-flex align-items-center justify-content-center p-4">
      No se pudo cargar la sala de chat. Faltan parámetros de configuración.
    </div>
    <ImageLightbox :url="lightbox_url" @close="lightbox_url = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ImageLightbox from '@/components/common/ImageLightbox.vue'

const props = defineProps<{
  userType: 'operator' | 'client'
  codeUser: string
  codePharmacy?: string
  view?: string
  codeOperator?: string
  codeClient?: string
}>()

const lightbox_url = ref<string | null>(null)

const handle_message = (event: MessageEvent) => {
  if (event.data && event.data.event === 'FSI_CHAT_PREVIEW_IMAGE') {
    lightbox_url.value = event.data.url
  }
}

onMounted(() => {
  window.addEventListener('message', handle_message)
})

onUnmounted(() => {
  window.removeEventListener('message', handle_message)
})

const iframeUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_CHAT_IFRAME_URL || ''
  
  if (!baseUrl || !props.userType || !props.codeUser) {
    console.warn('Iframe URL setup error: missing required params', {
      baseUrl,
      userType: props.userType,
      codeUser: props.codeUser,
    })
    return null
  }

  const params = new URLSearchParams()
  params.append('user_type', props.userType)
  params.append('code_user', props.codeUser)

  if (props.codePharmacy) {
    params.append('code_pharmacy', props.codePharmacy)
  }

  if (props.view) {
    params.append('view', props.view)
  }

  if (props.view === 'backoffice_operator' && props.codeOperator) {
    params.append('code_operator', props.codeOperator)
  }

  if (props.view === 'backoffice_client' && props.codeClient) {
    params.append('code_client', props.codeClient)
  }

  return `${baseUrl}/?${params.toString()}`
})
</script>
