<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'
import { useUsers } from '@/composables/Models/useUsers'

import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import AdministratorForm from '@/components/Administrators/AdministratorForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'
import { BUTTONS } from '@/const/buttonConst'

const router = useRouter()
const swalToast = useSwalToast()
const { loading, roles, getRoles, saveUser } = useUsers()

onMounted(async () => {
  await getRoles()
})

const filteredRoles = computed(() => {
  return roles.value.filter((role: any) => role.id !== 3)
})

const form = reactive({
  url_image: null as File | null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  id_type_rol_user: null as any,
  password: '',
  password_confirmation: '',
})

const saveAdministrator = async () => {
  if (!form.first_name || !form.last_name || !form.email || !form.id_type_rol_user) {
    swalToast.showError('Por favor, completa los campos obligatorios.')
    return
  }

  if (form.password && form.password !== form.password_confirmation) {
    swalToast.showError('Las contraseñas no coinciden.')
    return
  }

  if (!form.password) {
    swalToast.showError('La contraseña es obligatoria para nuevos administradores.')
    return
  }

  const success = await saveUser(form as any, false)
  if (success) {
    router.push('/administrators')
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100 gap-3">
      <div class="d-flex justify-content-between align-items-center">
        <titleSection
          :title="TITLE_SECTION_COMPONENT.administrators.new"
          :description="TITLE_SECTION_COMPONENT.administrators.newDescription"
          :show-logo="true"
        />
      </div>

      <div class="flex-grow-1">
        <form id="adminForm" @submit.prevent="saveAdministrator">
          <AdministratorForm :form="form" :roleOptions="filteredRoles" :is-edit="false" />
        </form>
      </div>

      <!-- BOTONES DE ACCIÓN COMPACTOS -->
      <div class="card border-0 shadow-sm rounded-4 p-2 bg-white sticky-bottom">
        <div class="d-flex justify-content-end gap-2">
          <button type="submit" form="adminForm" :class="BUTTONS.save.class" :disabled="loading">
            <LoadingSpinner v-if="loading" />
            <i v-else :class="BUTTONS.save.icon"></i>
            {{ BUTTONS.save.title }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped></style>
