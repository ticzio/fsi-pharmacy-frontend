<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'

import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import OperatorForm from '@/components/Operators/OperatorForm.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'

const router = useRouter()
const swalToast = useSwalToast()

const loading = ref(false)

const roleOptions = ref([
  { id: 1, name: 'Operador Principal' },
  { id: 2, name: 'Soporte Técnico' },
])

const form = reactive({
  url_image: null as File | null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role_id: null as any,
  password: '',
  password_confirmation: '',
})

const saveOperator = async () => {
  if (!form.first_name || !form.last_name || !form.email || !form.role_id) {
    swalToast.showError('Por favor, completa los campos obligatorios.')
    return
  }
  if (form.password && form.password !== form.password_confirmation) {
    swalToast.showError('Las contraseñas no coinciden.')
    return
  }

  loading.value = true
  try {
    console.log('Guardando operador:', form)
    // Aquí iría el dispatch al action de Vuex o llamada API
    // await store.dispatch('operators/createOperator', form)
    swalToast.showSuccess('Operador creado exitosamente')
    router.push('/operators')
  } catch (error) {
    console.error('Error al guardar:', error)
    swalToast.showError('Ocurrió un error al intentar guardar el operador.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100 gap-4">
      <div class="d-flex justify-content-between align-items-center">
        <titleSection
          :title="TITLE_SECTION_COMPONENT.operators.new"
          :description="TITLE_SECTION_COMPONENT.operators.newDescription"
          :show-logo="true"
        />
      </div>
      <div class="card border border-light shadow-sm rounded-4 p-4 flex-grow-1 overflow-auto">
        <form id="operatorForm" @submit.prevent="saveOperator" class="d-flex flex-column gap-4">
          <OperatorForm :form="form" :roleOptions="roleOptions" />
        </form>
      </div>
      <!-- BOTONES DE ACCIÓN -->
      <div class="d-flex justify-content-end gap-3 mt-4">
        <button
          type="submit"
          form="operatorForm"
          class="btn btn-primary px-4 fw-medium d-flex align-items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-save"></i>
          Guardar
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>
