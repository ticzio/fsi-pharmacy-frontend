import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useHandleError } from '@/composables/useHandleError'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useRoles() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const { handleErrorResponse } = useHandleError()
  const logger = useLogger()

  const loading = ref(false)
  const roles = ref<any[]>([])

  const paginationKey = 'roles-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataRoles = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.role.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
        },
      })

      if (response.code === 200) {
        roles.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        handleErrorResponse(null, 'Recursos no encontrados')
      }
    } catch (error: any) {
      handleErrorResponse(error, 'Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const getRoles = async () => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.role.getAll,
        params: {
          limit: 100,
        },
      })

      if (response.code === 200) {
        roles.value = response.data
      } else {
        handleErrorResponse(null, 'Recursos no encontrados')
      }
    } catch (error: any) {
      handleErrorResponse(error, 'Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveRole = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.role.update,
          id: id,
          data: data,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.role.save,
          data: data,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Rol actualizado correctamente' : 'Rol creado correctamente',
        )
        await getDataRoles(pagination.currentPage)
        return true
      } else {
        handleErrorResponse(null, 'Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      handleErrorResponse(error, 'Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateRole = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} el rol?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.role.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.role.changeStatus, {}, response)
        swal.showSuccess('Rol ' + (isActive ? 'desactivado' : 'activado') + ' exitosamente')
        await getDataRoles(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.role.changeStatus, {}, error)
      handleErrorResponse(error, `${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  const deleteRole = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar el rol ${item.name}?`,
      `Esta acción eliminará el rol ${item.name}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.role.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.role.changeStatus, {}, response)
        swal.showSuccess('Rol eliminado exitosamente')
        await getDataRoles(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.role.changeStatus, {}, error)
      handleErrorResponse(error, `${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  return {
    loading,
    roles,
    pagination,
    paginationKey,
    getDataRoles,
    getRoles,
    saveRole,
    deactivateRole,
    deleteRole,
  }
}
