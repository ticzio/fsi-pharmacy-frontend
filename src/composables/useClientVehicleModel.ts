import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLocationInfo } from '@/composables/useLocationInfo'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_ACTIONS } from '@/const/tableConst'
import { ICONS_MULTISELECT } from '@/const/multiselectConst'

interface UseClientVehicleModelOptions {
  paginationKey: string
}

export function useClientVehicleModel(options: UseClientVehicleModelOptions) {
  const { paginationKey } = options

  const router = useRouter()
  const store = useStore()
  const swal = useSwal()
  const swalToast = useSwalToast()
  const { showLocationInfo } = useLocationInfo()

  // State
  const isLoading = ref(false)
  const query = ref('')
  const companies = ref<any[]>([])
  const selectedCompany = ref(null)
  const clients = ref([])
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  })

  // Computed
  const companyIconMap = computed(() => {
    const map: Record<string, string> = {}
    companies.value.forEach((company) => {
      map[company.id] = ICONS_MULTISELECT.company
    })
    return map
  })

  const companyDescriptionMap = computed(() => {
    const map: Record<string, string> = {}
    companies.value.forEach((company) => {
      map[company.id] = company.address || 'Sin dirección'
    })
    return map
  })

  const isDeleting = computed(() => store.getters['utils/isDeleting'])
  const isUpdating = computed(() => store.getters['utils/isUpdating'])
  const isCreating = computed(() => store.getters['utils/isCreating'])

  // Table Actions
  const getTableActions = (item: any) => {
    const actions = [
      {
        name: TABLE_ACTIONS.edit.name,
        icon: TABLE_ACTIONS.edit.icon,
        class: TABLE_ACTIONS.edit.class,
        tooltip: TABLE_ACTIONS.edit.tooltip,
      },
      {
        name: TABLE_ACTIONS.deactivate.name,
        icon: !item.active ? 'bi bi-x-circle-fill fs-5' : 'bi bi-check-circle-fill fs-5',
        class: !item.active
          ? `${TABLE_ACTIONS.deactivate.class} btn btn-warning`
          : `${TABLE_ACTIONS.deactivate.class} btn btn-success`,
        tooltip: !item.active ? 'activar' : 'desactivar',
      },
      {
        name: TABLE_ACTIONS.delete.name,
        icon: TABLE_ACTIONS.delete.icon,
        class: TABLE_ACTIONS.delete.class,
        tooltip: TABLE_ACTIONS.delete.tooltip,
      },
    ]

    return actions
  }

  // Methods
  const getCompanies = async () => {
    try {
      const response = await store.dispatch('getData', {
        url: URLS.company.getAll,
      })

      if (response.code === 200) {
        companies.value = response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getClients = async () => {
    try {
      isLoading.value = true
      const params: any = {
        page: pagination.currentPage,
        limit: pagination.limit,
        query: query.value,
        active: null,
      }

      if (selectedCompany.value) {
        params.id_company = (selectedCompany.value as any).id
      }

      const response = await store.dispatch('getData', {
        url: URLS.clientVehicle.getAll,
        params,
      })

      if (response.code === 200) {
        clients.value = response.data.data
        pagination.totalPages = response.data.meta.last_page

        store.dispatch('pagination/updatePagination', {
          key: paginationKey,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        })
      }
    } catch (error) {
      console.error(error)
      swalToast.showError(ERROR.errorGet)
    } finally {
      isLoading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    pagination.currentPage = page

    store.dispatch('pagination/updatePagination', {
      key: paginationKey,
      currentPage: page,
    })

    getClients()
  }

  const showAddressInfo = async (idCity: number) => {
    await showLocationInfo({
      idCity,
      title: 'Ubicación del cliente',
      showAddress: false,
      showMapsLink: false,
      enableCopy: false,
    })
  }

  const deactivateClient = async (item: any) => {
    const isActive = Boolean(item?.status ?? item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} cliente?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} a ${item.client?.first_name} ${item.client?.last_name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.clientVehicle.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })

      if (response.code === 200 || response.code === 201) {
        swal.showSuccess(`Cliente ${isActive ? 'desactivado' : 'activado'} exitosamente`)
        getClients()
      }
    } catch (error: any) {
      console.error('Error al cambiar el estado:', error)
      swalToast.showError(
        `${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.client?.first_name} ${item.client?.last_name}`,
      )
    }
  }

  const deleteClient = async (item: any) => {
    const firstName = item.client?.first_name
    const lastName = item.client?.last_name

    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar a ${firstName} ${lastName}?`,
      `Esta acción eliminará al cliente ${firstName} ${lastName}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.clientVehicle.changeStatus,
        id: item.id,
        status: 2,
      })

      if (response.code == 200 || response.code == 201) {
        swal.showSuccess(`Cliente eliminado exitosamente`)
        getClients()
      }
    } catch (error: any) {
      console.error('Error al eliminar:', error)
      swalToast.showError(`${ERROR.errorDelete} ${firstName} ${lastName}`)
    }
  }

  const handleTableAction = ({ actionName, item }: { actionName: string; item: any }) => {
    if (actionName === 'edit') {
      if (!item.active) {
        swalToast.showError(ERROR.errorEdited)
        return
      }
      router.push({
        name: 'Editar Cliente',
        params: { id_client: item.id, id_client_points: item.id_client },
      })
    }
    if (actionName === 'deactivate') {
      deactivateClient(item)
    }
    if (actionName === 'delete') {
      deleteClient(item)
    }
  }

  const clearFilters = () => {
    query.value = ''
    selectedCompany.value = null
    getClients()
  }

  const initialize = () => {
    const savedPageGetter = store.getters['pagination/getPage']
    pagination.currentPage = savedPageGetter(paginationKey)

    getCompanies()
    getClients()
  }

  // Watchers
  watch(
    [() => isDeleting.value, () => isUpdating.value, () => isCreating.value],
    ([newIsDeleting, newIsUpdating, newIsCreating]) => {
      if (!newIsDeleting && !newIsUpdating && !newIsCreating) return

      if (newIsDeleting) store.dispatch('utils/setIsDeleting', false)
      if (newIsUpdating) store.dispatch('utils/setIsUpdating', false)
      if (newIsCreating) store.dispatch('utils/setIsCreating', false)

      getClients()
    },
  )

  watch(selectedCompany, () => {
    pagination.currentPage = 1
    getClients()
  })

  return {
    // State
    clients,
    isLoading,
    query,
    companies,
    selectedCompany,
    pagination,

    // Computed
    companyIconMap,
    companyDescriptionMap,

    // Methods
    getTableActions,
    handleTableAction,
    handlePageChange,
    showAddressInfo,
    getClients,
    getCompanies,
    clearFilters,
    initialize,
  }
}
