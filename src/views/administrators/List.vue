<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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
import { useSwalToast } from '@/composables/useSwalToast'
import { useTableActions } from '@/composables/useTableActions'
import { useUsers } from '@/composables/Models/useUsers'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS } from '@/const/tableConst'
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

const { loading, users, pagination, paginationKey, getDataUsers, deleteUser, deactivateUser } =
  useUsers()

const search = ref('')

// Pagination and state are handled by the composable

const handleTableAction = async ({ actionName, item }: { actionName: string; item: Item }) => {
  if (actionName === 'edit') {
    router.push(`/administrators/edit/${item.id}`)
  } else if (actionName === 'delete') {
    await deleteUser(item as any)
  } else if (actionName === 'deactivate') {
    await deactivateUser(item as any)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = async (page: number) => {
  await getDataUsers(page, search.value)
}

const goToNew = () => {
  router.push({ name: 'Nuevo Administrador' })
}

const fetchData = async () => {
  await getDataUsers(1, search.value)
}

onMounted(async () => {
  await getDataUsers(pagination.currentPage, search.value)
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.administrators.title"
        :description="TITLE_SECTION_COMPONENT.administrators.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="administrators-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre o correo"
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
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.administrator.tooltipTitle"
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
          :data="users"
          :headers="TABLE_HEADERS.administrator"
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
            <div class="d-flex justify-content-center">
              <AppImage :src="value" type="user" />
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
