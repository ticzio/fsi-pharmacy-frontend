<script setup lang="ts">
import defaultProfileImage from '@/assets/images/default-profile.png'

defineProps<{
  users: Array<{ id: number; name: string; email: string }>
}>()

defineEmits<{
  (e: 'click-user', user: { id: number; name: string; email: string }): void
  (e: 'click-view-all'): void
}>()
</script>

<template>
  <div class="col-12 col-lg-4">
    <div class="card border border-light shadow-sm rounded-4 p-3 p-md-4 h-100">
      <div class="d-flex flex-row justify-content-between align-items-start mb-4 gap-2">
        <div>
          <h6 class="fw-bold text-dark mb-0 pe-2">Ultimos usuarios</h6>
          <p class="text-muted small mb-0 lh-sm" style="font-size: 0.75rem">
            registrados en la aplicación
          </p>
        </div>
        <a
          href="#"
          @click.prevent="$emit('click-view-all')"
          class="text-dark text-decoration-none fw-bold"
          style="font-size: 0.75rem; white-space: nowrap"
        >
          Ver todos <i class="bi bi-chevron-right ms-1"></i>
        </a>
      </div>

      <div
        class="d-flex flex-column gap-3 overflow-auto custom-scrollbar pe-2 flex-grow-1"
        style="max-height: 520px"
      >
        <div v-for="user in users" :key="user.id" class="d-flex align-items-center gap-3 user-card" @click="$emit('click-user', user)">
          <img
            :src="defaultProfileImage"
            :alt="user.name"
            class="rounded-circle shadow-sm user-avatar"
            style="width: 44px; height: 44px; object-fit: cover"
          />
          <div class="lh-sm overflow-hidden flex-grow-1">
            <p class="mb-0 text-dark fw-bold text-truncate user-name" style="font-size: 0.85rem">
              {{ user.name }}
            </p>
            <p
              class="mb-0 text-muted fw-medium text-truncate user-email"
              style="font-size: 0.75rem"
            >
              {{ user.email }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-light {
  border-color: #eee !important;
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dcdcdc;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c8c8c8;
}

/* User Card Hover Animation */
.user-card {
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  margin: -8px; /* Offset padding to keep alignment */
}

.user-card:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-avatar {
  transition: transform 0.3s ease;
}

.user-card:hover .user-avatar {
  transform: scale(1.05);
}

.user-name,
.user-email {
  transition: color 0.3s ease;
}

.user-card:hover .user-name {
  color: #1e3888 !important; /* Theme primary color */
}
</style>
