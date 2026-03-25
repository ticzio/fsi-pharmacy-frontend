import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useTemplateMessage() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const templates = ref<any[]>([])

  const paginationKey = 'templates-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataTemplates = async (page = 1, search = '', idPharmacy?: string | number) => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.template_message.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
          id_pharmacies: idPharmacy || null, // Se envía el id_pharmacy para filtrar por farmacia si es necesario
        },
      })

      if (response.code === 200) {
        templates.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching templates:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveTemplate = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.template_message.update,
          id: id,
          data: data,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.template_message.save,
          data: data,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Plantilla actualizada correctamente' : 'Plantilla creada correctamente',
        )
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving template:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateTemplate = async (item: any) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'} la plantilla?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.name || item.title}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.template_message.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.template_message.changeStatus, {}, response)
        swal.showSuccess('Plantilla ' + (isActive ? 'desactivada' : 'activada') + ' exitosamente')
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.template_message.changeStatus, {}, error)
      swalToast.showError(
        `${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name || item.title}`,
      )
      return false
    }
  }

  const deleteTemplate = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar la plantilla ${item.name || item.title}?`,
      `Esta acción eliminará permanentemente el registro.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.template_message.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.template_message.changeStatus, {}, response)
        swal.showSuccess('Plantilla eliminada exitosamente')
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.template_message.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name || item.title}`)
      return false
    }
  }

  return {
    loading,
    templates,
    pagination,
    paginationKey,
    getDataTemplates,
    saveTemplate,
    deactivateTemplate,
    deleteTemplate,
  }
}
