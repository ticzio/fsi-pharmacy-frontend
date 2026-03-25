<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUsers } from '@/composables/Models/useUsers'
import { useClients, type ClientInterface } from '@/composables/Models/useClients'
import { useCookies } from '@/composables/useCookies'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ChatIframe from '@/components/common/ChatIframe.vue'

const route = useRoute()
const { getUser, user: adminUser } = useUsers()
const { getClient, client: targetClientRef } = useClients()
const { getCookie } = useCookies()

const targetClient = inject<Ref<ClientInterface | null>>('targetClient', targetClientRef)

const isLoading = ref(true)

const adminCode = computed(() => (adminUser.value as any)?.code || 'No tiene')
const clientCode = computed(() => (targetClient.value as any)?.code || 'No tiene')

onMounted(async () => {
  try {
    isLoading.value = true

    // 1. Obtener datos del administrador logueado para extraer su código
    const adminId = getCookie('fsi_admin_id_user')
    if (adminId) {
      await getUser(adminId)
    }

    // 2. Usar datos del cliente inyectado (o cargarlos si no están disponibles)
    if (!targetClient.value) {
      const clientId = route.params.id as string
      if (clientId) {
        await getClient(clientId)
      }
    }
  } catch (error) {
    console.error('Error al cargar datos para el Iframe de chat de usuario:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div
    class="col-12 bg-white rounded-3 shadow-sm border d-flex flex-column overflow-hidden w-100 position-relative animate__animated animate__fadeIn"
    style="height: calc(85vh - 120px); min-height: 600px"
  >
    <LoadingOverlay v-if="isLoading" message="Preparando conexión con el chat..." />

    <ChatIframe
      v-else-if="adminCode !== 'No tiene' && clientCode !== 'No tiene'"
      user-type="client"
      :code-user="adminCode"
      :code-client="clientCode"
      view="backoffice_client"
      class="flex-grow-1"
    />

    <div v-else class="text-danger d-flex flex-column align-items-center justify-content-center p-5 h-100 bg-light bg-opacity-50">
      <div class="mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-chat-dots-fill text-muted mb-3" viewBox="0 0 16 16">
          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        </svg>
      </div>
      <h5 class="fw-bold">No se pudo cargar la sala de chat</h5>
      <p class="text-center text-muted">Asegúrese de que el usuario tenga un código válido asignado.</p>
      <div class="mt-2 p-2 rounded bg-white border small text-muted">
        <code>Admin: {{ adminCode }}</code> | <code>Cliente: {{ clientCode }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate__animated {
  animation-duration: 0.5s;
}
</style>
