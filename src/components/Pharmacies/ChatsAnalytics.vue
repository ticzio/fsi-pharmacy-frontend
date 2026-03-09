<template>
  <div class="h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold mb-0">Rendimiento de Chats Atendidos</h5>
      <select class="form-select form-select-sm w-auto rounded-pill border-0 bg-light">
        <option>Últimos 7 días</option>
        <option>Último mes</option>
      </select>
    </div>
    <div class="flex-grow-1 w-100 min-h-0">
      <LineChart :series="series" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import LineChart from '@/components/common/Charts/LineChart.vue'

interface Props {
  series: any[]
  options: ApexOptions
}

defineProps<Props>()
</script>

<style scoped>
.min-h-0 {
  min-height: 0;
}
</style>
