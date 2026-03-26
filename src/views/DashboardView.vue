<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import StatisticCards from '@/components/Home/StatisticCards.vue'
import LineChart from '@/components/common/Charts/LineChart.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { useDashboardCharts } from '@/composables/useDashboardCharts'
import type { StatisticItem } from '@/components/Home/StatisticCards.vue'

const statisticItems = ref<StatisticItem[]>([
  { value: 40, label: 'Cupones activos', to: 'Canjes' },
  { value: 54, label: 'Cupones canjeados', to: 'Canjes' },
  { value: 47, label: 'Clientes atendidos', to: 'Clientes' }
])

const { chartSeries, chartOptions } = useDashboardCharts()

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
      class="dashboard-wrapper bg-white shadow-sm p-3 p-md-4 m-0 d-flex flex-column gap-3 gap-md-4 position-relative"
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
      <div class="row flex-grow-1 mt-md-2">
        <div class="col-12">
          <div class="row g-4 align-items-center h-100">
            <!-- Illustration (Left) -->
            <div class="col-12 col-lg-5 d-flex justify-content-center align-items-center">
              <!-- FIXME: Replace placeholder URL with actual 3D image import e.g. src="@/assets/images/dashboard-illustration.png" -->
              <img src="https://placehold.co/400x300/f8f9fa/a0aab4.png?text=Illustration+Placeholder" alt="" class="img-fluid" style="max-height: 280px; object-fit: contain;" />
            </div>
            
            <!-- Chart (Right) -->
            <div class="col-12 col-lg-7 d-flex flex-column justify-content-center h-100">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 ps-lg-4 z-1 position-relative" style="margin-bottom: -15px;">
                <div>
                  <h3 class="fw-bold mb-0 italic-numbers" style="color: #4a148c; font-size: 1.5rem">
                    4760
                  </h3>
                  <p class="text-dark fw-bold mb-0" style="font-size: 0.8rem">Cupones canjeados</p>
                </div>
                <div class="d-flex flex-wrap gap-3 align-items-center pe-md-4">
                  <div class="d-flex align-items-center gap-2">
                    <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #1e3888"></span>
                    <span class="text-muted small" style="font-size: 0.75rem;">Nivel 1</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #00d500"></span>
                    <span class="text-muted small" style="font-size: 0.75rem;">nivel 2</span>
                  </div>
                </div>
              </div>
              <!-- Chart Container -->
              <div class="w-100 position-relative" style="min-height: 280px">
                 <LineChart :series="chartSeries" :options="chartOptions" />
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
