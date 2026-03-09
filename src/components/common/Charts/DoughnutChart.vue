<template>
  <div class="chart-responsive-wrapper">
    <apexchart type="donut" width="100%" height="100%" :series="series" :options="mergedOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const props = defineProps<{
  series: number[]
  labels?: string[]
  options?: ApexCharts.ApexOptions
}>()

const mergedOptions = computed<ApexCharts.ApexOptions>(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
  },
  labels: props.labels ?? [],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      },
    },
  },
  ...props.options,
}))
</script>

<style scoped>
.chart-responsive-wrapper {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
}
</style>
