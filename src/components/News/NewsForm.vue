<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface NewsData {
  id?: number | string
  title: string
  url_image?: string
  content: string
  active: boolean
}

const props = defineProps({
  initialData: {
    type: Object as () => Record<string, any> | null,
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref<NewsData>({
  title: '',
  content: '',
  active: true,
  url_image: '',
})

const imageFile = ref<File | null>(null)

// Preview URL for the selected image
const previewImageUrl = ref<string>('')

watch(imageFile, (newFile) => {
  if (newFile) {
    previewImageUrl.value = URL.createObjectURL(newFile)
  } else {
    previewImageUrl.value = formData.value.url_image || ''
  }
})

// Validación simple del formulario
const isFormValid = ref(true)

const initForm = () => {
  if (props.initialData && props.isEditing) {
    formData.value = {
      id: props.initialData.id,
      title: props.initialData.title || '',
      content: props.initialData.body_only_text || props.initialData.content || '',
      active: props.initialData.active !== undefined ? props.initialData.active : true,
      url_image: props.initialData.url_image || '',
    }
    previewImageUrl.value = formData.value.url_image || ''
  } else {
    // Reset form for "Create" mode
    formData.value = {
      title: '',
      content: '',
      active: true,
      url_image: '',
    }
    imageFile.value = null
    previewImageUrl.value = ''
    isFormValid.value = true
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

watch(
  () => props.isEditing,
  () => {
    initForm()
  },
)

const handleSubmit = () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    isFormValid.value = false
    return
  }
  isFormValid.value = true
  emit('submit', {
    ...formData.value,
    imageFile: imageFile.value,
  })
}

// Compute dynamic placeholder elements for the preview
const displayTitle = computed(() => formData.value.title.trim() || 'Título de la Noticia')
const displayContent = computed(() => {
  if (!formData.value.content.trim() || formData.value.content === '<p><br></p>') {
    return '<p class="text-muted">El contenido de la noticia aparecerá aquí...</p>'
  }
  return formData.value.content
})

defineExpose({
  handleSubmit,
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="news-form pb-2">
    <!-- Alerta de validación -->
    <div
      v-if="!isFormValid"
      class="alert alert-danger py-2 px-3 mb-4 rounded-3 d-flex align-items-center"
      style="font-size: 0.9rem"
    >
      <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
      Por favor, completa los campos requeridos (Título y Contenido).
    </div>

    <div class="row g-4 h-100">
      <!-- Columna Izquierda: Formulario (7 columnas u 6 dependiendo de preferencia) -->
      <div class="col-12 col-lg-6 d-flex flex-column pe-lg-4 form-section">
        <h6
          class="fw-bold text-primary mb-3 text-uppercase"
          style="font-size: 0.85rem; letter-spacing: 0.5px"
        >
          Configuración de la Noticia
        </h6>

        <div class="mb-4 d-flex flex-column">
          <label class="form-label fw-bold mb-2">Imagen de Portada</label>
          <ImageUploader
            v-model="imageFile"
            :round="false"
            :initialImageUrl="formData.url_image"
            class="w-100"
            placeholder="Buscar o arrastrar imagen"
          />
        </div>

        <div class="row g-3 mb-1">
          <div class="col-12 col-md-8">
            <BaseInput
              id="title"
              v-model="formData.title"
              label="Título de la Noticia"
              placeholder="Ej: Nueva Actualización del Sistema"
              :rules="[(v) => !!v || 'El título es requerido']"
            />
          </div>
          <div
            v-if="isEditing"
            class="col-12 col-md-4 d-flex align-items-center pt-md-3 mb-3 mb-md-0"
            style="transform: translateY(-4px)"
          >
            <div class="form-check form-switch d-flex align-items-center ps-0 mb-0">
              <input
                class="form-check-input ms-0 me-2 shadow-none mt-0"
                type="checkbox"
                id="activeStatus"
                v-model="formData.active"
                style="cursor: pointer"
              />
              <label class="form-check-label mb-0" for="activeStatus" style="cursor: pointer">
                <span :class="formData.active ? 'text-success fw-bold' : 'text-secondary fw-bold'">
                  {{ formData.active ? 'Publicada' : 'Oculta' }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="mt-1 flex-grow-1 d-flex flex-column">
          <label class="form-label fw-bold mb-2">Contenido de la Noticia</label>
          <div
            class="quill-wrapper bg-white rounded-3 shadow-sm border transition-all flex-grow-1 d-flex flex-column"
            :class="{ 'border-danger': !isFormValid && !formData.content.trim() }"
          >
            <QuillEditor
              v-model:content="formData.content"
              contentType="html"
              theme="snow"
              toolbar="full"
              placeholder="Escribe el contenido detallado de la noticia aquí..."
              class="flex-grow-1"
            />
          </div>
          <div v-if="!isFormValid && !formData.content.trim()" class="text-danger small mt-1">
            El contenido es requerido
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Vista Previa (Simulación de Mobile/Tarjeta) -->
      <div class="col-12 col-lg-6 border-start ps-lg-4 preview-section d-none d-lg-block">
        <h6
          class="fw-bold text-secondary mb-3 text-uppercase d-flex align-items-center justify-content-between"
          style="font-size: 0.85rem; letter-spacing: 0.5px"
        >
          <span>Vista Previa en Tiempo Real</span>
          <span
            v-if="isEditing"
            class="badge"
            :class="formData.active ? 'bg-success' : 'bg-secondary'"
            >{{ formData.active ? 'Visible' : 'Oculta' }}</span
          >
        </h6>

        <div
          class="preview-container bg-light rounded-4 border p-4 h-100 overflow-auto position-relative custom-scrollbar"
        >
          <!-- Mockup Tarjeta Noticia -->
          <div
            class="bg-white rounded-4 shadow-sm overflow-hidden news-card-preview mx-auto"
            style="max-width: 480px"
          >
            <div class="preview-image-wrapper position-relative bg-light border-bottom">
              <img
                v-if="previewImageUrl"
                :src="previewImageUrl"
                alt="Preview"
                class="w-100 h-100 object-fit-cover"
              />
              <div
                v-else
                class="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted"
                style="min-height: 220px"
              >
                <i class="bi bi-image fs-1 mb-2 opacity-50"></i>
                <span class="small opacity-75">Sin imagen de portada</span>
              </div>
            </div>

            <div class="p-4">
              <div
                class="d-flex align-items-center gap-2 mb-3 text-muted"
                style="font-size: 0.85rem"
              >
                <i class="bi bi-calendar3"></i>
                <span>{{
                  new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }}</span>
              </div>
              <h3 class="fw-bold mb-3" style="font-size: 1.4rem; color: #1a1a1a; line-height: 1.3">
                {{ displayTitle }}
              </h3>

              <hr class="text-black-50 mb-4 opacity-10" />

              <div class="preview-content-html ql-editor px-0 pb-0" v-html="displayContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </form>
</template>

<style scoped>
.news-form {
  font-family: inherit;
  display: flex;
  flex-direction: column;
}

/* Scrollbar personalizada para la vista previa */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

.preview-container {
  max-height: 600px;
}

.preview-image-wrapper {
  height: 240px;
}

/* Quill estilizaciones */
.quill-wrapper {
  transition: border-color 0.2s;
  min-height: 300px;
}
.quill-wrapper:focus-within {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1) !important;
}
:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-family: inherit;
  padding: 10px;
  border-radius: 0.5rem 0.5rem 0 0;
}
:deep(.ql-container.ql-snow) {
  border: none;
  font-size: 0.95rem;
  font-family: inherit;
  border-radius: 0 0 0.5rem 0.5rem;
  flex-grow: 1;
  height: auto;
}
:deep(.ql-editor) {
  min-height: 200px;
  padding: 1rem;
}
:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
  left: 1rem;
  right: 1rem;
}

/* Preview Content Text Styles */
.preview-content-html :deep(p) {
  margin-bottom: 1rem;
}
.preview-content-html :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}
.preview-content-html :deep(h1),
.preview-content-html :deep(h2),
.preview-content-html :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #111827;
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
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
