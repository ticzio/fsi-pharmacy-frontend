<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import Modal from '@/components/common/Modal.vue'
import CouponForm from '@/components/Coupons/CouponForm.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useTableActions } from '@/composables/useTableActions'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

interface Item {
  id: string | number
  [key: string]: any
}

const router = useRouter()
const swalToast = useSwalToast()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const loading = ref(false)
const items = ref<Item[]>([
  {
    id: 1,
    code: 'CUP-001',
    name: 'Descuento 10%',
    description: 'Cupón de descuento del 10%',
    id_level: 1,
    url_img: 'https://via.placeholder.com/150',
    start_date: '2026-01-01',
    finish_date: '2026-12-31',
    timestamp: '2026-01-01T12:00:00Z',
    active: true,
  },
  {
    id: 2,
    code: 'CUP-002',
    name: 'Descuento 20%',
    description: 'Cupón de descuento del 20%',
    id_level: 2,
    url_img: 'https://via.placeholder.com/150',
    start_date: '2026-06-01',
    finish_date: '2026-06-30',
    timestamp: '2026-06-01T12:00:00Z',
    active: false,
  },
])
const search = ref('')

const paginationKey = 'coupons-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const couponModalDialog = ref<InstanceType<typeof Modal> | null>(null)
const selectedCoupon = ref<Item | null>(null)
const isModalReadOnly = ref(true) // Start read-only when viewing

const handleTableAction = ({ actionName, item }: { actionName: string; item: Item }) => {
  if (actionName === 'edit' || actionName === 'view') {
    // Support generic view or edit
    selectedCoupon.value = { ...item }
    isModalReadOnly.value = actionName === 'view'
    couponModalDialog.value?.openModal()
  } else if (actionName === 'edit') {
    // Optional: router.push(`/coupons/edit/${item.id}`) if a different flow exists.
    // Using modal for now
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
  router.push({ name: 'Nuevo Cupón' })
}

const fetchData = () => {
  // TODO: Lógica para hacer la petición GET
  search.value = ''
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey)
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
            :infoTexts="['Puedes buscar por código', 'Puedes buscar por nombre del cupón']"
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <!--  <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.concessionaire.tooltipTitle"
            @redirect="goToNew"
          />
           -->
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
          :headers="TABLE_HEADERS.coupons"
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

      <!-- Modal Detalles de Cupón -->
      <Modal
        id="couponDetailsModal"
        ref="couponModalDialog"
        :title="'Detalles del Cupón'"
        size="lg"
      >
        <CouponForm :initial-data="selectedCoupon" :readOnly="isModalReadOnly" />
      </Modal>
    </div>
  </DashboardLayout>
</template>
