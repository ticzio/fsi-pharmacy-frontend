<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  notification: {
    title: string
    description: string
    type_notification?: string
    type?: string
    active?: boolean
    [key: string]: any
  } | null
}>()

const emit = defineEmits(['close'])

const notificationTypeLabel = computed(() => {
  const type = props.notification?.type || props.notification?.type_notification
  switch (type) {
    case 'info':
      return 'Informativa'
    case 'warning':
      return 'Alerta / Advertencia'
    case 'success':
      return 'Éxito / Aprobación'
    case 'danger':
      return 'Crítica / Error'
    case 'email':
      return 'Email'
    default:
      return type || 'Desconocido'
  }
})

const notificationTypeIcon = computed(() => {
  const type = props.notification?.type || props.notification?.type_notification
  switch (type) {
    case 'info':
      return 'bi-info-circle text-primary'
    case 'warning':
      return 'bi-exclamation-triangle text-warning'
    case 'success':
      return 'bi-check-circle text-success'
    case 'danger':
      return 'bi-x-circle text-danger'
    case 'email':
      return 'bi-envelope text-secondary'
    default:
      return 'bi-bell text-secondary'
  }
})
</script>

<template>
  <div class="notification-details px-2 py-3" v-if="notification">
    <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
      <div
        class="icon-wrapper me-3 d-flex justify-content-center align-items-center rounded-circle bg-light"
        style="width: 48px; height: 48px"
      >
        <i class="bi fs-4" :class="notificationTypeIcon"></i>
      </div>
      <div>
        <h5 class="mb-1 text-dark fw-bold">{{ notification.title }}</h5>
        <span
          >tipo de notificación:<span class="badge bg-light text-dark border ms-2">{{
            notificationTypeLabel
          }}</span></span
        >
      </div>
    </div>

    <div class="mb-4">
      <h6 class="text-muted fw-semibold mb-2 fs-7 text-uppercase tracking-wide">Mensaje</h6>
      <div class="p-3 bg-light rounded-3 text-dark">
        {{ notification.description }}
      </div>
    </div>

    <div class="d-flex justify-content-end mt-4 pt-3 border-top">
      <button
        type="button"
        class="btn btn-outline-secondary px-4 py-2 fw-medium rounded-pill transition-all"
        @click="emit('close')"
      >
        Cerrar
      </button>
    </div>
  </div>
  <div v-else class="text-center py-5 text-muted">
    No se encontró información de la notificación.
  </div>
</template>

<style scoped>
.notification-details {
  color: #111827;
}

.fs-7 {
  font-size: 0.85rem;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.transition-all {
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.icon-wrapper {
  background-color: #f3f4f6 !important;
}
</style>
