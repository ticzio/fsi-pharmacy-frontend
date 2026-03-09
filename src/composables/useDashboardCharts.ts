import { ref } from 'vue'

export function useDashboardCharts() {
  // ─── Chart 1: Cupones canjeados (multi-line, 6 meses) ─────────────────────
  const chart1Series = ref([
    {
      name: 'Descuentos',
      data: [90, 25, 120, 50, 115, 50],
    },
    {
      name: 'Beneficios',
      data: [45, 75, 30, 110, 20, 105],
    },
  ])

  const chart1Options = ref<ApexCharts.ApexOptions>({
    chart: {
      type: 'line',
      toolbar: { show: false },
      sparkline: { enabled: false },
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#1e3888', '#00d500'],
    markers: { size: 0 },
    legend: { show: false },
    grid: {
      borderColor: '#f0f0f0',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ['FEB', 'MAR', 'ABRIL', 'MAY', 'JUN', 'JUL'],
      labels: {
        style: { colors: '#999', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 10,
      max: 130,
      tickAmount: 3,
      labels: {
        style: { colors: '#999', fontSize: '10px' },
      },
    },
    tooltip: { theme: 'light' },
  })

  // ─── Chart 2: Usuarios registrados (area, 12 meses) ───────────────────────
  const chart2Series = ref([
    {
      name: 'Usuarios registrados',
      data: [200, 250, 300, 400, 500, 643, 600, 750, 800, 850, 1000, 1200],
    },
  ])

  const chart2Options = ref<ApexCharts.ApexOptions>({
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#1e3888'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.15,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: [0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0],
      colors: ['#1e3888'],
      strokeWidth: 0,
    },
    legend: { show: false },
    grid: {
      show: false,
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    xaxis: {
      categories: [
        'Feb',
        'Mar',
        'Abril',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
        'Ene',
      ],
      labels: {
        style: { colors: '#999', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: { theme: 'light' },
  })

  return {
    chart1Series,
    chart1Options,
    chart2Series,
    chart2Options,
  }
}
