<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'

interface StateData {
  id?: number | string
  name: string
  url_image: any
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

const formData = ref<StateData>({
  name: '',
  url_image: null,
  active: true,
})

const initialImageUrl = ref<string | null>(null)

const initForm = () => {
  if (props.initialData) {
    formData.value = {
      id: props.initialData.id,
      name: props.initialData.name || '',
      url_image: null,
      active: props.initialData.active !== undefined ? props.initialData.active : true,
    }
    initialImageUrl.value = props.initialData.url_image || null
  } else {
    formData.value = {
      name: '',
      url_image: null,
      active: true,
    }
    initialImageUrl.value = null
  }
}

onMounted(() => {
  initForm()
})

watch(
  () => props.initialData,
  () => {
    initForm()
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
  <div class="state-form-container pb-2">
    <div class="row g-3">
      <div class="col-12 col-lg-4 text-center">
        <h6 class="fw-bold text-primary mb-3 text-uppercase small-title">Imagen del Estado</h6>
        <ImageUploader
          v-model="formData.url_image"
          :round="false"
          :initial-image-url="initialImageUrl"
          :input-disabled="readOnly"
          placeholder="Subir imagen del estado"
        />
      </div>

      <div class="col-12 col-lg-8">
        <h6 class="fw-bold text-primary mb-3 text-uppercase small-title">Detalles del Estado</h6>

        <div class="mb-3">
          <BaseInput
            id="stateName"
            v-model="formData.name"
            label="Nombre del Estado"
            placeholder="Ej: Miranda"
            :disabled="readOnly"
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
.form-check-input {
  width: 3em;
  height: 1.5em;
  cursor: pointer;
}
</style>
