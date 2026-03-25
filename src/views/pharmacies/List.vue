<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import MultiselectCustom from '@/components/common/MultiselectCustom.vue'
import SearchInput from '@/components/common/SearchInput.vue'

//Composables
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useTableActions } from '@/composables/useTableActions'
import { usePharmacy } from '@/composables/Models/usePharmacy'
import { useStates } from '@/composables/Models/useStates'
import { useCities } from '@/composables/Models/useCities'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'
import AppImage from '@/components/common/AppImage.vue'

import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'
import { BUTTONS_TOOLTIPS } from '@/const/buttonConst'
import { ERROR } from '@/const/errorConst'

interface Item {
  id: string | number
  [key: string]: any
}

const router = useRouter()
const swalToast = useSwalToast()
const swal = useSwal()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

const { states, getStates, customIconState } = useStates()
const { cities, getCities, customIconCity } = useCities()

const clearCities = () => {
  cities.value = []
}
const {
  loading,
  pharmacies,
  pagination,
  paginationKey,
  getDataPharmacies,
  deactivatePharmacy,
  deletePharmacy,
} = usePharmacy()

const selectedCity = ref<Item | null>(null)
const selectedState = ref<Item | null>(null)
const search = ref('')

const handleTableAction = async ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    if (!item.active) {
      swalToast.showError(ERROR.errorEdited)
      return
    }

    router.push(`/pharmacy/edit/${item.id}/detail-pharmacies`)
  } else if (actionName === 'deactivate') {
    await deactivatePharmacy(item)
  } else if (actionName === 'delete') {
    await deletePharmacy(item)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleStateChange = async () => {
  selectedCity.value = null
  if (selectedState.value) {
    await getCities(selectedState.value.id)
  } else {
    clearCities()
  }
}

const handleTablePagination = (page: number) => {
  pagination.currentPage = page

  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
  getDataPharmacies(page, search.value, selectedCity.value?.id)
}

const goToNew = () => {
  router.push({ name: 'Nueva Farmacia' })
}

const clearFilters = () => {
  search.value = ''
  const shouldFetch = selectedCity.value === null
  selectedState.value = null
  selectedCity.value = null
  
  if (shouldFetch) {
    fetchData()
  }
}

const fetchData = () => {
  pagination.currentPage = 1
  getDataPharmacies(1, search.value, selectedCity.value?.id)
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey) || 1

  getStates()
  getDataPharmacies(pagination.currentPage, search.value, selectedCity.value?.id)
})

// Watch para detectar cambios en el estado seleccionado
watch(selectedState, () => {
  handleStateChange()
})

// Watch para detectar cambios en la ciudad seleccionada
watch(selectedCity, () => {
  fetchData()
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.pharmacy.title"
        :description="TITLE_SECTION_COMPONENT.pharmacy.description"
        :show-logo="true"
      />
      <!-- Fila de filtros -->
      <div class="row mb-4 align-items-end g-3">
        <div class="col-12 col-md-4">
          <SearchInput
            id="pharmacy-search"
            v-model="search"
            label="Buscar por:"
            placeholder="Código o nombre de la empresa"
            :loading="loading"
            :infoTexts="['Puedes buscar por nombre', 'Puedes buscar por código']"
            @search="fetchData"
            only-on-enter
          />
        </div>

        <div class="col-6 col-md-2">
          <MultiselectCustom
            v-model="selectedState"
            :options="states"
            placeholder="Estado"
            helper-type="custom"
            variant="primary"
            :custom-default-icon="customIconState"
            :show-descriptions="false"
            label-key="name"
            track-by="id"
          />
        </div>

        <div class="col-6 col-md-2">
          <div class="position-relative">
            <MultiselectCustom
              v-model="selectedCity"
              :options="cities"
              placeholder="Ciudad"
              helper-type="custom"
              variant="primary"
              :custom-default-icon="customIconCity"
              :show-descriptions="false"
              :disabled="!selectedState"
              label-key="name"
              track-by="id"
            />
            <span
              v-if="selectedState && !selectedCity"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="z-index: 10000000"
            >
              !
            </span>
          </div>
        </div>
        <div
          class="col-12 col-md d-flex flex-md-row gap-2 align-items-stretch align-items-md-end justify-content-md-end mt-1 mt-md-0"
        >
          <FetchButton @fetch="clearFilters" />
          <RedirectButton
            :tooltip-title="BUTTONS_TOOLTIPS.pharmacy.tooltipTitle"
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
          :data="pharmacies"
          :headers="TABLE_HEADERS.pharmacy"
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
            <AppImage :src="value" type="entity" width="50px" height="50px" />
          </template>
          <template #cell(active)="{ value }">
            <StatusBadge :value="value" />
          </template>
        </CustomTable>
      </div>
    </div>
  </DashboardLayout>
</template>
