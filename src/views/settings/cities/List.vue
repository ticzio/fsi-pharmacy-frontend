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
import CityForm from '@/components/Cities/CityForm.vue'

//Composables
import { useStore } from 'vuex'
import { useTableActions } from '@/composables/useTableActions'
import { useCities } from '@/composables/Models/useCities'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()
const { loading, cities, pagination, getDataCities, saveCity, deactivateCity, deleteCity } =
  useCities()

const search = ref('')
const modalFormRef = ref<any>(null)
const cityFormRef = ref<any>(null)
const selectedCity = ref<any>(null)
const isEditing = ref(false)

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    selectedCity.value = item
    isEditing.value = true
    modalFormRef.value?.openModal()
  } else if (actionName === 'deactivate') {
    await deactivateCity(item)
  } else if (actionName === 'delete') {
    await deleteCity(item)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleTablePagination = (page: number) => {
  getDataCities(page, search.value)
}

const goToNew = () => {
  selectedCity.value = null
  isEditing.value = false
  modalFormRef.value?.openModal()
}

const fetchData = () => {
  getDataCities(1, search.value)
}

const handleFormSubmit = async (formData: any) => {
  const success = await saveCity(formData, isEditing.value, selectedCity.value?.id)
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
        :title="TITLE_SECTION_COMPONENT.cities.title"
        :description="TITLE_SECTION_COMPONENT.cities.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="cities-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Nombre de la ciudad"
            :loading="loading"
            @search="fetchData"
            :infoTexts="['Puedes buscar por nombre de la ciudad', 'O por el estado']"
            only-on-enter
          />
        </div>

        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="fetchData" />
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.cities.tooltipTitle"
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
          :data="cities"
          :headers="TABLE_HEADERS.cities"
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

    <!-- Modal Formulario -->
    <Modal
      ref="modalFormRef"
      id="modalCityForm"
      :title="isEditing ? 'Editar Ciudad' : 'Nueva Ciudad'"
      size="md"
    >
      <CityForm ref="cityFormRef" :initial-data="selectedCity" @submit="handleFormSubmit" />
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
          @click="cityFormRef?.handleSubmit()"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" class="me-1" />
          {{ isEditing ? 'Guardar Cambios' : 'Crear Ciudad' }}
        </button>
      </template>
    </Modal>
  </DashboardLayout>
</template>
