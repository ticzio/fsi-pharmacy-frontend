<template>
  <div class="h-100 d-flex flex-column overflow-hidden bg-transparent">
    <!-- Main Content Area -->
    <div class="row g-3 flex-grow-1 overflow-hidden pb-3">
      <!-- Columna Izquierda (25%): KPIs Principales (Vertical Pills) -->
      <div class="col-12 col-xl-3 d-flex flex-column gap-3 h-100 overflow-y-auto custom-scrollbar">
        <div
          v-for="kpi in kpis"
          :key="kpi.title"
          class="kpi-pill p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center gap-3"
        >
          <div class="kpi-icon-container" :style="{ backgroundColor: kpi.color + '20' }">
            <i :class="['bi', kpi.icon]" :style="{ color: kpi.color }"></i>
          </div>
          <div>
            <p class="text-muted small mb-0 fw-medium">{{ kpi.title }}</p>
            <h3 class="h4 mb-0 fw-bold" :style="{ color: kpi.color }">{{ kpi.value }}</h3>
          </div>
        </div>
      </div>

      <!-- Columna Derecha (75%): Tabs + Tab Content -->
      <div class="col-12 col-xl-9 d-flex flex-column h-100 overflow-hidden">
        <!-- Tabs Pill -->
        <ScrollableTabs
          :tabs="analyticsTabs"
          :active-tab="activeTabIndex"
          @tab-change="handleTabChange"
        />

        <!-- Tab Content Card -->
        <div
          class="flex-grow-1 bg-white p-4 rounded-4 shadow-sm border overflow-hidden position-relative"
        >
          <transition :name="transitionName" mode="out-in">
            <!-- Content: Chats atendidos -->
            <ChatsAnalytics
              v-if="currentTab === 'chats'"
              key="chats"
              :series="chatsSeries"
              :options="chatsOptions"
            />

            <!-- Content: Top de operadores -->
            <OperatorsAnalytics
              v-else-if="currentTab === 'operators'"
              key="operators"
              :operators="topOperators"
            />

            <!-- Content: Cupones canjeados -->
            <CouponsAnalytics
              v-else-if="currentTab === 'coupons'"
              key="coupons"
              :series="couponsSeries"
              :labels="couponsLabels"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ApexOptions } from 'apexcharts'
import ScrollableTabs from '@/components/common/ScrollableTabs.vue'
import ChatsAnalytics from '@/components/Pharmacies/ChatsAnalytics.vue'
import OperatorsAnalytics from '@/components/Pharmacies/OperatorsAnalytics.vue'
import CouponsAnalytics from '@/components/Pharmacies/CouponsAnalytics.vue'

const router = useRouter()
const currentTab = ref('chats')
const transitionName = ref('slide-left')

const tabsOrder = ['chats', 'operators', 'coupons']
const analyticsTabs = [
  { label: 'Chats atendidos', path: 'chats' },
  { label: 'Top de operadores', path: 'operators' },
  { label: 'Cupones canjeados', path: 'coupons' },
]

const activeTabIndex = computed(() => tabsOrder.indexOf(currentTab.value))

const handleTabChange = (index: number) => {
  currentTab.value = tabsOrder[index]
}

watch(currentTab, (newTab, oldTab) => {
  const newIndex = tabsOrder.indexOf(newTab)
  const oldIndex = tabsOrder.indexOf(oldTab)
  transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
})

const goBack = () => {
  router.go(-1)
}

const logout = () => {
  console.log('Cerrando sesión...')
}

// Mock Data para KPIs
const kpis = ref([
  { title: 'Total Chats', value: '1,284', icon: 'bi-chat-dots-fill', color: '#0d6efd' },
  { title: 'Chats Activos', value: '42', icon: 'bi-lightning-fill', color: '#ffc107' },
  { title: 'Operadores On', value: '12', icon: 'bi-people-fill', color: '#198754' },
  { title: 'Tiempo Promedio', value: '4m 20s', icon: 'bi-clock-fill', color: '#6610f2' },
])

// Mock Data para Gráfico de Chats
const chatsSeries = ref([
  {
    name: 'Chats',
    data: [31, 40, 28, 51, 42, 109, 100],
  },
])

const chatsOptions = ref<ApexOptions>({
  chart: {
    fontFamily: 'inherit',
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  colors: ['#0d6efd'],
  stroke: { curve: 'smooth' as const, width: 4 },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  },
  tooltip: { theme: 'light' },
  grid: { borderColor: '#f8f9fa' },
})

// Mock Data para Top Operadores
const topOperators = ref([
  { name: 'Ana M.', rank: 1, chats: 145, image: 'https://i.pravatar.cc/150?u=ana' },
  { name: 'Juan P.', rank: 2, chats: 132, image: 'https://i.pravatar.cc/150?u=juan' },
  { name: 'Maria G.', rank: 3, chats: 118, image: 'https://i.pravatar.cc/150?u=maria' },
  { name: 'Luis R.', rank: 4, chats: 95, image: 'https://i.pravatar.cc/150?u=luis' },
  { name: 'Pedro S.', rank: 5, chats: 88, image: 'https://i.pravatar.cc/150?u=pedro' },
  { name: 'Lucia F.', rank: 6, chats: 75, image: 'https://i.pravatar.cc/150?u=lucia' },
])

// Mock Data para Cupones
const couponsSeries = ref([45, 25, 15, 15])
const couponsLabels = ref(['Bienestar', 'Vitalidad', 'Cuidado', 'Otros'])
const couponsColors = ['#0d6efd', '#6610f2', '#ffc107', '#adb5bd']
</script>

<style scoped>
.kpi-pill {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: default;
}

.kpi-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.kpi-icon-container {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.kpi-icon-container i {
  font-size: 1.5rem;
}

.extra-small {
  font-size: 0.75rem;
}

.min-h-0 {
  min-height: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 1200px) {
  .overflow-hidden {
    overflow: auto !important;
  }
  .h-100 {
    height: auto !important;
  }
}
</style>
