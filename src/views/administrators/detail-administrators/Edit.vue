<template>
  <div class="container-fluid p-0">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <AdministratorForm
          v-if="!isLoading"
          :form="form"
          :role-options="roleOptions"
          :is-edit="true"
        />
        <div v-else class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-light px-4" @click="router.push('/administrators')">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary px-4"
            :disabled="isSaving"
            @click="saveChanges"
          >
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSwal } from '@/composables/useSwal'
import { URLS } from '@/const/api'
import AdministratorForm from '@/components/Administrators/AdministratorForm.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { showSuccess, showError } = useSwal()

const isLoading = ref(true)
const isSaving = ref(false)
const roleOptions = ref([])

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role_id: null,
  url_image: '',
  password: '',
  password_confirmation: '',
})

const fetchRoles = async () => {
  try {
    const response = await store.dispatch('getData', {
      url: URLS.role.getAll,
    })
    if (response.code === 200) {
      roleOptions.value = response.data
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const fetchAdminData = async () => {
  isLoading.value = true
  try {
    const response = await store.dispatch('getData', {
      url: `${URLS.administrator.prefix}/${route.params.id}`,
    })
    if (response.code === 200) {
      const data = response.data
      form.value = {
        ...form.value,
        ...data,
        password: '', // Don't populate password
        password_confirmation: '',
      }
    }
  } catch (error) {
    console.error('Error fetching admin data:', error)
    showError('No se pudieron cargar los datos del administrador')
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    const payload: any = { ...form.value }
    // Remove password fields if they are empty
    if (!payload.password) {
      delete payload.password
      delete payload.password_confirmation
    }

    const response = await store.dispatch('postData', {
      url: `${URLS.administrator.update}/${route.params.id}`,
      data: payload,
    })

    if (response.code === 200) {
      showSuccess('Administrador actualizado correctamente')
      router.push('/administrators')
    } else {
      showError(response.message || 'Error al actualizar administrador')
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showError('Ocurrió un error al guardar los cambios')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchRoles(), fetchAdminData()])
})
</script>
