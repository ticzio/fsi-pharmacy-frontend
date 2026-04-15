<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import Modal from '@/components/common/Modal.vue'
import CouponForm from '@/components/Coupons/CouponForm.vue'
import AppImage from '@/components/common/AppImage.vue'

//Composables
import { useStore } from 'vuex'
import { useCoupons } from '@/composables/Models/useCoupons'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_ACTIONS } from '@/const/tableConst'

interface Item {
  id: string | number
  [key: string]: any
}

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const {
  loading,
  coupons,
  pagination,
  getDataCoupons,
  deactivateCoupon,
  deleteCoupon,
  paginationKey,
} = useCoupons()

const search = ref('')

const couponModalDialog = ref<InstanceType<typeof Modal> | null>(null)
const selectedCoupon = ref<Item | null>(null)
const isModalReadOnly = ref(true)

const handleTableAction = async ({ actionName, item }: { actionName: string; item: Item }) => {
  if (actionName === 'view' || actionName === 'edit') {
    selectedCoupon.value = { ...item }
    isModalReadOnly.value = actionName === 'view'
    couponModalDialog.value?.openModal()
  } else if (actionName === 'deactivate') {
    await deactivateCoupon(item)
  } else if (actionName === 'delete') {
    await deleteCoupon(item)
  }
}

const getTableActions = async () => {
  return [TABLE_ACTIONS.edit]
}

const handleTablePagination = (page: number) => {
  getDataCoupons(page, search.value)
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
}

const fetchData = () => {
  getDataCoupons(1, search.value)
}

const refreshData = () => {
  search.value = ''
  fetchData()
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey) || 1
  getDataCoupons(savedPage, search.value)
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.coupons.title"
        :description="TITLE_SECTION_COMPONENT.coupons.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="coupons-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Código o nombre del cupón"
            :loading="loading"
            @keyup.enter="fetchData"
            :infoTexts="['Puedes buscar por código', 'Puedes buscar por nombre del cupón']"
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="refreshData" :loading="loading" />
        </div>
      </div>

      <div
        :class="{
          'container-fluid mt-2 border rounded-4 flex-grow-1 d-flex flex-column p-0 bg-white overflow-hidden':
            !isMobile,
        }"
      >
        <CustomTable
          :data="coupons"
          :headers="TABLE_HEADERS.coupons"
          :actions="getTableActions"
          :is-loading="loading"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :limit="pagination.limit"
          :change-page="handleTablePagination"
          @change-page="handleTablePagination"
          @action-click="handleTableAction"
        >
          <template #cell(url_img)="{ value }">
            <AppImage :src="value" :alt="'Imagen del cupón'" />
          </template>
          <template #cell(start_date)="{ value }">
            <span v-format-date="value"></span>
          </template>
          <template #cell(finish_date)="{ value }">
            <span v-format-date="value"></span>
          </template>
          <template #cell(created_at)="{ value }">
            <span v-format-date-time="value"></span>
          </template>
        </CustomTable>
      </div>

      <!-- Modal Detalles de Cupón -->
      <Modal
        id="couponDetailsModal"
        ref="couponModalDialog"
        :title="TITLE_SECTION_COMPONENT.coupons.details"
        size="lg"
      >
        <CouponForm :initial-data="selectedCoupon" :read-only="isModalReadOnly" />
      </Modal>
    </div>
  </DashboardLayout>
</template>
