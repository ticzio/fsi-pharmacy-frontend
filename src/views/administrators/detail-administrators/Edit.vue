<template>
  <div class="container-fluid p-0">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="mb-4 d-flex justify-content-end" v-if="!loading">
          <DateTimeBadges :createdAt="form.created_at || form.timestamp" :updatedAt="form.updated_at" />
        </div>

        <AdministratorForm
          v-if="!loading"
          :form="form"
          :role-options="filteredRoles"
          :is-edit="true"
        />
        <div v-else class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div :class="['d-flex justify-content-end gap-2 mt-4', { 'sticky-bottom': isMobile }]">
          <button
            type="button"
            :class="BUTTONS.save.class"
            :disabled="loading"
            @click="saveChanges"
          >
            <LoadingSpinner v-if="loading" class="me-1" />
            <i v-else :class="BUTTONS.save.icon"></i>
            {{ BUTTONS.save.title }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useUsers } from '@/composables/Models/useUsers'
import AdministratorForm from '@/components/Administrators/AdministratorForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DateTimeBadges from '@/components/common/DateTimeBadges.vue'
import { BUTTONS } from '@/const/buttonConst'

const route = useRoute()
const router = useRouter()
const store = useStore()

const isMobile = computed(() => store.getters.isMobile)

const { loading, roles, getRoles, getUser, saveUser } = useUsers()

const form = ref({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  id_type_rol_user: null as any,
  url_image: '' as string | File,
  password: '',
  password_confirmation: '',
  created_at: '',
  updated_at: '',
  timestamp: '',
})

const filteredRoles = computed(() => {
  return roles.value.filter((role: any) => role.id !== 3)
})

const fetchAdminData = async () => {
  const adminId = route.params.id as string
  const data = await getUser(adminId)
  if (data) {
    form.value = {
      ...form.value,
      ...data,
      id_type_rol_user: data.id_type_rol || null,
      password: '', // Don't populate password
      password_confirmation: '',
    }
  }
}

const saveChanges = async () => {
  if (form.value.password && form.value.password !== form.value.password_confirmation) {
    // Note: The store dispatch handled errors, but we should probably use swalToast here if needed.
    // However, saveUser in the composable already handles success/error toasts.
    return
  }

  const success = await saveUser(form.value as any, true, route.params.id as string)
  if (success) {
    router.push('/administrators')
  }
}

onMounted(async () => {
  await Promise.all([getRoles(), fetchAdminData()])
})
</script>
