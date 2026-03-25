<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import MultiselectCustom from '@/components/common/MultiselectCustom.vue'
import { useCities } from '@/composables/Models/useCities'
import { useStates } from '@/composables/Models/useStates'

interface CityData {
  id?: number | string
  name: string
  id_type_state: any
  active: boolean
}

const props = defineProps({
  initialData: {
    type: Object as () => Record<string, any> | null,
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const { states, loading: loadingStates, getStates } = useStates()

const formData = ref<CityData>({
  name: '',
  id_type_state: null,
  active: true,
})

const initForm = () => {
  if (props.initialData) {
    // El backend puede enviar state o id_type_state
    const stateObj = props.initialData.state || props.initialData.id_type_state

    // Mapear ID a objeto si es necesario
    const mappedState =
      typeof stateObj === 'object' && stateObj !== null
        ? stateObj
        : states.value.find((opt: any) => opt.id === stateObj) || stateObj

    formData.value = {
      id: props.initialData.id,
      name: props.initialData.name || '',
      id_type_state: mappedState || null,
      active: props.initialData.active !== undefined ? props.initialData.active : true,
    }
  } else {
    formData.value = {
      name: '',
      id_type_state: null,
      active: true,
    }
  }
}

onMounted(async () => {
  await getStates()
  initForm()
})

watch(
  () => props.initialData,
  () => {
    initForm()
  },
)

watch(
  () => states.value,
  (newVal) => {
    if (newVal && newVal.length > 0 && props.initialData) {
      initForm()
    }
  },
)

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div class="city-form-container pb-2">
    <div class="row g-3">
      <div class="col-12">
        <h6 class="fw-bold text-primary mb-3 text-uppercase small-title">Detalles de la Ciudad</h6>

        <div class="mb-3">
          <BaseInput
            id="cityName"
            v-model="formData.name"
            label="Nombre de la Ciudad"
            placeholder="Ej: Caracas"
            :disabled="readOnly"
          />
        </div>

        <div class="mb-3">
          <MultiselectCustom
            v-model="formData.id_type_state"
            :options="states"
            label="Estado / Departamento"
            placeholder="Seleccionar estado"
            :disabled="readOnly"
            label-key="name"
            track-by="id"
            :loading="loadingStates"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.small-title {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
</style>
