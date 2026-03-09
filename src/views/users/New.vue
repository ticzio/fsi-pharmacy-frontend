<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'

import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import UserForm from '@/components/Users/UserForm.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'

const router = useRouter()
const swalToast = useSwalToast()

const loading = ref(false)

const roleOptions = ref([
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Cliente' },
  { id: 3, name: 'Soporte' },
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

const saveUser = async () => {
  if (!form.first_name || !form.last_name || !form.email || !form.role_id) {
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
  try {
    console.log('Guardando usuario:', form)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    swalToast.showSuccess('Usuario creado exitosamente')
    router.push('/users')
  } catch (error) {
    console.error('Error al guardar:', error)
    swalToast.showError('Ocurrió un error al intentar guardar el usuario.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100 gap-3">
      <div class="d-flex justify-content-between align-items-center">
        <titleSection
          :title="TITLE_SECTION_COMPONENT.users.new"
          :description="TITLE_SECTION_COMPONENT.users.newDescription"
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
        <form id="userForm" @submit.prevent="saveUser">
          <UserForm :form="form" :roleOptions="roleOptions" :is-edit="false" />
        </form>
      </div>

      <!-- BOTONES DE ACCIÓN COMPACTOS -->
      <div class="card border-0 shadow-sm rounded-4 p-2 bg-white sticky-bottom">
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-sm btn-light px-4 fw-medium rounded-pill"
            @click="router.push('/users')"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="userForm"
            class="btn btn-sm btn-primary px-4 fw-medium d-flex align-items-center gap-2 rounded-pill shadow-sm"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
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
