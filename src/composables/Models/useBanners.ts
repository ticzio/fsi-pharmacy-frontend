import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useBanners() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const banners = ref<any[]>([])
  const appUbication = ref<any[]>([])

  const paginationKey = 'banners-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataBanners = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.banner.getAll,
        params: {
          active: null,
          page: page,
          limit: pagination.limit,
          query: search || null,
        },
      })

      if (response.code === 200) {
        banners.value = response.data.data
        pagination.totalPages = response.data.meta.last_page
        pagination.currentPage = response.data.meta.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching banners:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveBanner = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', data.name)
      formDataToSend.append('url_link', data.url_link)
      formDataToSend.append('active', data.active ? '1' : '0')

      // Manejo de id_type_app_ubications (ahora como plural y array)
      if (data.id_type_app_ubications) {
        const ubicationId = data.id_type_app_ubications.id || data.id_type_app_ubications
        formDataToSend.append('id_type_app_ubications[]', ubicationId)
      }

      if (data.imageFile) {
        formDataToSend.append('url_image', data.imageFile)
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.banner.update,
          id: id,
          data: formDataToSend,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.banner.save,
          data: formDataToSend,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Banner actualizado correctamente' : 'Banner creado correctamente',
        )
        await getDataBanners(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving banner:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const getAppUbication = async () => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.appUbication.getAll,
        params: {
          limit: 100, // Asegurar que traemos todos los items para el multiselect
        },
      })

      if (response.code === 200) {
        appUbication.value = response.data
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching app_ubication:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const deactivateBanner = async (item: any) => {
    const isActive = Boolean(item?.status ?? item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} el banner?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.banner.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.banner.changeStatus, {}, response)
        swal.showSuccess('Banner ' + (isActive ? 'desactivado' : 'activado') + ' exitosamente')
        await getDataBanners(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.banner.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  const deleteBanner = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar el banner ${item.name}?`,
      `Esta acción eliminará el banner ${item.name}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.banner.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.banner.changeStatus, {}, response)
        swal.showSuccess('Banner eliminado exitosamente')
        await getDataBanners(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.banner.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  return {
    loading,
    banners,
    pagination,
    paginationKey,
    getDataBanners,
    saveBanner,
    deactivateBanner,
    deleteBanner,
    appUbication,
    getAppUbication,
  }
}
