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
import { useLocationInfo } from '@/composables/useLocationInfo'
import { useTableActions } from '@/composables/useTableActions'
import { useMasters } from '@/composables/Masters/useMasters'
import defaultProfileImage from '@/assets/images/default-profile.png'
import FetchButton from '@/components/common/FetchButton.vue'
import RedirectButton from '@/components/common/RedirectButton.vue'

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
const { showLocationInfo } = useLocationInfo()
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const { getDefaultActions } = useTableActions()

// Masters composable para states y cities
const {
  states,
  customIconMapState,
  customDescriptionMapState,
  getStates,
  cities,
  customIconMapCity,
  customDescriptionMapCity,
  getCities,
  clearCities,
} = useMasters()

const loading = ref(false)
const concessionaires = ref<Item[]>([
  {
    id: 1,
    name: 'Farmatodo',
    ubication: 'Caracas, Distrito Capital',
    id_type_city: 1,
    url_image: '',
    description: 'Cadena de farmacias líder en Venezuela',
    url_instagram: 'https://instagram.com/farmatodo',
    url_google_map: 'https://maps.google.com/?q=10.4806,-66.9036',
    lat: 10.4806,
    lon: -66.9036,
    opening_week: '07:00 AM',
    close_week: '10:00 PM',
    opening_saturday: '08:00 AM',
    close_saturday: '09:00 PM',
    opening_sunday: '08:00 AM',
    close_sunday: '08:00 PM',
    url_whatsapp: 'https://wa.me/581234567890',
    code: 'FARM-001',
    phone: '+58 212 123 4567',
    active: true,
    timestamp: '2023-10-01T12:00:00Z',
  },
  {
    id: 2,
    name: 'Locatel',
    ubication: 'Chacao, Miranda',
    id_type_city: 2,
    url_image: '',
    description: 'Farmacia y equipos médicos',
    url_instagram: 'https://instagram.com/locatel',
    url_google_map: 'https://maps.google.com/?q=10.4916,-66.8524',
    lat: 10.4916,
    lon: -66.8524,
    opening_week: '08:00 AM',
    close_week: '09:00 PM',
    opening_saturday: '09:00 AM',
    close_saturday: '08:00 PM',
    opening_sunday: '09:00 AM',
    close_sunday: '06:00 PM',
    url_whatsapp: 'https://wa.me/581234567891',
    code: 'FARM-002',
    phone: '+58 212 987 6543',
    active: false,
    timestamp: '2023-10-02T12:00:00Z',
  },
  {
    id: 3,
    name: 'Farmahorro',
    ubication: 'Baruta, Miranda',
    id_type_city: 3,
    url_image: '',
    description: 'Red de farmacias con excelentes precios',
    url_instagram: 'https://instagram.com/farmahorro',
    url_google_map: 'https://maps.google.com/?q=10.4447,-66.8687',
    lat: 10.4447,
    lon: -66.8687,
    opening_week: '07:30 AM',
    close_week: '08:30 PM',
    opening_saturday: '08:30 AM',
    close_saturday: '07:30 PM',
    opening_sunday: '08:30 AM',
    close_sunday: '05:00 PM',
    url_whatsapp: 'https://wa.me/581234567892',
    code: 'FARM-003',
    phone: '+58 212 111 2222',
    active: true,
    timestamp: '2023-10-03T12:00:00Z',
  },
])
const selectedCity = ref<Item | null>(null)
const selectedState = ref<Item | null>(null)
const search = ref('')

const paginationKey = 'concessionaire-list'
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
  if (actionName === 'edit') {
    if (!item.active) {
      swalToast.showError(ERROR.errorEdited)
      return
    }

    router.push(`/pharmacy/edit/${item.id}/detail-pharmacies`)
  }
}

const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

const handleStateChange = async () => {
  selectedCity.value = null
  if (selectedState.value?.id) {
    await getCities(Number(selectedState.value.id))
  } else {
    clearCities()
  }
}

const showAddressInfo = async (item: any) => {
  const address = item.ubication || 'Sin ubicación registrada'
  const idCity = item.id_type_city

  await showLocationInfo({
    idCity,
    title: 'Ubicación de la farmacia',
    subtitle: 'Revisa la información de ubicación:',
    address,
    latitude: item.lat,
    longitude: item.lon,
    showAddress: true,
    showMapsLink: true,
    enableCopy: true,
  })
}

const handleTablePagination = (page: number) => {
  pagination.currentPage = page

  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })
}

const goToNew = () => {
  router.push({ name: 'Nueva Farmacia' })
}

const fetchData = () => {
  // TODO: Lógica para hacer la petición GET
  selectedState.value = null
  selectedCity.value = null
  search.value = ''
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey)

  getStates()
})

// Watch para detectar cambios en el estado seleccionado
watch(selectedState, () => {
  handleStateChange()
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
            placeholder="Código, RIF o nombre de la empresa"
            :loading="loading"
            :infoTexts="[
              'Puedes buscar por nombre',
              'Puedes buscar por RIF',
              'O buscar por código de la empresa',
            ]"
          />
        </div>

        <div class="col-6 col-md-2">
          <MultiselectCustom
            v-model="selectedState"
            :options="states"
            placeholder="Estado"
            helper-type="custom"
            variant="primary"
            :custom-icon-map="customIconMapState"
            :custom-description-map="customDescriptionMapState"
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
              :custom-icon-map="customIconMapCity"
              :custom-description-map="customDescriptionMapCity"
              :disabled="!selectedState"
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
          <FetchButton @fetch="fetchData" />
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
          :data="concessionaires"
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
          <template #cell(url_image)="{ value }">
            <img
              :src="value || defaultProfileImage"
              :alt="value || 'imagen'"
              class="img-fluid object-fit-cover rounded-pill"
              style="width: 50px; height: 50px"
              @error="(e: Event) => ((e.target as HTMLImageElement).src = defaultProfileImage)"
            />
          </template>
          <template #cell(active)="{ value }">
            <StatusBadge :value="value" />
          </template>
          <template #cell(ubication)="{ item }">
            <button
              class="btn btn-sm btn-primary border-0 rounded-pill"
              @click="showAddressInfo(item)"
            >
              <i class="bi bi-geo-alt-fill"></i>
            </button>
          </template>
        </CustomTable>
      </div>
    </div>
  </DashboardLayout>
</template>
