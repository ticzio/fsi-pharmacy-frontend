import { reactive } from 'vue'
import type { ApexOptions } from 'apexcharts'

export function useDashboardCharts() {
  const chart1Series = reactive([
    {
      name: 'Descuentos',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Beneficios',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ])

  const chart1Options = reactive<ApexOptions>({
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
    },
    colors: ['#1e3888', '#00d500'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    },
    tooltip: {
      x: { format: 'dd/MM/yy HH:mm' },
    },
  })

  const chart2Series = reactive([
    {
      name: 'Clientes registrados',
      data: [300, 400, 350, 500, 490, 600, 700],
    },
  ])

  const chart2Options = reactive<ApexOptions>({
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
    },
    colors: ['#4a148c'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    },
  })

  return {
    chart1Series,
    chart1Options,
    chart2Series,
    chart2Options,
  }
}
