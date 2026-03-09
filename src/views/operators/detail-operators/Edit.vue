<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OperatorForm from '@/components/Operators/OperatorForm.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'

const route = useRoute()
const store = useStore()
const swalToast = useSwalToast()

const isLoading = ref(false)
const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role_id: null,
  url_image: '',
  password: '',
  password_confirmation: '',
})

const roleOptions = ref([
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Operador' },
])

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // Simulación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    swalToast.showSuccess('Operador actualizado correctamente')
  } catch (error) {
    swalToast.showError('Error al actualizar el operador')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (route.params.id) {
    // Lógica para cargar datos del operador
    // form.value = ...
  }
})
</script>

<template>
  <div class="bg-white p-4 rounded-4 border shadow-sm position-relative">
    <LoadingOverlay v-if="isLoading" />

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0 fw-bold text-primary">Información General del Operador</h5>
      <button
        class="btn btn-primary px-4 rounded-3 d-flex align-items-center gap-2"
        @click="handleSubmit"
        :disabled="isLoading"
      >
        <i class="bi bi-save"></i>
        Guardar Cambios
      </button>
    </div>

    <OperatorForm :form="form" :roleOptions="roleOptions" />
  </div>
</template>
