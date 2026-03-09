<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'

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
    url_image: '',
    'role.name': 'Administrador',
    full_name: 'Pedro González',
    email: 'pedro.gonzalez@ejemplo.com',
    phone: '+58 212 555 0001',
    active: true,
  },
  {
    id: 2,
    url_image: '',
    'role.name': 'Administrador',
    full_name: 'Ana López',
    email: 'ana.lopez@ejemplo.com',
    phone: '+58 212 666 0002',
    active: false,
  },
])
const search = ref('')

const paginationKey = 'administrators-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: Item }) => {
  if (actionName === 'edit') {
    router.push(`/administrators/edit/${item.id}`)
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
  router.push({ name: 'Nuevo Administrador' })
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
            placeholder="Nombre, correo o teléfono"
            :loading="loading"
            :infoTexts="[
              'Puedes buscar por nombre completo',
              'Puedes buscar por correo electrónico',
              'O por número de teléfono',
            ]"
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
          :data="items"
          :headers="TABLE_HEADERS.administrator"
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
  </DashboardLayout>
</template>
