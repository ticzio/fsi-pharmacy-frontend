<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import {
  TITLE_SECTION_COMPONENT,
  TABLE_HEADERS,
  TABLE_PAGINATION,
  TABLE_ACTIONS,
} from '@/const/tableConst'
import { useSwalToast } from '@/composables/useSwalToast'
import { URLS } from '@/const/api'

const router = useRouter()
const store = useStore()
const swalToast = useSwalToast()
const isMobile = computed(() => store.getters.isMobile)

const loading = ref(false)
const levels = ref<any[]>([])
const search = ref('')

const paginationKey = 'levels-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === TABLE_ACTIONS.edit.name) {
    router.push(`/settings/levels/edit/${item.id}`)
  }
}

const getTableActions = async () => {
  return [TABLE_ACTIONS.edit]
}

const handleTablePagination = (page: number) => {
  pagination.currentPage = page
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
  getDataLevels(page)
}


const getDataLevels = async (page = 1) => {
  loading.value = true
  try {
    const response: any = await store.dispatch('getData', {
      url: URLS.level.getAll,
      params: {
        page: page,
        limit: pagination.limit,
      },
    })

    if (response.code === 200) {
      levels.value = response.data
      pagination.totalPages = response.meta.last_page
      pagination.currentPage = response.meta.current_page
    } else {
      swalToast.showError(response.message || 'Error al obtener los niveles')
    }
  } catch (error: any) {
    console.error('Error fetching levels:', error)
    swalToast.showError(error.message || 'Error de conexión al obtener los niveles')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  pagination.currentPage = savedPage || 1
  getDataLevels(pagination.currentPage)
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.levels.title"
        :description="TITLE_SECTION_COMPONENT.levels.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="levels-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre del nivel"
            :loading="loading"
            :infoTexts="['Puedes buscar por nombre del nivel']"
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="getDataLevels" />
        </div>
      </div>

      <div
        :class="{
          'container-fluid mt-2 border rounded-4 flex-grow-1 d-flex flex-column p-0 bg-white overflow-hidden':
            !isMobile,
        }"
      >
        <CustomTable
          :data="levels"
          :headers="TABLE_HEADERS.levels"
          :actions="getTableActions"
          :is-loading="loading"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :limit="pagination.limit"
          :change-page="handleTablePagination"
          @change-page="handleTablePagination"
          @action-click="handleTableAction"
        >
          <template #cell(active)="{ value }">
            <StatusBadge :value="value" />
          </template>
        </CustomTable>
      </div>
    </div>
  </DashboardLayout>
</template>
