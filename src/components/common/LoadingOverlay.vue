<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div
    class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
    style="z-index: 1050; min-height: 500px"
  >
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <strong class="text-primary me-2">{{ message || 'Cargando...' }}</strong>
        <div class="spinner-grow spinner-grow-sm text-primary" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>
    </div>
  </div>
</template>
