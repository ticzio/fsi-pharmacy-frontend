import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'
import { ICONS_MULTISELECT } from '@/const/multiselectConst'

export function useStates() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const states = ref<any[]>([])

  const paginationKey = 'states-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataStates = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.state.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
        },
      })

      if (response.code === 200) {
        states.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching states:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const getStates = async () => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.state.getAll,
        params: {
          limit: 100,
        },
      })

      if (response.code === 200) {
        states.value = response.data
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching states:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveState = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('name', data.name)

      if (data.url_image instanceof File) {
        formData.append('url_image', data.url_image)
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.state.update,
          id: id,
          data: formData,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.state.save,
          data: formData,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Estado actualizado correctamente' : 'Estado creado correctamente',
        )
        await getDataStates(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving state:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateState = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} el estado?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.state.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.state.changeStatus, {}, response)
        swal.showSuccess('Estado ' + (isActive ? 'desactivada' : 'activada') + ' exitosamente')
        await getDataStates(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.state.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  const deleteState = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar el estado ${item.name}?`,
      `Esta acción eliminará el estado ${item.name}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.state.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.state.changeStatus, {}, response)
        swal.showSuccess('Estado eliminado exitosamente')
        await getDataStates(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.state.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  return {
    loading,
    states,
    pagination,
    paginationKey,
    getDataStates,
    getStates,
    saveState,
    deactivateState,
    deleteState,
    customIconState: ICONS_MULTISELECT.state,
  }
}
