<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomCardGrid from '@/components/common/CustomCardGrid.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import Modal from '@/components/common/Modal.vue'
import CouponForm from '@/components/Coupons/CouponForm.vue'

//Composables
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useCoupons } from '@/composables/Models/useCoupons'

import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

interface Item {
  id: string | number
  [key: string]: any
}

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const {
  loading,
  coupons,
  pagination,
  paginationKey,
  getDataCoupons,
  saveCoupon,
  deactivateCoupon,
  deleteCoupon,
} = useCoupons()

const search = ref('')

const couponModalRef = ref<InstanceType<typeof Modal> | null>(null)
const selectedCoupon = ref<Item | null>(null)
const isReadOnly = ref(false)
const couponFormRef = ref<InstanceType<typeof CouponForm> | null>(null)

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit' || actionName === 'view') {
    selectedCoupon.value = item
    isReadOnly.value = actionName === 'view'
    couponModalRef.value?.openModal()
  } else if (actionName === 'deactivate') {
    await deactivateCoupon(item)
  } else if (actionName === 'delete') {
    await deleteCoupon(item)
  }
}

const handleCardClick = (item: any) => {
  selectedCoupon.value = item
  isReadOnly.value = false
  couponModalRef.value?.openModal()
}

const getTableActions = (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = (page: number) => {
  pagination.currentPage = page
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
  getDataCoupons(page, search.value)
}

const fetchData = () => {
  getDataCoupons(1, search.value)
}

const goToNew = () => {
  selectedCoupon.value = null
  isReadOnly.value = false
  couponModalRef.value?.openModal()
}

const handleFormSubmit = async (data: any) => {
  const success = await saveCoupon(data, !!selectedCoupon.value, selectedCoupon.value?.id)
  if (success) {
    couponModalRef.value?.closeModal()
  }
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  pagination.currentPage = savedPage || 1
  getDataCoupons(pagination.currentPage, search.value)
})
</script>

<template>
  <div class="d-flex flex-column h-100">
    <!-- Fila de filtros -->
    <div class="row mb-4 align-items-end g-3">
      <div class="col-12 col-md-4">
        <SearchInput
          id="coupons-banners-search"
          v-model="search"
          label="Buscar por:"
          placeholder="Nombre o descripción"
          :loading="loading"
          :infoTexts="['Puedes buscar por título', 'O por descripción']"
          @search="fetchData"
          only-on-enter
        />
      </div>

      <div
        class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
      >
        <FetchButton @fetch="fetchData" />
        <RedirectButton
          :tooltip-title="BUTTONS_TOOLTIPS.couponsBanners?.tooltipTitle || 'Nuevo banner de cupón'"
          @redirect="goToNew"
        />
      </div>
    </div>

    <div
      :class="{
        'container-fluid mt-2 border rounded-4 flex-grow-1 d-flex flex-column p-0 bg-white overflow-hidden':
          !isMobile,
      }"
    >
      <CustomCardGrid
        :data="coupons"
        :actions="getTableActions"
        :is-loading="loading"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :limit="pagination.limit"
        @change-page="handleTablePagination"
        @action-click="handleTableAction"
        @card-click="handleCardClick"
        title-key="name"
        description-key="description"
        image-key="url_img"
        start-date-key="start_date"
        finish-date-key="finish_date"
        status-key="active"
      />
    </div>

    <Modal
      id="couponFormModal"
      ref="couponModalRef"
      :title="isReadOnly ? 'Ver Cupón' : selectedCoupon ? 'Editar Cupón' : 'Nuevo Cupón'"
      size="xl"
    >
      <CouponForm
        ref="couponFormRef"
        :initialData="selectedCoupon"
        :readOnly="isReadOnly"
        @submit="handleFormSubmit"
      />
      <template #footer>
        <button
          type="button"
          class="btn btn-secondary px-4 me-2"
          @click="couponModalRef?.closeModal()"
        >
          Cerrar
        </button>
        <button
          v-if="!isReadOnly"
          type="button"
          class="btn btn-primary px-4 fw-bold shadow-sm"
          @click="couponFormRef?.handleSubmit()"
        >
          {{ selectedCoupon ? 'Actualizar' : 'Guardar' }}
        </button>
      </template>
    </Modal>
  </div>
</template>
