<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import Modal from '@/components/common/Modal.vue'
import CouponForm from '@/components/Coupons/CouponForm.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'

import { TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

interface Item {
  id: string | number
  [key: string]: any
}

const router = useRouter()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const loading = ref(false)
const items = ref<Item[]>([])
const search = ref('')

const couponModalRef = ref<InstanceType<typeof Modal> | null>(null)
const selectedCoupon = ref<Item | null>(null)
const isReadOnly = ref(false)

const paginationKey = 'coupons-banners-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: Item }) => {
  if (actionName === 'edit') {
    selectedCoupon.value = item
    isReadOnly.value = false
    couponModalRef.value?.openModal()
  } else if (actionName === 'view') {
    selectedCoupon.value = item
    isReadOnly.value = true
    couponModalRef.value?.openModal()
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = (page: number) => {
  pagination.currentPage = page
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
}

const goToNew = () => {
  selectedCoupon.value = null
  isReadOnly.value = false
  couponModalRef.value?.openModal()
}

const fetchData = () => {
  search.value = ''
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey)
  fetchData()
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
      <CustomTable
        :data="items"
        :headers="TABLE_HEADERS.couponsBanners || []"
        :actions="getTableActions"
        :is-loading="loading"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :limit="pagination.limit"
        :change-page="handleTablePagination"
        @change-page="handleTablePagination"
        @action-click="handleTableAction"
      />
    </div>

    <Modal
      id="couponFormModal"
      ref="couponModalRef"
      :title="isReadOnly ? 'Ver Cupón' : selectedCoupon ? 'Editar Cupón' : 'Nuevo Cupón'"
      size="xl"
    >
      <CouponForm :initialData="selectedCoupon" :readOnly="isReadOnly" />
      <template #footer>
        <button
          type="button"
          class="btn btn-secondary px-4 me-2"
          @click="couponModalRef?.closeModal()"
        >
          Cerrar
        </button>
        <button v-if="!isReadOnly" type="button" class="btn btn-primary px-4 fw-bold shadow-sm">
          Guardar
        </button>
      </template>
    </Modal>
  </div>
</template>
