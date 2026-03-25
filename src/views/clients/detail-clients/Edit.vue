<script setup lang="ts">
import { ref, onMounted, reactive, inject, watch, type Ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ClientForm from '@/components/Clients/ClientForm.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DateTimeBadges from '@/components/common/DateTimeBadges.vue'
import { useClients, type ClientInterface } from '@/composables/Models/useClients'
import { useSwalToast } from '@/composables/useSwalToast'
import { BUTTONS } from '@/const/buttonConst'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const { getClient, saveClient } = useClients()
const swalToast = useSwalToast()
const isLoading = ref(false)

const targetClient = inject<Ref<ClientInterface | null>>('targetClient')
const isMobile = computed(() => store.getters.isMobile)
const form = reactive({
  url_image: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  ci: '',
  born_date: '',
  gender: '',
  id_type_city: '' as string | number,
  type_level: null as any,
  point_level: 0,
  password: '',
  password_confirmation: '',
  created_at: '',
  updated_at: '',
})

const fetchUserData = async () => {
  if (targetClient?.value) {
    populateForm(targetClient.value)
    return
  }

  isLoading.value = true
  const data = await getClient(route.params.id as string)
  if (data) {
    populateForm(data)
  }
  isLoading.value = false
}

const populateForm = (data: ClientInterface) => {
  form.url_image = (data.url_image as string) || ''
  form.first_name = data.first_name || ''
  form.last_name = data.last_name || ''
  form.email = data.email || ''
  form.phone = data.phone || ''
  form.ci = String(data.ci || '')
  form.born_date = data.born_date ? data.born_date.replace(/\//g, '-') : ''
  form.gender = data.gender || ''
  form.id_type_city = data.id_type_city || ''
  form.type_level = data.type_level || null
  form.point_level = data.point_level || 0
  form.created_at = (data as any).created_at || ''
  form.updated_at = (data as any).updated_at || ''
}

watch(
  () => targetClient?.value,
  (newClient) => {
    if (newClient) {
      populateForm(newClient)
    }
  },
  { immediate: true },
)

const updateClient = async () => {
  if (!form.first_name || !form.last_name || !form.email) {
    swalToast.showError('Por favor, completa los campos obligatorios.')
    return
  }

  isLoading.value = true
  const clientData = {
    ...form,
    id: route.params.id as string,
  }

  await saveClient(clientData as any, true, route.params.id as string)
  isLoading.value = false
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div class="position-relative">
    <LoadingOverlay v-if="isLoading" />
    <form @submit.prevent="updateClient">
      <!-- Información del Nivel (Solo lectura) -->
      <div
        class="mb-4 p-3 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
      >
        <div class="d-flex align-items-center flex-wrap gap-4">
          <div
            class="d-flex align-items-center gap-2 border rounded-pill px-3 py-1 shadow-sm bg-white"
          >
            <i class="bi bi-award-fill text-primary fs-5"></i>
            <span class="small text-muted">Nivel Actual:</span>
            <span class="fw-bold text-dark">{{ form.type_level?.name || 'Cargando...' }}</span>
          </div>
          <div
            class="d-flex align-items-center gap-2 border rounded-pill px-3 py-1 shadow-sm bg-white"
          >
            <i class="bi bi-star-fill text-warning fs-5"></i>
            <span class="small text-muted">Puntos Acumulados:</span>
            <span class="fw-bold text-dark">{{ form.point_level || 0 }} pts</span>
          </div>
        </div>

        <DateTimeBadges :createdAt="form.created_at" :updatedAt="form.updated_at" />
      </div>

      <ClientForm :form="form" :is-edit="true" />
      <div :class="['d-flex justify-content-end gap-2 mt-4', { 'sticky-bottom': isMobile }]">
        <button type="submit" :class="BUTTONS.save.class" :disabled="isLoading">
          <LoadingSpinner v-if="isLoading" />
          <i v-else :class="BUTTONS.save.icon"></i>
          {{ BUTTONS.save.title }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
