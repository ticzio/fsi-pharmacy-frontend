<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import OperatorForm from '@/components/Operators/OperatorForm.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useStore } from 'vuex'
import { BUTTONS } from '@/const/buttonConst'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useRoute, useRouter } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'
import { useUsers } from '@/composables/Models/useUsers'

const route = useRoute()
const router = useRouter()

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const swalToast = useSwalToast()
const { loading, getUser, saveUser } = useUsers()
const form = ref<any>({
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

const roleOptions = ref<any[]>([])

const handleSubmit = async () => {
  try {
    const payload = {
      ...form.value,
      id_type_rol_user: 3,
      id_pharmacy: route.params.id_pharmacy,
    }
    const success = await saveUser(payload, true, route.params.id as string)
    if (success) {
      router.push({ name: 'Operadores de la Farmacia' })
    }
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

onMounted(async () => {
  if (route.params.id) {
    const data = await getUser(route.params.id as string)
    if (data) {
      form.value = {
        ...form.value,
        ...data,
        password: '',
        password_confirmation: '',
      }
    }
  }
})
</script>

<template>
  <div class="bg-white p-4 rounded-4 border shadow-sm position-relative">
    <LoadingOverlay v-if="loading" />
    <div class="d-flex justify-content-end mb-4">
      <DateTimeBadges :createdAt="form?.created_at" :updatedAt="form?.updated_at" />
    </div>
    <OperatorForm :form="form" :roleOptions="roleOptions" />
    <div :class="['d-flex justify-content-end gap-2 mt-4', { 'sticky-bottom': isMobile }]">
      <button type="submit" :class="BUTTONS.save.class" :disabled="loading">
        <LoadingSpinner v-if="loading" />
        <i v-else :class="BUTTONS.save.icon"></i>
        {{ BUTTONS.save.title }}
      </button>
    </div>
  </div>
</template>
