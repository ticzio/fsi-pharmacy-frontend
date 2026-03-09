<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import Modal from '@/components/common/Modal.vue'
import NewsForm from '@/components/News/NewsForm.vue'

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
    title: 'Noticia de ejemplo 1',
    body_only_text: 'Descripción breve de la noticia',
    'creator.full_name': 'Admin Principal',
    active: true,
  },
  {
    id: 2,
    url_image: '',
    title: 'Noticia de ejemplo 2',
    body_only_text: 'Descripción breve de la segunda noticia',
    'creator.full_name': 'Admin Principal',
    active: false,
  },
])
const search = ref('')

const paginationKey = 'news-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

// === Modal & Form Logic ===
const formModal = ref<InstanceType<typeof Modal> | null>(null)
const isEditingForm = ref(false)
const formData = ref<any>(null)

const openModal = (isEdit = false, data = null) => {
  isEditingForm.value = isEdit
  formData.value = data
  formModal.value?.openModal()
}

const handleFormSubmit = (data: any) => {
  console.log('Form data to submit:', data)
  // TODO: Agregar lógica real para POST/PUT cuando esté disponible
  swalToast.showSuccess(
    isEditingForm.value ? 'Noticia actualizada correctamente' : 'Noticia creada correctamente',
  )
  formModal.value?.closeModal()
}

const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    openModal(true, item)
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
  openModal(false, null)
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
        :title="TITLE_SECTION_COMPONENT.news.title"
        :description="TITLE_SECTION_COMPONENT.news.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="news-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Título de la noticia"
            :loading="loading"
            :infoTexts="['Puedes buscar por título', 'O por descripción de la noticia']"
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <RedirectButton :tooltip-title="BUTTONS_TOOLTIPS.news.tooltipTitle" @redirect="goToNew" />
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
          :headers="TABLE_HEADERS.news"
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

      <!-- Componente Modal para el Formulario de Noticia -->
      <Modal
        id="newsFormModal"
        ref="formModal"
        size="xl"
        :title="isEditingForm ? 'Editar Noticia' : 'Crear Nueva Noticia'"
        :scrollable="true"
      >
        <NewsForm
          v-if="formModal"
          :is-editing="isEditingForm"
          :initial-data="formData"
          @submit="handleFormSubmit"
          @cancel="formModal?.closeModal()"
        />
      </Modal>
    </div>
  </DashboardLayout>
</template>
