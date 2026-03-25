import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'
import { useRoles } from '@/composables/Models/useRoles'

export interface UserInterface {
  id: number | string
  id_type_rol_user: number | string
  code?: string
  blocked_at?: string | null
  id_pharmacy?: number | string | null
  count_login?: number
  email: string
  failed_attempts?: number
  first_name: string
  last_name: string
  last_login?: string | null
  password?: string
  phone: string
  url_image?: string | File | null
  active?: number | boolean
  timestamp?: string
}

const sharedUser = ref<UserInterface | null>(null)
const sharedLoading = ref(false)
const sharedUsers = ref<UserInterface[]>([])
const sharedPagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const pendingGetUser = new Map<string | number, Promise<any>>()

export function useUsers() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()
  const { roles, getRoles } = useRoles()

  const loading = sharedLoading
  const users = sharedUsers
  const user = sharedUser

  const paginationKey = 'users-list'
  const pagination = sharedPagination

  const currentSearch = ref('')
  const currentExtraParams = ref<any>({})

  /**
   * Obtiene la lista de usuarios paginada y filtrada.
   */
  const getDataUsers = async (page = 1, search = '', extraParams: any = {}) => {
    currentSearch.value = search
    currentExtraParams.value = extraParams
    // Reset stale state immediately on every new fetch to prevent showing
    // data from a previous record when navigating between detail views
    users.value = []
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.user.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
          ...extraParams,
        },
      })

      if (response.code === 200) {
        users.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      swalToast.showError('Recursos no encontrados')
      users.value = []
      pagination.totalPages = 1
      pagination.currentPage = 1
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un usuario específico mediante el método del store getData.
   * Útil para buscar por ID o algún parámetro específico.
   */
  const getUser = async (id: string | number) => {
    // 1. Si ya tenemos el usuario (y coincide el ID), devolverlo directamente
    if (user.value && String(user.value.id) === String(id)) {
      return user.value
    }

    // 2. Si hay una petición en curso para este ID, compartir la misma promesa
    if (pendingGetUser.has(id)) {
      return pendingGetUser.get(id)
    }

    const promise = (async () => {
      loading.value = true
      try {
        const response: any = await store.dispatch('getData', {
          url: URLS.user.prefix + '/' + id,
          params: { active: 1 },
        })

        if (response.code === 200) {
          user.value = response.data
          return response.data
        }
        return null
      } catch (error) {
        console.error('Error in getUser:', error)
        return null
      } finally {
        loading.value = false
        pendingGetUser.delete(id)
      }
    })()

    pendingGetUser.set(id, promise)
    return promise
  }

  /**
   * Guarda o actualiza un usuario.
   * Maneja el envío de datos incluyendo la imagen.
   */
  const saveUser = async (data: UserInterface, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const formData = new FormData()

      // Mapeo de campos requeridos y opcionales
      const roleId =
        data.id_type_rol_user && typeof data.id_type_rol_user === 'object'
          ? (data.id_type_rol_user as any).id
          : data.id_type_rol_user

      formData.append('id_type_rol_user', String(roleId))
      formData.append('email', data.email)
      formData.append('first_name', data.first_name)
      formData.append('last_name', data.last_name)
      formData.append('phone', data.phone)
      if (data.id_pharmacy) {
        formData.append('id_pharmacy', String(data.id_pharmacy))
      }

      if (data.password) formData.append('password', data.password)

      if (data.url_image instanceof File) {
        formData.append('url_image', data.url_image)
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.user.update,
          id: id,
          data: formData,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.user.save,
          data: formData,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
        )
        await getDataUsers(pagination.currentPage, currentSearch.value, currentExtraParams.value)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Activa o desactiva un usuario.
   */
  const deactivateUser = async (item: UserInterface) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} el usuario?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} a ${item.first_name} ${item.last_name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.user.changeStatus,
        id: item.id!,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.user.changeStatus, {}, response)
        swal.showSuccess('Usuario ' + (isActive ? 'desactivado' : 'activado') + ' exitosamente')
        await getDataUsers(pagination.currentPage, currentSearch.value, currentExtraParams.value)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.user.changeStatus, {}, error)
      swalToast.showError(
        `${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.first_name}`,
      )
      return false
    }
  }

  /**
   * Elimina un usuario (status 2).
   */
  const deleteUser = async (item: UserInterface) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar al usuario ${item.first_name} ${item.last_name}?`,
      `Esta acción eliminará permanentemente el registro.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.user.changeStatus,
        id: item.id!,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.user.changeStatus, {}, response)
        swal.showSuccess('Usuario eliminado exitosamente')
        await getDataUsers(pagination.currentPage, currentSearch.value, currentExtraParams.value)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.user.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.first_name}`)
      return false
    }
  }

  return {
    loading,
    users,
    user,
    roles,
    pagination,
    paginationKey,
    getDataUsers,
    getUser,
    getRoles,
    saveUser,
    deactivateUser,
    deleteUser,
  }
}
