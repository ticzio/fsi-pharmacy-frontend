import { reactive } from 'vue'
import type { ApexOptions } from 'apexcharts'

export function useDashboardCharts() {
  const chartSeries = reactive([
    {
      name: 'Nivel 1',
      data: [90, 20, 70, 28, 51, 20, 60],
    },
    {
      name: 'nivel 2',
      data: [45, 12, 110, 80, 40, 105, 80],
    },
  ])

  const chartOptions = reactive<ApexOptions>({
    chart: {
      type: 'line',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#1e3888', '#00d500'],
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'],
      labels: {
        style: {
          colors: '#888',
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#888',
          fontSize: '11px',
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      x: { show: false },
    },
  })

  return {
    chartSeries,
    chartOptions
  }
}
