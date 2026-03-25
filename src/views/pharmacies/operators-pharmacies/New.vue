<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSwalToast } from '@/composables/useSwalToast'
import { useUsers } from '@/composables/Models/useUsers'
import { useStore } from 'vuex'
import { BUTTONS } from '@/const/buttonConst'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

import OperatorForm from '@/components/Operators/OperatorForm.vue'

const router = useRouter()

const route = useRoute()

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const swalToast = useSwalToast()
const { loading, saveUser } = useUsers()

const roleOptions = ref<any[]>([])

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
  if (!form.first_name || !form.last_name || !form.email) {
    swalToast.showError('Por favor, completa los campos obligatorios.')
    return
  }
  if (form.password && form.password !== form.password_confirmation) {
    swalToast.showError('Las contraseñas no coinciden.')
    return
  }

  try {
    const payload: any = {
      ...form,
      id_type_rol_user: 3,
      id_pharmacy: route.params.id_pharmacy,
    }
    console.log('Guardando operador:', payload)
    const success = await saveUser(payload, false)
    if (success) {
      router.push({ name: 'Operadores de la Farmacia' })
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    swalToast.showError('Ocurrió un error al intentar guardar el operador.')
  }
}
</script>

<template>
  <div class="d-flex flex-column h-100 gap-4">
    <div class="card border border-light shadow-sm rounded-4 p-4 flex-grow-1 overflow-auto">
      <form id="operatorForm" @submit.prevent="saveOperator" class="d-flex flex-column gap-4">
        <OperatorForm :form="form" :roleOptions="roleOptions" />
      </form>
    </div>
    <!-- BOTONES DE ACCIÓN -->
    <div :class="['d-flex justify-content-end gap-2 mt-4', { 'sticky-bottom': isMobile }]">
      <button type="submit" :class="BUTTONS.save.class" :disabled="loading">
        <LoadingSpinner v-if="loading" />
        <i v-else :class="BUTTONS.save.icon"></i>
        {{ BUTTONS.save.title }}
      </button>
    </div>
  </div>
</template>
