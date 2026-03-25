<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import CustomTable from '@/components/common/CustomTable.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import Modal from '@/components/common/Modal.vue'
import TemplateForm from '@/components/Templates/TemplateForm.vue'

import { useTemplateMessage } from '@/composables/Models/useTemplateMessage'

//Composables
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useTableActions } from '@/composables/useTableActions'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'

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
const route = useRoute()
const idPharmacy = route.params.id_pharmacy as string
const swalToast = useSwalToast()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const search = ref('')

const {
  loading,
  templates: items,
  pagination,
  paginationKey,
  getDataTemplates,
  saveTemplate,
  deactivateTemplate,
  deleteTemplate,
} = useTemplateMessage()

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    modalMode.value = 'edit'
    selectedTemplate.value = item
    templateModalRef.value?.openModal()
  } else if (actionName === 'deactivate') {
    const success = await deactivateTemplate(item)
    if (success) {
      await fetchData()
    }
  } else if (actionName === 'delete') {
    const success = await deleteTemplate(item)
    if (success) {
      await fetchData()
    }
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = async (page: number) => {
  pagination.currentPage = page
  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
  await getDataTemplates(page, search.value, idPharmacy)
}

const goToNew = () => {
  modalMode.value = 'create'
  selectedTemplate.value = null
  templateModalRef.value?.openModal()
}

const fetchData = async () => {
  await getDataTemplates(pagination.currentPage, search.value, idPharmacy)
}

const handleTemplateSubmit = async (formData: any) => {
  const isEditing = modalMode.value === 'edit'
  const payload = { ...formData, id_pharmacies: idPharmacy }
  const idToEdit = selectedTemplate.value?.id

  const success = await saveTemplate(payload, isEditing, idToEdit)
  if (success) {
    templateModalRef.value?.closeModal()
    fetchData()
  }
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  const savedPage = savedPageGetter(paginationKey)
  if (savedPage) {
    pagination.currentPage = savedPage
  }
  fetchData()
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
      >
        <template #cell(active)="{ value }">
          <StatusBadge :value="value" />
        </template>
      </CustomTable>
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
