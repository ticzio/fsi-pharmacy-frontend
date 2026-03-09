<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'

//Composables
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'

import { TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'

interface Item {
  id: string | number
  [key: string]: any
}

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const loading = ref(false)
const items = ref<Item[]>([
  {
    id: 1,
    code: 'USER10',
    description: '10% de descuento para clientes fieles',
    discount_type: 'Porcentaje',
    value: '10%',
    active: true,
  },
])
const search = ref('')

const paginationKey = 'users-coupons-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: Item }) => {
  console.log('Action:', actionName, 'Item:', item)
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

const fetchData = () => {
  search.value = ''
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey)
})
</script>

<template>
  <div class="d-flex flex-column h-100">
    <!-- Fila de filtros -->
    <div class="row mb-4 align-items-end g-3">
      <div class="col-12 col-md-4">
        <SearchInput
          id="users-coupons-search"
          v-model="search"
          label="Buscar por:"
          placeholder="Código o descripción"
          :loading="loading"
        />
      </div>

      <div
        class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
      >
        <FetchButton @fetch="fetchData" />
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
        :headers="TABLE_HEADERS.coupons || []"
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
  </div>
</template>

<style scoped></style>
