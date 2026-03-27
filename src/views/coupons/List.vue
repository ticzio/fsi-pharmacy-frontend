<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useCoupons } from '@/composables/Models/useCoupons'

const { loading, coupons, pagination, getDataCoupons } = useCoupons()

const headers = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Cupón' },
  { key: 'description', label: 'Descripción' },
  { key: 'start_date', label: 'Inicio' },
  { key: 'finish_date', label: 'Fin' },
  { key: 'active', label: 'Estado' },
]

const searchTerm = ref('')

const handleSearch = (term: string) => {
  searchTerm.value = term
  getDataCoupons(1, term)
}

const handlePageChange = (page: number) => {
  getDataCoupons(page, searchTerm.value)
}

onMounted(() => {
  getDataCoupons()
})
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid p-0 d-flex flex-column gap-4 h-100">
      <TitleSection
        title="Mis Cupones"
        description="Gestiona los cupones disponibles para tus clientes"
        :show-logo="true"
      />

      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white flex-grow-1 d-flex flex-column overflow-hidden">
        <div class="row mb-4">
          <div class="col-12 col-md-5 col-lg-4">
            <SearchInput
              id="search-coupons"
              v-model="searchTerm"
              placeholder="Buscar cupones..."
              @search="handleSearch"
            />
          </div>
        </div>

        <div class="flex-grow-1 overflow-hidden">
          <CustomTable
            :data="coupons"
            :headers="headers"
            :is-loading="loading"
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            @change-page="handlePageChange"
          >
            <!-- Slot para el nombre -->
            <template #cell(name)="{ value }">
              <span class="fw-bold text-dark">{{ value }}</span>
            </template>

            <!-- Slot para el estado -->
            <template #cell(active)="{ value }">
              <StatusBadge :value="value" />
            </template>
          </CustomTable>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.container-fluid {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  border-radius: 20px !important;
}
</style>
