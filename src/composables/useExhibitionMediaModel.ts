import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { TABLE_PAGINATION } from '@/const/tableConst'
import { ERROR } from '@/const/errorConst'

export const useExhibitionMediaModel = () => {
  const store = useStore()
  const route = useRoute()
  const swal = useSwal()
  const swalToast = useSwalToast()
  const logger = useLogger()

  const idExhibition = route.params.id_exhibition as string

  const mediaList = ref<any[]>([])
  const isLoading = ref(false)

  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const paginationKey = 'exhibition-media-list'

  const getMedia = async (
    page: number = pagination.currentPage,
    limit: number = pagination.limit,
    search: string = '',
  ) => {
    if (!idExhibition) return

    isLoading.value = true
    const params = {
      page,
      limit,
      query: search,
      id_exhibition: idExhibition,
      active: null,
    }

    try {
      const response = await store.dispatch('getData', {
        url: URLS.exhibitionMedia.getAll,
        params,
      })

      if (response.code === 200) {
        logger.logRequest(URLS.exhibitionMedia.getAll, params, response)
        mediaList.value = response.data?.data || response.data || []

        pagination.currentPage = page
        pagination.totalPages = response.data?.meta?.last_page || TABLE_PAGINATION.totalPages
        pagination.limit = limit

        store.dispatch('pagination/updatePagination', {
          key: paginationKey,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        })
      }
    } catch (error: any) {
      logger.logRequest(URLS.exhibitionMedia.getAll, params, error)
      swalToast.showError(`${ERROR.errorGet} elementos multimedia`)
    } finally {
      isLoading.value = false
    }
  }

  const saveMedia = async (payload: any) => {
    isLoading.value = true
    try {
      const dataToSend = payload instanceof FormData ? payload : { ...payload }
      if (dataToSend instanceof FormData) {
        dataToSend.append('id_exhibition', idExhibition.toString())
      } else {
        dataToSend.id_exhibition = idExhibition
      }

      const response = await store.dispatch('createData', {
        url: URLS.exhibitionMedia.save,
        data: dataToSend,
      })

      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.exhibitionMedia.save, dataToSend, response)
        swal.showSuccess('Elemento multimedia creado exitosamente')
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exhibitionMedia.save, payload, error)
      swalToast.showError('Error al crear elemento multimedia')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateMedia = async (id: string | number, payload: any) => {
    isLoading.value = true
    try {
      const dataToSend = payload instanceof FormData ? payload : { ...payload }
      if (dataToSend instanceof FormData) {
        dataToSend.append('id_exhibition', idExhibition.toString())
        dataToSend.append('_method', 'PUT')
      } else {
        dataToSend.id_exhibition = idExhibition
      }

      const response = await store.dispatch('updateData', {
        url: URLS.exhibitionMedia.update,
        id,
        data: dataToSend,
      })

      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.exhibitionMedia.update, dataToSend, response)
        swal.showSuccess('Elemento multimedia actualizado exitosamente')
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exhibitionMedia.update, { id, payload }, error)
      swalToast.showError('Error al actualizar elemento multimedia')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const toggleStatus = async (item: any) => {
    const isActive = Boolean(item?.status ?? item?.active)
    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'}?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} el registro`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    isLoading.value = true
    try {
      const payload = {
        id: item.id,
        status: !isActive ? 1 : 0,
      }
      const response = await store.dispatch('changeStatus', {
        url: URLS.exhibitionMedia.changeStatus,
        ...payload,
      })

      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.exhibitionMedia.changeStatus, payload, response)
        swal.showSuccess(`Registro ${isActive ? 'desactivado' : 'activado'} exitosamente`)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exhibitionMedia.changeStatus, { id: item.id }, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive}`)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteMedia = async (item: any) => {
    const result = await swal.showConfirm(
      '¿Estás seguro de eliminar?',
      'Esta acción eliminará el registro.',
      {
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    isLoading.value = true
    try {
      const payload = {
        id: item.id,
        status: 2,
      }
      const response = await store.dispatch('changeStatus', {
        url: URLS.exhibitionMedia.changeStatus,
        ...payload,
      })

      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.exhibitionMedia.changeStatus, payload, response)
        swal.showSuccess('Registro eliminado exitosamente')
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exhibitionMedia.changeStatus, { id: item.id }, error)
      swalToast.showError(`${ERROR.errorDelete}`)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    idExhibition,
    mediaList,
    isLoading,
    pagination,
    paginationKey,
    getMedia,
    saveMedia,
    updateMedia,
    toggleStatus,
    deleteMedia,
  }
}
