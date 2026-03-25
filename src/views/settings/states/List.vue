<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import Modal from '@/components/common/Modal.vue'
import StateForm from '@/components/States/StateForm.vue'
import AppImage from '@/components/common/AppImage.vue'

//Composables
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useStates } from '@/composables/Models/useStates'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()
const { loading, states, pagination, getDataStates, saveState, deactivateState, deleteState } =
  useStates()

const search = ref('')
const modalFormRef = ref<any>(null)
const stateFormRef = ref<any>(null)
const selectedState = ref<any>(null)
const isEditing = ref(false)

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    selectedState.value = item
    isEditing.value = true
    modalFormRef.value?.openModal()
  } else if (actionName === 'deactivate') {
    await deactivateState(item)
  } else if (actionName === 'delete') {
    await deleteState(item)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = (page: number) => {
  getDataStates(page, search.value)
}

const goToNew = () => {
  selectedState.value = null
  isEditing.value = false
  modalFormRef.value?.openModal()
}

const fetchData = () => {
  getDataStates(1, search.value)
}

const handleFormSubmit = async (formData: any) => {
  const success = await saveState(formData, isEditing.value, selectedState.value?.id)
  if (success) {
    modalFormRef.value?.closeModal()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.states.title"
        :description="TITLE_SECTION_COMPONENT.states.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="states-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre del estado"
            :loading="loading"
            @search="fetchData"
            :infoTexts="['Puedes buscar por nombre del estado']"
            only-on-enter
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.states.tooltipTitle"
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
          :data="states"
          :headers="TABLE_HEADERS.states"
          :actions="getTableActions"
          :is-loading="loading"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :limit="pagination.limit"
          :change-page="handleTablePagination"
          @change-page="handleTablePagination"
          @action-click="handleTableAction"
        >
          <template #cell(url_image_light)="{ value, item }">
            <div class="d-flex justify-content-center py-1">
              <AppImage
                :src="value"
                :alt="item.name"
                type="entity"
                width="80px"
                height="50px"
                rounded="rounded-3 shadow-sm border"
              />
            </div>
          </template>

          <template #cell(active)="{ value }">
            <StatusBadge :value="value" />
          </template>
        </CustomTable>
      </div>
    </div>

    <!-- Modal Formulario -->
    <Modal
      ref="modalFormRef"
      id="modalStateForm"
      :title="isEditing ? 'Editar Estado' : 'Nuevo Estado'"
      size="lg"
    >
      <StateForm ref="stateFormRef" :initial-data="selectedState" @submit="handleFormSubmit" />
      <template #footer>
        <button
          type="button"
          class="btn btn-light border fw-bold"
          data-bs-dismiss="modal"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary fw-bold text-white"
          @click="stateFormRef?.handleSubmit()"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" class="me-1" />
          {{ isEditing ? 'Guardar Cambios' : 'Crear Estado' }}
        </button>
      </template>
    </Modal>
  </DashboardLayout>
</template>
