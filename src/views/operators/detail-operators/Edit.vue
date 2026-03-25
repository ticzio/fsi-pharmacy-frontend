<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import OperatorForm from '@/components/Operators/OperatorForm.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useRoute } from 'vue-router'
import { useUsers } from '@/composables/Models/useUsers'
import { useStore } from 'vuex'
import { BUTTONS } from '@/const/buttonConst'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DateTimeBadges from '@/components/common/DateTimeBadges.vue'

const route = useRoute()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { saveUser } = useUsers()

const props = defineProps({
  operatorData: {
    type: Object,
    default: null,
  },
})

const isLoading = ref(false)
const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role_id: 3, // Rol de operador por defecto
  id_pharmacy: null,
  url_image: '',
  password: '',
  password_confirmation: '',
})

const fillForm = (data: any) => {
  if (!data) return

  form.value = {
    id: data.id || null,
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    email: data.email || '',
    phone: data.phone || '',
    role_id: 3, // Siempre forzar a 3 en este módulo
    id_pharmacy: data.id_pharmacy || null,
    url_image: data.url_image || '',
    password: '',
    password_confirmation: '',
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const dataToSave = {
      ...form.value,
      id_type_rol_user: 3, // Siempre 3 para operadores
    }
    const success = await saveUser(dataToSave as any, true, form.value.id!)
    if (success) {
      form.value.password = ''
      form.value.password_confirmation = ''
    }
  } catch (error) {
    console.error('Error al actualizar el operador:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.operatorData,
  (newData) => {
    if (newData) {
      fillForm(newData)
    }
  },
  { immediate: true },
)

onMounted(async () => {
  // Ya no es necesario cargar roles ni datos (se obtienen por props)
})
</script>

<template>
  <div class="bg-white p-4 rounded-4 border shadow-sm position-relative">
    <LoadingOverlay v-if="isLoading" />
    <div class="d-flex justify-content-end mb-4">
      <DateTimeBadges :createdAt="operatorData?.created_at" :updatedAt="operatorData?.updated_at" />
    </div>
    <OperatorForm :form="form" :roleOptions="[]" />
    <div :class="['d-flex justify-content-end gap-2 mt-4', { 'sticky-bottom': isMobile }]">
      <button type="submit" :class="BUTTONS.save.class" :disabled="isLoading">
        <LoadingSpinner v-if="isLoading" />
        <i v-else :class="BUTTONS.save.icon"></i>
        {{ BUTTONS.save.title }}
      </button>
    </div>
  </div>
</template>
