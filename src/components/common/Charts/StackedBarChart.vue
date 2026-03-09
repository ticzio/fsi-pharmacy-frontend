<template>
  <div class="chart-responsive-wrapper">
    <apexchart
      type="bar"
      width="100%"
      height="100%"
      :series="props.series"
      :options="mergedOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const apexchart = VueApexCharts

const props = defineProps<{
  series: any[]
  options?: ApexOptions
}>()

const mergedOptions = computed<ApexOptions>(() => {
  return {
    ...props.options,
    chart: {
      ...props.options?.chart,
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    colors: props.options?.colors || ['#1e3888', '#00d500'],
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    // Asegurarse de que no haya configuraciones de "line" conflictivas
    fill: {
      opacity: 1,
    },
  }
})
</script>

<style scoped>
.chart-responsive-wrapper {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
