<template>
  <dashboardLayout>
    <div class="container-fluid py-4">
      <!-- Título de la Sección -->
      <TitleSection
        title="Mi Perfil"
        description="Gestiona tu información personal y opciones de seguridad."
        :isLoading="loading"
      />

      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-body p-4 p-md-5">
              <!-- Formulario del Operador -->
              <OperatorForm v-if="!loading" :form="form" :roleOptions="roles" />

              <!-- Esqueleto de carga -->
              <div v-else class="placeholder-glow">
                <div class="row g-4">
                  <div class="col-md-3">
                    <div
                      class="placeholder rounded-circle mx-auto"
                      style="width: 150px; height: 150px"
                    ></div>
                  </div>
                  <div class="col-md-9">
                    <div class="row g-3">
                      <div class="col-md-6" v-for="i in 6" :key="i">
                        <div class="placeholder col-12 h-10 w-100 rounded-pill mb-2"></div>
                        <div class="placeholder col-12 h-40 w-100 rounded-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                <button
                  type="button"
                  class="btn btn-light px-4 py-2 rounded-pill fw-bold"
                  @click="$router.push('/dashboard')"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-primary px-5 py-2 rounded-pill fw-bold d-flex align-items-center gap-2"
                  :disabled="loading"
                  @click="handleUpdate"
                >
                  <i v-if="loading" class="spinner-border spinner-border-sm"></i>
                  <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsers } from '@/composables/Models/useUsers'
import { useStore } from 'vuex'
import { useCookies } from '@/composables/useCookies'
import TitleSection from '@/components/common/titleSection.vue'
import OperatorForm from '@/components/Operators/OperatorForm.vue'
import dashboardLayout from '@/components/DashboardLayout.vue'

const { getUser, saveUser, getRoles, roles, loading } = useUsers()
const store = useStore()
const { getCookie } = useCookies()

const userId = getCookie('fsi_pharmacy_id_user')

const form = ref<any>({
  id: '',
  id_type_rol_user: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  url_image: null,
  password: '',
  password_confirmation: '',
})

onMounted(async () => {
  // 1. Cargar roles para que OperatorForm tenga las opciones
  await getRoles()

  // 2. Cargar datos del perfil del usuario autenticado
  try {
    const response: any = await store.dispatch('getData', {
      url: 'auth/profile',
    })

    if (response.code === 200) {
      const userData = response.data
      // Mapear los datos al formulario para edición
      form.value = {
        ...form.value,
        ...userData,
        // Limpiamos contraseñas por seguridad (no queremos el hash del backend)
        password: '',
        password_confirmation: '',
      }
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
  }
})

/**
 * Lógica para actualizar el perfil
 */
const handleUpdate = async () => {
  if (!userId) return

  const success = await saveUser(form.value, true, userId)
  if (success) {
    // El composable useUsers ya maneja el SweetAlert de éxito.
    // Podríamos limpiar las contraseñas después de un cambio exitoso.
    form.value.password = ''
    form.value.password_confirmation = ''
  }
}
</script>

<style scoped>
.placeholder-glow .placeholder {
  background-color: #f0f2f5;
}

.card {
  transition: all 0.3s ease;
}

.btn-primary {
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
}
</style>
