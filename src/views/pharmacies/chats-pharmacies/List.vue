<template>
  <div
    class="col-12 bg-white rounded-3 shadow-sm border d-flex flex-column overflow-hidden w-100"
    style="height: calc(80vh - 130px); min-height: 500px"
  >
    <LoadingOverlay v-if="isLoading" message="Cargando entorno de chat..." />
    <ChatIframe
      v-else-if="adminCode !== 'No tiene' && pharmacyCode !== 'No tiene'"
      user-type="operator"
      :code-user="adminCode"
      :code-pharmacy="pharmacyCode"
      view="backoffice_pharmacy"
    />
    <div v-else class="text-danger d-flex align-items-center justify-content-center p-4">
      No se pudo cargar la sala de chat. Faltan parámetros de configuración.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePharmacy } from '@/composables/Models/usePharmacy'
import { useUsers } from '@/composables/Models/useUsers'
import { useCookies } from '@/composables/useCookies'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ChatIframe from '@/components/common/ChatIframe.vue'

const route = useRoute()
const { getPharmacy, pharmacy } = usePharmacy()
const { getUser, user } = useUsers()
const { getCookie } = useCookies()

const isLoading = ref(true)

const adminCode = computed(() => {
  if (user.value) {
    return (user.value as any).code || 'No tiene'
  }
  return 'No tiene'
})
const pharmacyCode = computed(() => (pharmacy.value as any)?.code || 'No tiene')

onMounted(async () => {
  try {
    isLoading.value = true

    // Buscar al usuario por el ID de la cookie
    const userId = getCookie('fsi_pharmacy_id_user')
    if (userId) {
      await getUser(userId)
    }

    // Buscar la farmacia si aún no la tenemos cargada
    if (!pharmacy.value) {
      const idPharmacy = route.params.id_pharmacy as string
      if (idPharmacy) {
        await getPharmacy(idPharmacy)
      }
    }
  } catch (error) {
    console.error('Error al cargar datos para el Iframe de chat', error)
  } finally {
    isLoading.value = false
  }
})
</script>
