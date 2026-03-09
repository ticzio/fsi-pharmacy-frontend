<template>
  <div class="chart-responsive-wrapper">
    <apexchart
      type="radialBar"
      width="100%"
      height="100%"
      :series="radialSeries"
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

// Convertimos las series de un LineChart (objetos) a un arreglo de porcentajes (números)
const radialSeries = computed(() => {
  if (!props.series || !props.series.length) return []

  return props.series.map((s) => {
    if (s.data && s.data.length > 0) {
      // Calculamos el total de los valores para esta serie
      const total = s.data.reduce((sum: number, val: number) => sum + val, 0)
      // Usamos un target base para calcular el porcentaje, asumiendo 500 como tope ficticio ideal
      const maxTarget = 500
      return Math.min(Math.round((total / maxTarget) * 100), 100)
    }
    return typeof s === 'number' ? s : 0
  })
})

const mergedOptions = computed<ApexOptions>(() => {
  // Extraemos los nombres de las series para las etiquetas
  const labels = props.series?.map((s) => s.name || '') || []

  return {
    ...props.options,
    chart: {
      ...props.options?.chart,
      type: 'radialBar',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    labels,
    colors: props.options?.colors || ['#1e3888', '#00d500'],
    plotOptions: {
      radialBar: {
        startAngle: -100,
        endAngle: 100,
        offsetY: -30,
        hollow: {
          margin: 10,
          size: '55%',
        },
        track: {
          background: '#f0f0f0',
        },
        dataLabels: {
          name: {
            fontSize: '13px',
            color: '#666',
            offsetY: 20,
          },
          value: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            offsetY: -5,
            formatter: function (val) {
              return val + '%'
            },
          },
          total: {
            show: true,
            label: 'Total',
            color: '#1e3888',
            fontSize: '14px',
            fontWeight: 'bold',
            formatter: function () {
              // Devolvemos el total del dashboard
              return '4760'
            },
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    legend: { show: false },
    grid: { show: false, padding: { top: -20, bottom: -20, left: 0, right: 0 } },
    // Ocultamos elementos propios del line chart que puedan causar conflicto
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true },
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
