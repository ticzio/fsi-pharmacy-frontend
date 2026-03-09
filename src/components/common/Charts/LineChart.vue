<template>
  <div class="chart-responsive-wrapper">
    <apexchart :type="type" width="100%" height="100%" :series="series" :options="mergedOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const apexchart = VueApexCharts

type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'boxPlot'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | 'rangeArea'
  | 'treemap'

const props = defineProps<{
  type?: ChartType
  series: any[]
  options?: ApexOptions
}>()

const mergedOptions = computed<ApexOptions>(() => ({
  chart: {
    type: props.type ?? 'line',
    toolbar: { show: false },
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
