<template>
  <div
    class="col-12 bg-white rounded-3 shadow-sm border d-flex flex-column overflow-hidden w-100"
    style="height: calc(80vh - 130px); min-height: 500px"
  >
    <div v-if="loading" class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <ChatIframe
      v-else-if="currentAdminCode && operatorCode && pharmacyCode"
      user-type="operator"
      :code-user="currentAdminCode"
      :code-pharmacy="pharmacyCode"
      view="backoffice_operator"
      :code-operator="operatorCode"
    />
    <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
      <p v-if="!loading">No se pudo cargar la información necesaria para el chat.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsers } from '@/composables/Models/useUsers'
import { usePharmacy } from '@/composables/Models/usePharmacy'
import { useCookies } from '@/composables/useCookies'
import ChatIframe from '@/components/common/ChatIframe.vue'

const route = useRoute()
const { getUser } = useUsers()
const { getPharmacy } = usePharmacy()
const { getCookie } = useCookies()

const loading = ref(true)
const operatorCode = ref<string | null>(null)
const pharmacyCode = ref<string | null>(null)
const currentAdminCode = ref<string | null>(getCookie('fsi_pharmacy_code_user') || null)

onMounted(async () => {
  const operatorId = route.params.id as string
  if (!operatorId) {
    loading.value = false
    return
  }

  try {
    const operator = await getUser(operatorId)
    if (operator) {
      operatorCode.value = operator.code

      if (operator.id_pharmacy) {
        const pharmacy = await getPharmacy(operator.id_pharmacy)
        if (pharmacy) {
          pharmacyCode.value = pharmacy.code
        }
      }
    }
  } catch (error) {
    console.error('Error loading chat data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
