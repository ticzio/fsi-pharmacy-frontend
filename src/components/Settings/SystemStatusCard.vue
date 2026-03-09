<template>
  <div class="settings-card card border border-light shadow-sm rounded-4 p-4">
    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="settings-icon-wrap bg-info-soft">
        <i class="bi bi-activity fs-5 text-info"></i>
      </div>
      <div>
        <h5 class="fw-bold mb-0" style="color: #1a1a2e">Estado del Sistema</h5>
        <small class="text-muted">Salud de servicios activos</small>
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="status-row d-flex justify-content-between align-items-center rounded-3 px-3 py-2">
        <span class="small fw-semibold text-dark">API Backend</span>
        <span class="badge rounded-pill status-badge-success">
          <i class="bi bi-circle-fill me-1" style="font-size: 0.45rem"></i>Activo
        </span>
      </div>
      <div class="status-row d-flex justify-content-between align-items-center rounded-3 px-3 py-2">
        <span class="small fw-semibold text-dark">Conexión a Internet</span>
        <span v-if="isOnline" class="badge rounded-pill status-badge-success">
          <i class="bi bi-circle-fill me-1" style="font-size: 0.45rem"></i>Conectado
        </span>
        <span v-else class="badge rounded-pill status-badge-danger">
          <i class="bi bi-circle-fill me-1" style="font-size: 0.45rem"></i>Desconectado
        </span>
      </div>

      <div class="status-row d-flex justify-content-between align-items-center rounded-3 px-3 py-2">
        <span class="small fw-semibold text-dark">Chat (API Externa)</span>
        <span class="badge rounded-pill status-badge-success">
          <i class="bi bi-circle-fill me-1" style="font-size: 0.45rem"></i>Activo
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.settings-card {
  transition: box-shadow 0.25s ease;
}
.settings-card:hover {
  box-shadow: 0 8px 30px rgba(18, 62, 147, 0.1) !important;
}

.settings-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-info-soft {
  background: rgba(6, 182, 212, 0.1);
}

.status-row {
  background: #f8fafc;
  transition: background 0.2s;
}
.status-row:hover {
  background: #f1f5f9;
}

.status-badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  font-weight: 600;
  font-size: 0.72rem;
}

.status-badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  font-weight: 600;
  font-size: 0.72rem;
}

.border-light {
  border-color: #eee !important;
}
</style>
