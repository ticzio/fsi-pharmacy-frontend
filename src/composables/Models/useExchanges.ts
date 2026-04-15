import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export interface ExchangeInterface {
  id: number | string
  id_coupon_client: number | string
  id_pharmacy: number | string
  exchanged_at: string
  id_user: number | string
  active?: number | boolean
  timestamp?: string
}

export function useExchanges() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const exchanges = ref<ExchangeInterface[]>([])
  const exchange = ref<ExchangeInterface | null>(null)

  const paginationKey = 'exchanges-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const currentSearch = ref('')

  /**
   * Obtiene la lista de canjes (exchanges) paginada y filtrada.
   */
  const getExchanges = async (page = 1, search = '', idPharmacy: string | number | null = null) => {
    currentSearch.value = search
    exchanges.value = []
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.exchange.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          id_pharmacy: idPharmacy || null,
          active: null,
        },
      })

      if (response.code === 200) {
        exchanges.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
        exchanges.value = []
        pagination.totalPages = 1
      }
    } catch (error: any) {
      console.error('Error fetching exchanges:', error)
      swalToast.showError('Recursos no encontrados')
      exchanges.value = []
      pagination.totalPages = 1
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene la lista de canjes (exchanges) por ID de cliente.
   */
  const getExchangesByClientId = async (idClient: string | number, page = 1, search = '') => {
    currentSearch.value = search
    exchanges.value = []
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: `${URLS.exchange.prefix}/client/${idClient}`,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
        },
      })

      if (response.code === 200) {
        exchanges.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
        exchanges.value = []
        pagination.totalPages = 1
      }
    } catch (error: any) {
      console.error('Error fetching exchanges by client id:', error)
      swalToast.showError('Recursos no encontrados')
      exchanges.value = []
      pagination.totalPages = 1
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un registro específico por ID.
   */
  const getExchangeById = async (id: string | number) => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.exchange.prefix + '/' + id,
        params: {},
      })

      if (response.code === 200) {
        exchange.value = response.data
        return response.data
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching exchange:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  /**
   * Guarda o actualiza un registro.
   */
  const saveExchange = async (code: string, ci: string) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('code', code)
      formData.append('ci', ci)

      const response: any = await store.dispatch('createData', {
        url: URLS.exchange.save,
        data: formData,
      })

      if (response.code === 200 || response.code === 201) {
        swal.showSuccess('Cupón canjeado correctamente')
        await getExchanges(pagination.currentPage, currentSearch.value)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving exchange:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Activa o desactiva un registro.
   */
  const deactivateExchange = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} el registro?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} el canje ID: ${item.id}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.exchange.changeStatus,
        id: item.id!,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.exchange.changeStatus, {}, response)
        swalToast.showSuccess(
          'Registro ' + (isActive ? 'desactivado' : 'activado') + ' exitosamente',
        )
        await getExchanges(pagination.currentPage, currentSearch.value)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exchange.changeStatus, {}, error)
      swalToast.showError(
        `${isActive ? ERROR.errorDeactive : ERROR.errorActive} canje ID: ${item.id}`,
      )
      return false
    }
  }

  /**
   * Elimina un registro (status 2).
   */
  const deleteExchange = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar el registro ID: ${item.id}?`,
      `Esta acción eliminará permanentemente el registro.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.exchange.changeStatus,
        id: item.id!,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.exchange.changeStatus, {}, response)
        swalToast.showSuccess('Registro eliminado exitosamente')
        await getExchanges(pagination.currentPage, currentSearch.value)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.exchange.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} canje ID: ${item.id}`)
      return false
    }
  }

  /**
   * Consulta la información del cupón de un cliente.
   */
  const checkCoupon = async (code: string, ci: string) => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: 'coupon_client/check',
        params: {
          code,
          ci,
        },
      })

      if (response.code === 200 && response.data) {
        return response.data
      } else {
        swalToast.showError(response.message || 'Cupón no encontrado o datos incorrectos')
        return null
      }
    } catch (error: any) {
      console.error('Error checking coupon:', error)
      swalToast.showError(error.message || 'Error al validar el cupón')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    exchanges,
    exchange,
    pagination,
    paginationKey,
    getExchanges,
    getExchangesByClientId,
    getExchangeById,
    saveExchange,
    deactivateExchange,
    deleteExchange,
    checkCoupon,
  }
}
