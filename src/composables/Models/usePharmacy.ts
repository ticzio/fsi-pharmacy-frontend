import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useSwal } from '@/composables/useSwal'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { TABLE_PAGINATION } from '@/const/tableConst'

export interface PharmacyInterface {
  id: number | string
  name: string
  code: string
  description?: string
  id_type_city?: number | string | null
  ubication?: string
  url_google_map?: string
  lat?: string | number
  lon?: string | number
  url_image?: string | File | null
  url_instagram?: string
  url_whatsapp?: string
  phone?: string
  opening_week?: string
  close_week?: string
  opening_saturday?: string
  close_saturday?: string
  opening_sunday?: string
  close_sunday?: string
  active?: number | boolean
  timestamp?: string
  [key: string]: any
}

// Estado compartido (Singleton) para el módulo de farmacias
const loading = ref(false)
const pharmacies = ref<PharmacyInterface[]>([])
const pharmacy = ref<PharmacyInterface | null>(null)
const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

// Mapa para de-duplicar peticiones en vuelo por ID
const pendingRequests = new Map<string | number, Promise<any>>()

export function usePharmacy() {
  const store = useStore()
  const swalToast = useSwalToast()
  const swal = useSwal()
  const logger = useLogger()

  const paginationKey = 'pharmacy-list'

  /**
   * Obtiene la lista de farmacias paginada y filtrada.
   */
  const getDataPharmacies = async (
    page = 1,
    search = '',
    cityId: number | string | null = null,
  ) => {
    // Reset stale state immediately on every new fetch to prevent showing
    // data from a previous record when navigating between detail views
    pharmacies.value = []
    loading.value = true
    try {
      const response: any = await store.dispatch('getData', {
        url: URLS.pharmacy.getAll,
        params: {
          page: page,
          limit: pagination.limit,
          query: search || null,
          active: null,
          id_type_cities: cityId || null,
        },
      })

      if (response.code === 200) {
        pharmacies.value = response.data
        pagination.totalPages = response.meta?.last_page || response.last_page
        pagination.currentPage = response.meta?.current_page || response.current_page
      } else {
        swalToast.showError('Recursos no encontrados')
      }
    } catch (error: any) {
      console.error('Error fetching pharmacies:', error)
      swalToast.showError('Recursos no encontrados')
      pharmacies.value = []
      pagination.totalPages = 1
      pagination.currentPage = 1
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene una farmacia específica mediante su ID.
   * Implementa de-duplicación para evitar peticiones HTTP concurrentes al mismo ID.
   */
  const getPharmacy = async (id: string | number, forceRefresh = false) => {
    // Si ya hay una petición en vuelo para este ID, devolvemos la misma promesa
    if (pendingRequests.has(id)) {
      return pendingRequests.get(id)
    }

    // Si ya tenemos los datos y no se requiere refresco, los devolvemos directamente
    if (!forceRefresh && pharmacy.value && String(pharmacy.value.id) === String(id)) {
      return pharmacy.value
    }

    const requestPromise = (async () => {
      loading.value = true
      try {
        const response: any = await store.dispatch('getData', {
          url: URLS.pharmacy.prefix + '/' + id,
          params: {},
        })

        if (response.code === 200) {
          pharmacy.value = response.data
          return response.data
        } else {
          swalToast.showError('Recursos no encontrados')
          return null
        }
      } catch (error: any) {
        console.error('Error fetching pharmacy:', error)
        swalToast.showError('Recursos no encontrados')
        return null
      } finally {
        loading.value = false
        // Limpiamos la promesa del mapa una vez finalizada
        pendingRequests.delete(id)
      }
    })()

    // Registramos la promesa en el mapa de peticiones pendientes
    pendingRequests.set(id, requestPromise)
    return requestPromise
  }

  /**
   * Guarda o actualiza una farmacia.
   */
  const savePharmacy = async (
    data: PharmacyInterface,
    isEditing: boolean,
    id?: string | number,
  ) => {
    loading.value = true
    try {
      // Validación de campos obligatorios
      const requiredFields = [
        'name',
        'phone',
        'id_type_city',
        'description',
        'ubication',
        'url_google_map',
      ]

      const missingFields = requiredFields.filter((field) => {
        const value = data[field]
        if (value === undefined || value === null) return true
        if (typeof value === 'string' && value.trim() === '') return true
        return false
      })

      if (missingFields.length > 0 || (!isEditing && !data.url_image)) {
        swalToast.showError('Por favor, completa todos los campos obligatorios.')
        loading.value = false
        return false
      }

      const formData = new FormData()

      // Mapear campos base
      const fields = [
        'name',
        'code',
        'description',
        'ubication',
        'url_google_map',
        'lat',
        'lon',
        'url_instagram',
        'url_whatsapp',
        'phone',
        'opening_week',
        'close_week',
        'opening_saturday',
        'close_saturday',
        'opening_sunday',
        'close_sunday',
      ]

      fields.forEach((key) => {
        const value = data[key]
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value))
        }
      })

      // Set City id
      const cityId =
        data.id_type_city && typeof data.id_type_city === 'object'
          ? (data.id_type_city as any).id
          : data.id_type_city

      if (cityId) {
        formData.append('id_type_cities', String(cityId))
      }

      if (data.url_image instanceof File) {
        formData.append('url_image', data.url_image)
      }

      // Aplicamos la Ley de Doherty: asegurar un tiempo mínimo de carga para feedback visual
      const minDelay = new Promise((resolve) => setTimeout(resolve, 400))

      let response: any
      if (isEditing && id) {
        ;[response] = await Promise.all([
          store.dispatch('updateData', {
            url: URLS.pharmacy.update,
            id: id,
            data: formData,
          }),
          minDelay,
        ])
      } else {
        ;[response] = await Promise.all([
          store.dispatch('createData', {
            url: URLS.pharmacy.save,
            data: formData,
          }),
          minDelay,
        ])
      }

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess(
          isEditing ? 'Farmacia actualizada correctamente' : 'Farmacia creada correctamente',
        )
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving pharmacy:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Activa o desactiva una farmacia.
   */
  const deactivatePharmacy = async (item: PharmacyInterface) => {
    const isActive = Boolean(item?.active)

    const result = await swal.showConfirm(
      `¿Estás seguro de ${isActive ? 'desactivar' : 'activar'} la farmacia?`,
      `Esta acción ${isActive ? 'desactivará' : 'activará'} a ${item.name}.`,
      {
        confirmButtonText: `${isActive ? 'Desactivar' : 'Activar'}`,
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.pharmacy.changeStatus,
        id: item.id!,
        status: !isActive ? 1 : 0,
      })
      if (response.code === 200 || response.code === 201) {
        logger.logRequest(URLS.pharmacy.changeStatus, {}, response)
        swal.showSuccess('Farmacia ' + (isActive ? 'desactivada' : 'activada') + ' exitosamente')
        await getDataPharmacies(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.pharmacy.changeStatus, {}, error)
      swalToast.showError(`${isActive ? ERROR.errorDeactive : ERROR.errorActive} ${item.name}`)
      return false
    }
  }

  /**
   * Elimina una farmacia de forma lógica.
   */
  const deletePharmacy = async (item: PharmacyInterface) => {
    const result = await swal.showConfirm(
      `¿Estás seguro de eliminar la farmacia ${item.name}?`,
      `Esta acción eliminará permanentemente el registro.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!result) return false

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.pharmacy.changeStatus,
        id: item.id!,
        status: 2,
      })
      if (response.code == 200 || response.code == 201) {
        logger.logRequest(URLS.pharmacy.changeStatus, {}, response)
        swal.showSuccess('Farmacia eliminada exitosamente')
        await getDataPharmacies(pagination.currentPage)
        return true
      }
      return false
    } catch (error: any) {
      logger.logRequest(URLS.pharmacy.changeStatus, {}, error)
      swalToast.showError(`${ERROR.errorDelete} ${item.name}`)
      return false
    }
  }

  /**
   * Actualiza únicamente los horarios de una farmacia.
   */
  const savePharmacySchedule = async (data: any, id: string | number) => {
    loading.value = true
    try {
      // Map id_type_city to id_type_cities for backend consistency
      const cityId =
        data.id_type_city && typeof data.id_type_city === 'object'
          ? (data.id_type_city as any).id
          : data.id_type_city

      // Prepare payload as JSON object
      // We include all required fields to ensure backend validation passes
      const payload = {
        name: data.name,
        code: data.code,
        phone: data.phone,
        id_type_cities: cityId,
        description: data.description || '',
        ubication: data.ubication || '',
        url_google_map: data.url_google_map || '',
        opening_week: data.opening_week,
        close_week: data.close_week,
        opening_saturday: data.opening_saturday,
        close_saturday: data.close_saturday,
        opening_sunday: data.opening_sunday,
        close_sunday: data.close_sunday,
        lat: data.lat || '',
        lon: data.lon || '',
        url_instagram: data.url_instagram || '',
        url_whatsapp: data.url_whatsapp || '',
      }

      // Aplicamos la Ley de Doherty: asegurar un tiempo mínimo de carga para feedback visual
      const minDelay = new Promise((resolve) => setTimeout(resolve, 400))

      const [response]: any = await Promise.all([
        store.dispatch('updateData', {
          url: URLS.pharmacy.update,
          id: id,
          data: payload,
        }),
        minDelay,
      ])

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess('Horarios actualizados correctamente')
        await getPharmacy(id, true)
        return true
      } else {
        swalToast.showError('Recursos no encontrados')
        return false
      }
    } catch (error: any) {
      console.error('Error saving pharmacy schedule:', error)
      swalToast.showError('Recursos no encontrados')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    pharmacies,
    pharmacy,
    pagination,
    paginationKey,
    getDataPharmacies,
    getPharmacy,
    savePharmacy,
    savePharmacySchedule,
    deactivatePharmacy,
    deletePharmacy,
  }
}
