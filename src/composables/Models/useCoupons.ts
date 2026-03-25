import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useCoupons() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const coupons = ref<any[]>([])

  const paginationKey = 'coupons-banners-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataCoupons = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.coupon.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          active: null,
          query: search || null,
        },
      })

      if (response.code === 200) {
        coupons.value = response.data
        pagination.totalPages = response.meta.last_page
        pagination.currentPage = response.meta.current_page
      } else if (response.code === 404) {
        swalToast.showError('No se encontraron registros de cupones')
      } else {
        swalToast.showError('Error al obtener los registros de cupones')
      }
    } catch (error: any) {
      console.error('Error fetching coupons:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveCoupon = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', data.name)
      formDataToSend.append('description', data.description)
      formDataToSend.append('id_level', data.id_level)
      formDataToSend.append('start_date', data.start_date)
      formDataToSend.append('finish_date', data.finish_date)
      formDataToSend.append('active', data.active ? '1' : '0')

      if (data.imageFile) {
        formDataToSend.append('url_img', data.imageFile)
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.coupon.update,
          id: id,
          data: formDataToSend,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.coupon.save,
          data: formDataToSend,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Cupón actualizado correctamente' : 'Cupón creado correctamente',
        )
        await getDataCoupons(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving coupon:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateCoupon = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} cupón?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.coupon.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.coupon.changeStatus, {}, response)
        swalToast.showSuccess('Cupón ' + (isActive ? 'desactivado' : 'activado') + ' exitosamente')
        await getDataCoupons(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.coupon.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  const deleteCoupon = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar el cupón ${item.name}?`,
      `Esta acción eliminará el cupón ${item.name}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.coupon.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.coupon.changeStatus, {}, response)
        swalToast.showSuccess('Cupón eliminado exitosamente')
        await getDataCoupons(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.coupon.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  return {
    loading,
    coupons,
    pagination,
    paginationKey,
    getDataCoupons,
    saveCoupon,
    deactivateCoupon,
    deleteCoupon,
  }
}
