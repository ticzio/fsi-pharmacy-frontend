<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'

//Composables
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useExchanges } from '@/composables/Models/useExchanges'

import { TABLE_HEADERS } from '@/const/tableConst'

const store = useStore()
const route = useRoute()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()
const {
  loading,
  exchanges,
  pagination,
  paginationKey,
  getExchangesByClientId,
} = useExchanges()

const idClient = computed(() => route.params.id as string)
const search = ref('')

const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
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
  fetchData(page)
}

const fetchData = async (page = 1) => {
  if (idClient.value) {
    await getExchangesByClientId(idClient.value, page, search.value)
  }
}

const onSearch = () => {
  fetchData(1)
}

onMounted(async () => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  if (savedPage) {
    pagination.currentPage = savedPage
  }
  await fetchData(pagination.currentPage)
})

watch(search, (newSearch) => {
  if (!newSearch) {
    fetchData(1)
  }
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
          @search="onSearch"
        />
      </div>

      <div
        class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
      >
        <FetchButton :loading="loading" @fetch="fetchData(1)" />
      </div>
    </div>

    <div
      :class="{
        'container-fluid mt-2 border rounded-4 flex-grow-1 d-flex flex-column p-0 bg-white overflow-hidden':
          !isMobile,
      }"
    >
      <CustomTable
        :data="exchanges"
        :headers="TABLE_HEADERS.exchangesClient || []"
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
