<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps<{
  initialData?: any
}>()

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  description: '',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.value.title = newVal.title || ''
      form.value.description = newVal.description || ''
    } else {
      form.value.title = ''
      form.value.description = ''
    }
  },
  { immediate: true },
)

const isFormValid = ref(true)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (
    !form.value.title.trim() ||
    !form.value.description.trim() ||
    form.value.description === '<p><br></p>'
  ) {
    isFormValid.value = false
    return
  }

  isFormValid.value = true
  isSubmitting.value = true

  // Simulate API call for good UX (spinner)
  setTimeout(() => {
    isSubmitting.value = false
    emit('submit', form.value)
  }, 800)
}

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="template-form px-1 pb-2">
    <!-- Alerta de validación -->
    <div
      v-if="!isFormValid"
      class="alert alert-danger py-2 px-3 mb-4 rounded-3 d-flex align-items-center"
      style="font-size: 0.9rem"
    >
      <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
      Por favor, completa los campos requeridos (Título y Mensaje descriptivo).
    </div>

    <div class="row g-3">
      <div class="col-12">
        <BaseInput
          id="template-title"
          label="Título de la Plantilla *"
          v-model="form.title"
          placeholder="Ej: Mensaje de bienvenida"
          :rules="[(v) => !!v || 'El título es un campo obligatorio']"
        />
      </div>

      <div class="col-12 mt-1 flex-grow-1 d-flex flex-column">
        <label class="form-label fw-bold mb-2">Mensaje descriptivo *</label>
        <div
          class="quill-wrapper bg-white rounded-3 shadow-sm border transition-all flex-grow-1 d-flex flex-column"
          :class="{
            'border-danger':
              !isFormValid && (!form.description.trim() || form.description === '<p><br></p>'),
          }"
        >
          <QuillEditor
            :key="props.initialData?.id || 'create-mode'"
            v-model:content="form.description"
            contentType="html"
            theme="snow"
            toolbar="full"
            placeholder="Escribe aquí el contenido de la plantilla..."
            class="flex-grow-1"
          />
        </div>
        <div
          v-if="!isFormValid && (!form.description.trim() || form.description === '<p><br></p>')"
          class="text-danger small mt-1"
        >
          La descripción es un campo obligatorio
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
      <button
        type="submit"
        class="btn btn-primary px-4 py-2 fw-medium rounded-pill shadow-sm submit-btn w-100 w-sm-auto d-flex align-items-center"
        :disabled="isSubmitting"
      >
        <span
          v-if="isSubmitting"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        <i v-else class="bi bi-save-fill me-2"></i>
        {{ isSubmitting ? 'Guardando...' : 'Guardar plantilla' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.template-form {
  color: #111827;
  font-family: inherit;
}

.cancel-btn {
  background-color: #f3f4f6;
  border-color: #f3f4f6;
  color: #4b5563;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.submit-btn {
  background-color: #2563eb;
  border-color: #2563eb;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(37, 99, 235, 0.2),
    0 2px 4px -1px rgba(37, 99, 235, 0.06) !important;
}

.submit-btn:active {
  transform: translateY(0);
}

/* Quill estilizaciones */
.quill-wrapper {
  transition: border-color 0.2s;
  min-height: 250px;
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
  min-height: 150px;
  padding: 1rem;
}
:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
  left: 1rem;
  right: 1rem;
}
.transition-all {
  transition: all 0.2s ease-in-out;
}

@media (min-width: 576px) {
  .w-sm-auto {
    width: auto !important;
  }
}
</style>
