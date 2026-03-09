<template>
  <div class="h-100 d-flex flex-column">
    <h5 class="fw-bold mb-4">Estado de Cupones Canjeados</h5>
    <div class="flex-grow-1 row align-items-center overflow-hidden">
      <div class="col-md-6 h-100 min-h-0">
        <DoughnutChart :series="series" :labels="labels" :options="chartOptions" />
      </div>
      <div class="col-md-6 overflow-y-auto custom-scrollbar h-100">
        <div class="pe-3">
          <div
            v-for="(label, index) in labels"
            :key="label"
            class="d-flex align-items-center justify-content-between mb-3 p-3 rounded-4 bg-light"
          >
            <div class="d-flex align-items-center gap-3">
              <div
                class="rounded-circle"
                :style="{
                  width: '12px',
                  height: '12px',
                  backgroundColor: colors[index],
                }"
              ></div>
              <span class="fw-bold text-secondary">{{ label }}</span>
            </div>
            <span class="h6 mb-0 fw-bold">{{ series[index] }}%</span>
          </div>
          <div class="alert alert-primary border-0 rounded-4 p-3 mt-4">
            <div class="d-flex gap-3">
              <i class="bi bi-info-circle-fill fs-4"></i>
              <div>
                <p class="mb-0 small fw-bold">Dato destacado</p>
                <p class="mb-0 extra-small">
                  El cupón de <strong>Bienestar</strong> es el más canjeado esta semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import DoughnutChart from '@/components/common/Charts/DoughnutChart.vue'

interface Props {
  series: number[]
  labels: string[]
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#0d6efd', '#6610f2', '#ffc107', '#adb5bd'],
})

const chartOptions = computed<ApexOptions>(() => ({
  colors: props.colors,
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => '100%',
          },
        },
      },
    },
  },
}))
</script>

<style scoped>
.extra-small {
  font-size: 0.75rem;
}

.min-h-0 {
  min-height: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
