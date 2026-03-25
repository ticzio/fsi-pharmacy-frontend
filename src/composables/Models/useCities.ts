import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'
import { ICONS_MULTISELECT } from '@/const/multiselectConst'

const sharedCities = ref<any[]>([])
const sharedLoading = ref(false)
const sharedPagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

let pendingGetCities: Promise<any> | null = null

export function useCities() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = sharedLoading
  const cities = sharedCities
  const pagination = sharedPagination

  const getDataCities = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.city.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
        },
      })

      if (response.code === 200) {
        cities.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching cities:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const getCities = async (id_state?: string | number) => {
    // 1. Si ya tenemos las ciudades y no se pide un estado específico, devolverlas
    if (cities.value.length > 0 && !id_state) {
      return cities.value
    }

    // 2. Si hay una petición en curso (y no se filtra por estado), compartirla
    if (pendingGetCities && !id_state) {
      return pendingGetCities
    }

    const promise = (async () => {
      loading.value = true
      try {
        const params: any = { limit: 100, active: 1 }
        if (id_state) {
          params.id_state = id_state
        }

        const response: any = await store.dispatch('getData', {
          url: URLS.city.getAll,
          params,
        })

        if (response.code === 200) {
          cities.value = response.data
          return response.data
        }
        return []
      } catch (error) {
        console.error('Error in getCities:', error)
        return []
      } finally {
        loading.value = false
        if (!id_state) pendingGetCities = null
      }
    })()

    if (!id_state) pendingGetCities = promise
    return promise
  }


  const saveCity = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const payload = {
        name: data.name,
        id_state: data.id_type_state?.id || data.id_type_state,
        active: data.active ? 1 : 0,
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.city.update,
          id: id,
          data: payload,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.city.save,
          data: payload,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Ciudad actualizada correctamente' : 'Ciudad creada correctamente',
        )
        await getDataCities(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving city:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateCity = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} la ciudad?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.city.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.city.changeStatus, {}, response)
        swal.showSuccess('Ciudad ' + (isActive ? 'desactivada' : 'activada') + ' exitosamente')
        await getDataCities(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.city.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  const deleteCity = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar la ciudad ${item.name}?`,
      `Esta acción eliminará la ciudad ${item.name}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.city.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.city.changeStatus, {}, response)
        swal.showSuccess('Ciudad eliminada exitosamente')
        await getDataCities(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.city.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  return {
    loading,
    cities,
    pagination,
    getDataCities,
    getCities,
    saveCity,
    deactivateCity,
    deleteCity,
    customIconCity: ICONS_MULTISELECT.city,
  }
}
