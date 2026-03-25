import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export function useNewsModel() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const loading = ref(false)
  const news = ref<any[]>([])

  const paginationKey = 'news-list'
  const pagination = reactive({
    currentPage: TABLE_PAGINATION.currentPage,
    totalPages: TABLE_PAGINATION.totalPages,
    limit: TABLE_PAGINATION.limit,
  })

  const getDataNews = async (page = 1, search = '') => {
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.news.getAll,
        params: {
          active: null,
          page: page,
          limit: pagination.limit,
          query: search || null,
        },
      })

      if (response.code === 200) {
        news.value = response.data
        pagination.totalPages = response.meta.last_page
        pagination.currentPage = response.meta.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching news:', error)
      swalToast.showError('Recursos no encontrados')
    } finally {
      loading.value = false
    }
  }

  const saveNews = async (data: any, isEditing: boolean, id?: string | number) => {
    loading.value = true
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', data.title)
      formDataToSend.append('body', data.content)

      if (data.imageFile) {
        formDataToSend.append('url_image', data.imageFile)
      }

      let response: any
      if (isEditing && id) {
        response = await store.dispatch('updateData', {
          url: URLS.news.update,
          id: id,
          data: formDataToSend,
        })
      } else {
        response = await store.dispatch('createData', {
          url: URLS.news.save,
          data: formDataToSend,
        })
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Noticia actualizada correctamente' : 'Noticia creada correctamente',
        )
        await getDataNews(pagination.currentPage)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving news:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  const deactivateNews = async (item: any) => {
    const isActive = Boolean(item?.status ?? item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro ${isActive ? 'desactivar' : 'activar'}  noticia?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} ${item.title}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.news.changeStatus,
        id: item.id,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.news.changeStatus, {}, response)
        swal.showSuccess('Noticia ' + (isActive ? 'desactivada' : 'activada') + ' exitosamente')
        await getDataNews(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.news.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.title}`)
      return false
    }
  }

  const deleteNews = async (item: any) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar la noticia ${item.title}?`,
      `Esta acción eliminará la noticia ${item.title}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.news.changeStatus,
        id: item.id,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.news.changeStatus, {}, response)
        swal.showSuccess('Noticia eliminada exitosamente')
        await getDataNews(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.news.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.title}`)
      return false
    }
  }

  return {
    loading,
    news,
    pagination,
    paginationKey,
    getDataNews,
    saveNews,
    deactivateNews,
    deleteNews,
  }
}
