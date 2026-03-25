<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  level?: any
}>()

const emit = defineEmits(['update'])

const minPoints = ref<string | number>('')
const maxPoints = ref<string | number>('')

watch(
  () => props.level,
  (newLevel) => {
    if (newLevel) {
      minPoints.value = newLevel.min_points ?? ''
      maxPoints.value = newLevel.max_points ?? ''
    }
  },
  { immediate: true },
)

const handleUpdate = () => {
  emit('update', {
    min_points: minPoints.value,
    max_points: maxPoints.value,
  })
}
</script>

<template>
  <div class="level-progress-redesign mb-4">
    <h5 class="fw-bold mb-3">Progreso del nivel:</h5>
    <div class="form-container bg-white rounded-5 border border-light-subtle p-4 shadow-sm">
      <div class="d-flex align-items-center gap-3 flex-wrap justify-content-between">
        <div class="d-flex align-items-center gap-3 flex-grow-1">
          <!-- Min Points Input -->
          <div
            class="input-wrapper border rounded-pill px-3 py-2 d-flex align-items-center bg-white shadow-sm"
            style="min-width: 180px"
          >
            <span class="text-muted small me-2">Puntos Mínimos</span>
            <input
              v-model="minPoints"
              type="number"
              class="border-0 bg-transparent w-100 outline-none"
              placeholder="0"
              style="outline: none"
            />
          </div>

          <!-- Max Points Input -->
          <div
            class="input-wrapper border rounded-pill px-3 py-2 d-flex align-items-center bg-white shadow-sm"
            style="min-width: 180px"
          >
            <span class="text-muted small me-2">Puntos Máximos</span>
            <input
              v-model="maxPoints"
              type="number"
              class="border-0 bg-transparent w-100 outline-none"
              placeholder="0"
              style="outline: none"
            />
          </div>
        </div>

        <!-- Update Button -->
        <button
          @click="handleUpdate"
          class="btn btn-success rounded-pill px-5 py-2 fw-bold shadow-sm transition-all"
          style="background-color: #28a745; border: none"
        >
          Actualizar Puntos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  border-color: #f0f0f0 !important;
}

.input-wrapper {
  border-color: #e9ecef !important;
  height: 48px;
}

.input-wrapper:focus-within {
  border-color: #28a745 !important;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.1) !important;
}

.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.btn-success:hover {
  background-color: #218838 !important;
  transform: translateY(-1px);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.outline-none:focus {
  outline: none;
  box-shadow: none;
}
</style>
