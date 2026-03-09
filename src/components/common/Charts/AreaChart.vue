<template>
  <div class="chart-responsive-wrapper">
    <apexchart type="area" width="100%" height="100%" :series="series" :options="mergedOptions" />
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
  // Configuración base de marcadores
  const customMarkers: ApexOptions['markers'] = {
    size: 0,
    colors: ['#ffffff'],
    strokeColors: '#1e3888',
    strokeWidth: 2,
    hover: {
      size: 6,
      sizeOffset: 2,
    },
    discrete: [],
  }

  // Marcadores Inteligentes: encontraremos el valor máximo y lo destacaremos
  if (props.series && props.series.length > 0 && props.series[0].data) {
    const data = props.series[0].data
    let maxVal = -Infinity
    let maxIdx = -1

    data.forEach((val: number, idx: number) => {
      if (val > maxVal) {
        maxVal = val
        maxIdx = idx
      }
    })

    // Si encontramos un máximo, agregamos el marcador inteligente
    if (maxIdx !== -1 && customMarkers.discrete) {
      customMarkers.discrete.push({
        seriesIndex: 0,
        dataPointIndex: maxIdx,
        fillColor: '#1e3888',
        strokeColor: '#ffffff',
        size: 7,
        shape: 'circle',
      })
    }
  }

  return {
    ...props.options,
    chart: {
      ...props.options?.chart,
      type: 'area',
      toolbar: { show: false },
    },
    markers: customMarkers,
    dataLabels: {
      enabled: false,
      ...props.options?.dataLabels,
    },
    tooltip: {
      theme: 'light',
      marker: { show: true },
      x: { show: true },
      ...props.options?.tooltip,
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
}
</style>
