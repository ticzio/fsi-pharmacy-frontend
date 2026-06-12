<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import StatisticCards from '@/components/Home/StatisticCards.vue'
import LineChart from '@/components/common/Charts/LineChart.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useDashboardCharts } from '@/composables/useDashboardCharts'
import { usePharmacyAnalytics } from '@/composables/Models/usePharmacyAnalytics'
import type { StatisticItem } from '@/components/Home/StatisticCards.vue'

const statisticItems = ref<StatisticItem[]>([
  { value: 0, label: 'Cupones activos', to: 'coupons-list' },
  { value: 0, label: 'Cupones canjeados', to: 'historical-list' },
  { value: 0, label: 'Chats atendidos', to: 'Chats' },
])

const { chartSeries, chartOptions } = useDashboardCharts()
const { fetchAnalytics, fetchChatsAnalytics, analyticsData, chatsMonth, isLoading } =
  usePharmacyAnalytics()

onMounted(async () => {
  await Promise.all([fetchAnalytics(), fetchChatsAnalytics()])

  if (analyticsData.value) {
    statisticItems.value[0].value = analyticsData.value.active_coupons || 0
    statisticItems.value[1].value = analyticsData.value.coupons_exchanged || 0

    if (analyticsData.value.exchanges_by_level) {
      chartSeries.splice(
        0,
        chartSeries.length,
        ...analyticsData.value.exchanges_by_level.map((item) => ({
          name: item.label,
          data: [item.value],
        })),
      )

      chartOptions.xaxis = {
        ...chartOptions.xaxis,
        categories: ['Actual'],
      }
    }
  }

  // Actualizar Clientes Atendidos desde API externa
  statisticItems.value[2].value = chatsMonth.value || 0
})

const store = useStore()
const router = useRouter()
const isRedirecting = ref(false)

const pharmacyName = computed(() => store.getters.currentUser?.type_pharmacy?.name || '')

const handleCardClick = async (item: StatisticItem) => {
  if (item.to) {
    isRedirecting.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push({ name: item.to })
  }
}
</script>

<template>
  <DashboardLayout>
    <div
      class="dashboard-wrapper bg-white shadow-sm p-3 p-md-4 m-0 d-flex flex-column gap-3 gap-md-4 position-relative h-100"
      style="border-radius: 20px"
    >
      <!-- REDIRECT OVERLAY -->
      <LoadingOverlay v-if="isRedirecting" message="Redireccionando..." />

      <!-- HEADER -->
      <TitleSection
        title="Bienvenido"
        :description="`Panel de farmacia ${pharmacyName}`"
        :show-logo="true"
      />

      <!-- CARDS -->
      <StatisticCards :items="statisticItems" @click-card="handleCardClick" />

      <!-- MAIN CONTENT -->
      <div class="row flex-grow-1 mt-md-2 h-100">
        <div class="col-12 d-flex flex-column h-100">
          <div class="row g-4 align-items-stretch h-100">
            <!-- Illustration (Left) -->
            <div class="col-12 col-lg-5 d-flex justify-content-center align-items-center">
              <img
                src="@/assets/images/dashboardLayout/Home_image.png"
                alt=""
                class="img-fluid"
                style="max-height: 450px; width: 100%; object-fit: contain"
              />
            </div>

            <!-- Chart (Right) with Bordered Container -->
            <div class="col-12 col-lg-7 d-flex flex-column">
              <div
                class="p-4 d-flex flex-column h-100 shadow-sm"
                style="border: 2px solid #007bff; border-radius: 25px"
              >
                <!-- Header: Stat (Left) and Legend (Right) -->
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="text-start">
                    <h3
                      class="fw-bold mb-0 italic-numbers"
                      style="color: #4a148c; font-size: 2.2rem; transform: skewX(-5deg)"
                    >
                      <span
                        v-if="isLoading"
                        class="spinner-border spinner-border-sm text-primary"
                        role="status"
                      ></span>
                      <span v-else>{{ analyticsData?.total_exchanges || 0 }}</span>
                    </h3>
                    <p class="text-dark fw-bold mb-0" style="font-size: 1rem">Cupones canjeados</p>
                  </div>

                  <!-- Legend -->
                  <div class="d-flex flex-wrap gap-4 align-items-center pe-lg-2 mt-2">
                    <div
                      v-for="(level, index) in analyticsData?.exchanges_by_level || []"
                      :key="level.label"
                      class="d-flex align-items-center gap-2"
                    >
                      <span
                        class="rounded-circle"
                        :style="`width: 10px; height: 10px; background-color: ${chartOptions.colors?.[index % (chartOptions.colors?.length || 1)] || '#1e3888'}`"
                      ></span>
                      <span class="text-muted small" style="font-size: 0.85rem">{{
                        level.label
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Chart Container -->
                <div class="w-100 position-relative flex-grow-1" style="min-height: 280px">
                  <LineChart :series="chartSeries" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
</style>
