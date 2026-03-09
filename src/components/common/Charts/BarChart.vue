<template>
  <div class="chart-responsive-wrapper">
    <apexchart type="bar" width="100%" height="100%" :series="series" :options="mergedOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const props = defineProps<{
  series: any[]
  options?: ApexCharts.ApexOptions
}>()

const mergedOptions = computed<ApexCharts.ApexOptions>(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '55%',
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: {
    borderColor: '#f0f0f0',
    xaxis: { lines: { show: false } },
  },
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#999', fontSize: '10px' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#999', fontSize: '10px' },
    },
  },
  tooltip: { theme: 'light' },
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
