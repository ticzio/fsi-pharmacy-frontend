import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useNotification() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const notifications = ref<any[]>([])

  const paginationKey = 'notifications-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataNotifications = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.notification.getAll,
        params: {
          active: null,
          page: page,
          limit: pagination.limit,
          query: search || null,
        },
      })

      if (response.code === 200) {
        notifications.value = response.data
        pagination.totalPages = response.meta?.last_page || 1
        pagination.currentPage = response.meta?.current_page || 1
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const getNotificationById = async (id: string | number) => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: `${URLS.notification.prefix}/${id}`
      })
      if (response.code === 200) {
        return response.data
      } else {
        swalToast.showError('Recursos no encontrados')
        return null
      }
    } catch (error: any) {
      console.error('Error fetching notification by id:', error)
      swalToast.showError('Recursos no encontrados')
      return null
    } finally {
      loading.value = false
    }
  }

  const saveNotification = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.notification.update,
          id: id,
          data: data,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.notification.save,
          data: data,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Notificación actualizada correctamente' : 'Notificación creada correctamente'
        )
        await getDataNotifications(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving notification:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const changeStatusNotification = async (item: any) => {
    const isActive = Boolean(item?.status ?? item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro de ${isActive ? 'desactivar' : 'activar'} la notificación?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} "${item.title}".`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      }
    )

    if (!result) return false

    loading.value = true
    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.notification.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.notification.changeStatus, {}, response)
        swal.showSuccess(`Notificación ${isActive ? 'desactivada' : 'activada'} exitosamente`)
        await getDataNotifications(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.notification.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.title}`)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    notifications,
    pagination,
    paginationKey,
    getDataNotifications,
    getNotificationById,
    saveNotification,
    changeStatusNotification,
  }
}
