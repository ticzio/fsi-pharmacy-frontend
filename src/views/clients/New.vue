<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'

import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import ClientForm from '@/components/Clients/ClientForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'
import { useClients } from '@/composables/Models/useClients'

const router = useRouter()
const swalToast = useSwalToast()
const { saveClient } = useClients()

const loading = ref(false)

const form = reactive({
  url_image: null as File | null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  ci: '',
  born_date: '',
  gender: '',
  id_type_city: '',
  password: '',
  password_confirmation: '',
})

const saveUser = async () => {
  if (!form.first_name || !form.last_name || !form.email) {
    swalToast.showError('Por favor, completa los campos obligatorios.')
    return
  }

  if (form.password && form.password !== form.password_confirmation) {
    swalToast.showError('Las contraseñas no coinciden.')
    return
  }

  if (!form.password) {
    swalToast.showError('La contraseña es obligatoria para nuevos usuarios.')
    return
  }

  loading.value = true

  const clientData = {
    ...form,
    id: 0,
  }

  const success = await saveClient(clientData as any, false)
  loading.value = false

  if (success) {
    router.push('/clients')
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100 gap-3">
      <div class="d-flex justify-content-between align-items-center">
        <titleSection
          :title="TITLE_SECTION_COMPONENT.clients.new"
          :description="TITLE_SECTION_COMPONENT.clients.newDescription"
          :show-logo="true"
        />

        <button
          @click="router.back()"
          class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3"
        >
          <i class="bi bi-arrow-left"></i>
          Volver
        </button>
      </div>

      <div class="flex-grow-1">
        <form id="clientForm" @submit.prevent="saveUser">
          <ClientForm :form="form" :is-edit="false" />
        </form>
      </div>

      <!-- BOTONES DE ACCIÓN COMPACTOS -->
      <div class="card border-0 shadow-sm rounded-4 p-2 bg-white sticky-bottom">
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-sm btn-light px-4 fw-medium rounded-pill"
            @click="router.push('/clients')"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="clientForm"
            class="btn btn-sm btn-primary px-4 fw-medium d-flex align-items-center gap-2 rounded-pill shadow-sm"
            :disabled="loading"
          >
            <LoadingSpinner v-if="loading" />
            <i v-else class="bi bi-person-plus-fill"></i>
            Crear Usuario
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.sticky-bottom {
  position: sticky;
  bottom: 0.5rem;
  z-index: 10;
}
</style>
