<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    progress: number
    label?: string
    text?: string
    height?: string
    showPercentage?: boolean
  }>(),
  {
    height: '14px',
    showPercentage: true,
  },
)

const clampedProgress = computed(() => {
  return Math.min(Math.max(props.progress, 0), 100)
})
</script>

<template>
  <div class="w-100">
    <div
      v-if="label || text || showPercentage"
      class="d-flex justify-content-between align-items-center mb-2"
    >
      <div>
        <span v-if="label" class="fw-medium text-secondary me-2" style="font-size: 0.9rem">{{
          label
        }}</span>
        <span v-if="text" class="fw-bold text-success" style="font-size: 1rem">{{ text }}</span>
      </div>
      <span v-if="showPercentage" class="fw-bold text-success" style="font-size: 0.9rem"
        >{{ clampedProgress }}%</span
      >
    </div>
    <div class="progress rounded-pill shadow-sm" :style="{ height }">
      <div
        class="progress-bar bg-success rounded-pill"
        role="progressbar"
        :style="{ width: `${clampedProgress}%` }"
        :aria-valuenow="clampedProgress"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  background-color: #f3f4f6;
  overflow: visible;
}

.progress-bar {
  transition: width 0.4s ease-in-out;
}
</style>
