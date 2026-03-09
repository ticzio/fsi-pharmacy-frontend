<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import Modal from '@/components/common/Modal.vue'
import TemplateForm from '@/components/Pharmacies/TemplateForm.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useTableActions } from '@/composables/useTableActions'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

interface Item {
  id: string | number
  title: string
  description: string
  type_notification?: string
  type?: string
  active?: boolean
  [key: string]: any
}

const templateModalRef = ref<InstanceType<typeof Modal> | null>(null)
const modalMode = ref<'create' | 'edit'>('create')
const selectedTemplate = ref<Item | null>(null)

const router = useRouter()
const swalToast = useSwalToast()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const loading = ref(false)
const items = ref<Item[]>([
  {
    id: 1,
    title: 'Plantilla de bienvenida',
    description: '<p>Mensaje de bienvenida para usuarios</p>',
    active: true,
  },
  {
    id: 2,
    title: 'Plantilla de promociones',
    description: '<p>Descuentos del fin de semana</p>',
    active: false,
  },
])
const search = ref('')

const paginationKey = 'templates-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    modalMode.value = 'edit'
    selectedTemplate.value = item
    templateModalRef.value?.openModal()
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
  modalMode.value = 'create'
  selectedTemplate.value = null
  templateModalRef.value?.openModal()
}

const fetchData = () => {
  // TODO: Lógica para hacer la petición GET
  search.value = ''
}

const handleTemplateSubmit = () => {
  fetchData()
  templateModalRef.value?.closeModal()
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
          id="templates-search"
          v-model="search"
          label="Buscar por:"
          placeholder="Título de la plantilla"
          :loading="loading"
          :infoTexts="['Puedes buscar por título', 'O por descripción de la plantilla']"
        />
      </div>

      <div
        class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
      >
        <FetchButton @fetch="fetchData" />
        <RedirectButton
          :tooltip-title="TITLE_SECTION_COMPONENT.template_pharmacies.new"
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
        :headers="TABLE_HEADERS.template_pharmacies"
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
      ref="templateModalRef"
      id="templateModal"
      :title="modalMode === 'create' ? 'Nueva Plantilla' : 'Editar Plantilla'"
      size="lg"
    >
      <TemplateForm
        :initial-data="modalMode === 'edit' ? selectedTemplate : undefined"
        @close="templateModalRef?.closeModal()"
        @submit="handleTemplateSubmit"
      />
    </Modal>
  </div>
</template>
