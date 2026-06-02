<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import { useRoute } from 'vue-router'
import { useMoment } from '@/composables/useMoment'

interface LevelData {
  id?: number | string
  name?: string
  min_points?: number
  max_points?: number
}

interface CouponData {
  id?: number | string
  code: string
  name: string
  description: string
  id_level: number | string
  url_image?: string
  start_date: string
  finish_date: string
  active: boolean
  id_levels?: LevelData | null
}

const props = defineProps({
  initialData: {
    type: Object as () => Record<string, any> | null,
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const { formatToSQL } = useMoment()

const formData = ref<CouponData>({
  code: '',
  name: '',
  description: '',
  id_level: '',
  start_date: '',
  finish_date: '',
  active: true,
  url_image: '',
  id_levels: null,
})

const imageFile = ref<File | null>(null)
const previewImageUrl = ref<string>('')

watch(imageFile, (newFile) => {
  if (newFile) {
    previewImageUrl.value = URL.createObjectURL(newFile)
  } else {
    previewImageUrl.value = formData.value.url_image || ''
  }
})

const initForm = () => {
  if (props.initialData) {
    formData.value = {
      id: props.initialData.id,
      code: props.initialData.code || '',
      name: props.initialData.name || '',
      description: props.initialData.description || '',
      id_level: props.initialData.id_level || '',
      start_date: formatToSQL(props.initialData.start_date) || '',
      finish_date: formatToSQL(props.initialData.finish_date) || '',
      active: props.initialData.active !== undefined ? !!props.initialData.active : true,
      url_image: props.initialData.url_image || '',
      id_levels: props.initialData.id_levels || null,
    }
    previewImageUrl.value = formData.value.url_image || ''
  } else {
    formData.value = {
      code: '',
      name: '',
      description: '',
      id_level: route.params.id_level?.toString() || '',
      start_date: '',
      finish_date: '',
      active: true,
      url_image: '',
      id_levels: null,
    }
    imageFile.value = null
    previewImageUrl.value = ''
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


// Helper methods validación en caso de ser no readOnly
const emit = defineEmits(['submit'])

const handleSubmit = () => {
  const { id_levels, ...couponPayload } = formData.value
  emit('submit', {
    ...couponPayload,
    imageFile: imageFile.value,
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div class="coupon-form-container pb-2">
    <div class="row g-4 h-100">
      <!-- Columna Izquierda: Imagen / Portada -->
      <div class="col-12 col-md-5 col-lg-4 d-flex flex-column pe-md-3 form-section border-md-end">
        <h6
          class="fw-bold text-primary mb-3 text-uppercase"
          style="font-size: 0.85rem; letter-spacing: 0.5px"
        >
          Visualización
        </h6>


        <div class="mb-4 d-flex flex-column flex-grow-1">
          <label class="form-label fw-bold mb-2">Imagen del Cupón</label>
          <div
            class="image-wrapper bg-light rounded-4 border d-flex align-items-center justify-content-center overflow-hidden w-100 h-100 p-2"
            style="min-height: 250px"
          >
            <ImageUploader
              v-model="imageFile"
              :round="false"
              :initialImageUrl="formData.url_image"
              class="w-100 h-100"
              placeholder="Sin imagen disponible"
              :inputDisabled="true"
            />
          </div>
        </div>

        <div
          class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border"
        >
          <div>
            <span
              class="d-block text-muted"
              style="
                font-size: 0.75rem;
                text-transform: uppercase;
                font-weight: 700;
                letter-spacing: 0.5px;
              "
              >ESTADO</span
            >
            <span :class="formData.active ? 'text-success fw-bold' : 'text-secondary fw-bold'">
              {{ formData.active ? 'Activo / Publicado' : 'Inactivo / Oculto' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Formulario Detalles (Responsive) -->
      <div class="col-12 col-md-7 col-lg-8 d-flex flex-column ps-md-4">
        <h6
          class="fw-bold text-primary mb-3 text-uppercase"
          style="font-size: 0.85rem; letter-spacing: 0.5px"
        >
          Detalles del Cupón
        </h6>

        <div class="row g-3 mb-1">
          <div class="col-12 col-sm-4">
            <BaseInput
              id="couponCode"
              v-model="formData.code"
              label="Código"
              placeholder="Ej: CUP-000"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-sm-8">
            <BaseInput
              id="couponName"
              v-model="formData.name"
              label="Nombre del Cupón"
              placeholder="Nombre descriptivo"
              :disabled="true"
            />
          </div>
        </div>

        <div class="row g-3 mb-1">
          <div class="col-12 col-sm-6">
            <BaseInput
              id="couponStart"
              type="date"
              v-model="formData.start_date"
              label="Fecha de Inicio"
              :disabled="true"
            />
          </div>
          <div class="col-12 col-sm-6">
            <BaseInput
              id="couponFinish"
              type="date"
              v-model="formData.finish_date"
              label="Fecha de Fin"
              :disabled="true"
            />
          </div>
        </div>

        <div class="mt-1 d-flex flex-column">
          <BaseTextarea
            id="couponDesc"
            v-model="formData.description"
            label="Descripción"
            placeholder="Escribe el contenido detallado aquí..."
            :rows="4"
            :disabled="true"
          />
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-form-container {
  font-family: inherit;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .border-md-end {
    border-right: 1px solid #e5e7eb !important;
  }
}

/* Switch Toggle Styling */
.form-switch .form-check-input {
  width: 3em;
  height: 1.5em;
  transition: all 0.2s ease-in-out;
}
.form-switch .form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.image-wrapper {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}
</style>
