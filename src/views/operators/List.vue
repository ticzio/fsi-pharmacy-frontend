<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import AppImage from '@/components/common/AppImage.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useUsers } from '@/composables/Models/useUsers'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

const router = useRouter()
const store = useStore()

const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()
const {
  loading,
  users: items,
  pagination,
  paginationKey,
  getDataUsers,
  deactivateUser,
  deleteUser,
} = useUsers()

const search = ref('')

/**
 * Filtros adicionales para obtener solo operadores (rol 3)
 */
const extraParams = {
  id_type_rol_user: 3,
}

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    router.push(`/operators/edit/${item.id}`)
  } else if (actionName === 'deactivate') {
    await deactivateUser(item)
  } else if (actionName === 'delete') {
    await deleteUser(item)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = async (page: number) => {
  await getDataUsers(page, search.value, extraParams)
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
}

const fetchData = async () => {
  await getDataUsers(1, search.value, extraParams)
}

const goToNew = () => {
  router.push({ name: 'Nuevo Operador' })
}

onMounted(async () => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  await getDataUsers(savedPage || 1, search.value, extraParams)
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.operators.title"
        :description="TITLE_SECTION_COMPONENT.operators.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="operators-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre o correo electrónico"
            :loading="loading"
            :infoTexts="[
              'Puedes buscar por nombre completo',
              'Puedes buscar por correo electrónico',
            ]"
            @search="fetchData"
            only-on-enter
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <!-- 
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.operator.tooltipTitle"
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
          :headers="TABLE_HEADERS.operator"
          :actions="getTableActions"
          :is-loading="loading"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :limit="pagination.limit"
          :change-page="handleTablePagination"
          @change-page="handleTablePagination"
          @action-click="handleTableAction"
        >
          <template #cell(url_image_light)="{ value }">
            <div class="d-flex justify-content-center align-items-center">
              <AppImage
                :src="value"
                type="user"
                width="40px"
                height="40px"
                rounded="rounded shadow-sm"
              />
            </div>
          </template>

          <template #cell(active)="{ value }">
            <StatusBadge :value="value" />
          </template>
        </CustomTable>
      </div>
    </div>
  </DashboardLayout>
</template>
