<script setup lang="ts">
defineProps<{
  createdAt?: string | null
  updatedAt?: string | null
}>()
</script>

<template>
  <div class="d-flex flex-column flex-lg-row gap-3">
    <div
      class="d-flex align-items-center gap-2 bg-light border-radius-left border-radius-right px-3 py-2"
    >
      <i class="bi bi-calendar-plus text-success"></i>
      <span class="text-muted small">Creado:</span>
      <span class="fw-semibold text-dark small" v-format-date-time="createdAt"></span>
    </div>
    <div
      class="d-flex align-items-center gap-2 bg-light border-radius-right border-radius-left px-3 py-2"
    >
      <i class="bi bi-calendar-check text-primary"></i>
      <span class="text-muted small">Actualizado:</span>
      <span class="fw-semibold text-dark small" v-format-date-time="updatedAt"></span>
    </div>
  </div>
</template>
