<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useMissions } from '@/composables/Models/useMissions'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

const router = useRouter()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultSafeActions } = useTableActions()
const {
  loading,
  missions,
  pagination,
  paginationKey,
  getDataMissions,
  deactivateMission,
  deleteMission,
} = useMissions()

const search = ref('')

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    // router.push(`/settings/missions/edit/${item.id}`)
  } else if (actionName === 'deactivate') {
    await deactivateMission(item)
  } else if (actionName === 'delete') {
    await deleteMission(item)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultSafeActions()
}

const handleTablePagination = async (page: number) => {
  await getDataMissions(page, search.value)
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
}

const goToNew = () => {
  // router.push({ name: 'Nueva Misión' })
}

const fetchData = async () => {
  await getDataMissions(1, search.value)
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  pagination.currentPage = savedPage
  getDataMissions(savedPage, search.value)
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.missions.title"
        :description="TITLE_SECTION_COMPONENT.missions.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="missions-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre o descripción"
            :loading="loading"
            :infoTexts="['Puedes buscar por nombre de la misión', 'O por descripción']"
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <!-- 
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.missions.tooltipTitle"
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
          :data="missions"
          :headers="TABLE_HEADERS.missions"
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
