<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  description: '',
  type: 'info',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!form.value.title || !form.value.description) {
    return
  }

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
  <form @submit.prevent="handleSubmit" class="notification-form px-1">
    <div class="row g-3">
      <div class="col-12">
        <div class="mb-3 form-group-custom">
          <label class="form-label mb-1 fw-bold">Tipo de Notificación</label>
          <div class="position-relative select-wrapper">
            <select class="form-select custom-select pe-5" v-model="form.type">
              <option value="info">Informativa</option>
              <option value="warning">Alerta / Advertencia</option>
              <option value="success">Éxito / Aprobación</option>
              <option value="danger">Crítica / Error</option>
            </select>
            <i
              class="bi bi-chevron-down position-absolute top-50 translate-middle-y me-3 end-0 text-muted pe-none"
            ></i>
          </div>
        </div>
      </div>

      <div class="col-12">
        <BaseInput
          id="notif-title"
          label="Título de la Notificación *"
          v-model="form.title"
          placeholder="Ej: Mantenimiento programado de plataforma"
          :rules="[(v) => !!v || 'El título es un campo obligatorio']"
        />
      </div>

      <div class="col-12">
        <BaseTextarea
          id="notif-desc"
          label="Mensaje descriptivo *"
          v-model="form.description"
          placeholder="Detalla aquí el contenido del mensaje que recibirán los usuarios..."
          :rows="4"
          :rules="[(v) => !!v || 'La descripción es un campo obligatorio']"
        />
      </div>
    </div>

    <div class="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 border-top">
      <button
        type="submit"
        class="btn btn-primary px-4 py-2 fw-medium rounded-pill shadow-sm submit-btn w-100 w-sm-auto"
        :disabled="isSubmitting"
      >
        <span
          v-if="isSubmitting"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        <i v-else class="bi bi-send-fill me-2"></i>
        {{ isSubmitting ? 'Enviando...' : 'Enviar notificación' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.notification-form {
  color: #111827;
}

.custom-select {
  font-size: 0.95rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #111827;
  box-shadow: none;
  cursor: pointer;
  appearance: none;
}

.custom-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-group-custom label {
  font-size: 0.9rem;
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

@media (min-width: 576px) {
  .w-sm-auto {
    width: auto !important;
  }
}
</style>
