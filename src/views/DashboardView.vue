<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import StatisticCards from '@/components/Home/StatisticCards.vue'
import LineChart from '@/components/common/Charts/LineChart.vue'
import AreaChart from '@/components/common/Charts/AreaChart.vue'
import StackedBarChart from '@/components/common/Charts/StackedBarChart.vue'
import LatestUsers from '@/components/Home/LatestUsers.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useDashboardCharts } from '@/composables/useDashboardCharts'
import { useClients } from '@/composables/Models/useClients'
import type { StatisticItem } from '@/components/Home/StatisticCards.vue'

const { clients, getDataClients } = useClients()

onMounted(async () => {
  await getDataClients(1)
})

const users = computed(() => {
  return clients.value.map((client) => ({
    id: Number(client.id),
    name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
    email: client.email || '',
  }))
})

const statisticItems = ref([
  { value: 12, label: 'Farmacias activas', to: 'Farmacia' },
  { value: 34, label: 'Operadores activos', to: 'Operadores' },
  { value: 234, label: 'Clientes registrados', highlighted: true, to: 'Clientes' },
  { value: 96, label: 'Cupones canjeados', to: 'Canjes' },
])

const { chart1Series, chart1Options, chart2Series, chart2Options } = useDashboardCharts()

const router = useRouter()
const isRedirecting = ref(false)

const handleCardClick = async (item: StatisticItem) => {
  isRedirecting.value = true
  // Doherty Threshold: Small delay to let the user see the "Redirection" state
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (item.to) {
    router.push({ name: item.to })
  }
}

const handleUserClick = async (user: { id: number }) => {
  isRedirecting.value = true
  // Doherty Threshold: Small delay to let the user see the "Redirection" state
  await new Promise((resolve) => setTimeout(resolve, 500))
  router.push({ name: 'Detalle Cliente', params: { id: user.id } })
}

const handleViewAllUsers = async () => {
  isRedirecting.value = true
  // Doherty Threshold: Small delay to let the user see the "Redirection" state
  await new Promise((resolve) => setTimeout(resolve, 500))
  router.push({ name: 'Clientes' })
}
</script>

<template>
  <DashboardLayout>
    <div
      class="dashboard-wrapper bg-white shadow-sm p-3 p-md-4 m-0 d-flex flex-column gap-3 gap-md-4 position-relative"
      style="border-radius: 20px"
    >
      <!-- REDIRECT OVERLAY -->
      <LoadingOverlay v-if="isRedirecting" message="Redireccionando..." />
      <!-- HEADER -->
      <TitleSection
        title="Bienvenido"
        description="Panel administrativo de farmacias San Ignacio"
        :show-logo="true"
      />

      <!-- CARDS -->
      <StatisticCards :items="statisticItems" @click-card="handleCardClick" />

      <!-- MAIN CONTENT -->
      <div class="row g-4 flex-grow-1">
        <!-- LEFT COLUMN: Charts -->
        <div class="col-12 col-lg-8 d-flex flex-column gap-3 gap-md-4">
          <!-- Top Chart -->
          <div class="card border border-light shadow-sm rounded-4 p-3 p-md-4 flex-grow-1">
            <div
              class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
            >
              <div>
                <h3 class="fw-bold mb-0 italic-numbers" style="color: #4a148c; font-size: 2rem">
                  4760
                </h3>
                <p class="text-dark fw-bold mb-0" style="font-size: 0.9rem">Cupones canjeados</p>
              </div>
              <div class="d-flex flex-wrap gap-3 align-items-center">
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="rounded-circle"
                    style="width: 10px; height: 10px; background-color: #1e3888"
                  ></span>
                  <span class="text-muted small fw-medium">Descuentos</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="rounded-circle"
                    style="width: 10px; height: 10px; background-color: #00d500"
                  ></span>
                  <span class="text-muted small fw-medium">Beneficios</span>
                </div>
                <div
                  class="border rounded px-3 py-1 text-muted small d-flex align-items-center gap-2 ms-2 user-select-none border-light"
                >
                  6 meses <i class="bi bi-caret-down-fill text-muted" style="margin-top: 1px"></i>
                </div>
              </div>
            </div>
            <div class="flex-grow-1 position-relative" style="min-height: 250px">
              <!-- Desktop Chart -->
              <div class="d-none d-md-block position-absolute w-100 h-100 top-0 start-0">
                <LineChart :series="chart1Series" :options="chart1Options" />
              </div>
              <!-- Mobile Chart (Stacked Bar) -->
              <div class="d-block d-md-none position-absolute w-100 h-100 top-0 start-0">
                <StackedBarChart :series="chart1Series" :options="chart1Options" />
              </div>
            </div>
          </div>

          <!-- Bottom Chart -->
          <div
            class="card border border-light shadow-sm rounded-4 p-3 p-md-4 pb-5 pb-md-5 h-100 min-h-200"
          >
            <h6 class="fw-bold text-dark mb-4 text-center text-md-start" style="font-size: 1rem">
              Clientes registrados
            </h6>
            <div class="position-relative flex-grow-1 mt-2" style="min-height: 250px">
              <!-- Tooltip Mockup (Desktop only) -->
              <div
                class="position-absolute translate-middle-x bg-white border border-light shadow-sm rounded-2 d-none d-md-flex flex-column align-items-center justify-content-center p-2 z-2"
                style="left: 45.4%; top: 5%; width: 80px"
              >
                <span class="text-muted" style="font-size: 0.65rem">Junio 2026</span>
                <span class="fw-bold text-dark lh-1 mt-1" style="font-size: 0.9rem">643</span>
              </div>

              <!-- Desktop Chart -->
              <div class="d-none d-md-block position-absolute w-100 h-100 top-0 start-0 z-1">
                <LineChart type="area" :series="chart2Series" :options="chart2Options" />
              </div>
              <!-- Mobile Chart (Intelligent Markers) -->
              <div class="d-block d-md-none position-absolute w-100 h-100 top-0 start-0 z-1">
                <AreaChart :series="chart2Series" :options="chart2Options" />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Users List -->
        <LatestUsers
          :users="users"
          @click-user="handleUserClick"
          @click-view-all="handleViewAllUsers"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.italic-numbers {
  font-style: italic;
  font-family: 'Arial', sans-serif;
  letter-spacing: -0.5px;
}
.italic-text {
  font-style: italic;
}
.border-light {
  border-color: #eee !important;
}
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dcdcdc;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c8c8c8;
}
</style>
