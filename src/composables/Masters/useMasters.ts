import { ref } from 'vue'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLogger } from '@/composables/useLogger'
import { useMultiselectIcons } from '@/composables/useMultiselectIcons'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { ICONS_MULTISELECT } from '@/const/multiselectConst'

export function useMasters() {
  const store = useStore()
  const swalToast = useSwalToast()
  const logger = useLogger()
  const { updateIconMaps, clearIconMaps } = useMultiselectIcons()

  // States
  const states = ref<any[]>([])
  const customIconMapState = ref<Record<string, string>>({})
  const customDescriptionMapState = ref<Record<string, string>>({})

  // Cities
  const cities = ref<any[]>([])
  const customIconMapCity = ref<Record<string, string>>({})
  const customDescriptionMapCity = ref<Record<string, string>>({})

  // Roles
  const roles = ref<any[]>([])
  const customIconMapRole = ref<Record<string, string>>({})
  const customDescriptionMapRole = ref<Record<string, string>>({})

  // Loading states
  const isLoadingStates = ref(false)
  const isLoadingCities = ref(false)
  const isLoadingRoles = ref(false)

  /**
   * Obtener todos los estados
   */
  const getStates = async () => {
    isLoadingStates.value = true
    try {
      const response = await store.dispatch('getData', {
        url: URLS.state.getAll,
        params: { order_value: 'asc' },
      })
      if (response.code === 200) {
        logger.logRequest(URLS.state.getAll, {}, response)
        states.value = response.data || []

        clearIconMaps(customIconMapState, customDescriptionMapState)
        updateIconMaps(
          customIconMapState,
          customDescriptionMapState,
          response.data,
          ICONS_MULTISELECT.state,
          {
            dataKey: 'name',
            descriptionPrefix: 'Estado:',
          },
        )
      }
      return states.value
    } catch (error: any) {
      logger.logRequest(URLS.state.getAll, {}, error)
      swalToast.showError(`${ERROR.errorGet} estados`)
      return []
    } finally {
      isLoadingStates.value = false
    }
  }

  /**
   * Obtener ciudades por estado
   * @param idState - ID del estado (opcional, si no se pasa trae todas las ciudades)
   */
  const getCities = async (idState?: number | null) => {
    isLoadingCities.value = true
    try {
      const params = idState ? { id_state: idState, order_value: 'asc' } : {}
      const response = await store.dispatch('getData', {
        url: URLS.city.getAll,
        params,
      })
      if (response.code === 200) {
        logger.logRequest(URLS.city.getAll, params, response)
        cities.value = response.data || []

        clearIconMaps(customIconMapCity, customDescriptionMapCity)
        updateIconMaps(
          customIconMapCity,
          customDescriptionMapCity,
          response.data,
          ICONS_MULTISELECT.city,
          {
            dataKey: 'name',
            descriptionPrefix: 'Ciudad:',
          },
        )
      }
      return cities.value
    } catch (error: any) {
      logger.logRequest(URLS.city.getAll, { id_state: idState }, error)
      swalToast.showError(`${ERROR.errorGet} ciudades`)
      return []
    } finally {
      isLoadingCities.value = false
    }
  }

  /**
   * Obtener roles
   * @param params - Parámetros opcionales (ej: { type_role: 1, id_type_environment: 1 })
   */
  const getRoles = async (params?: Record<string, any>) => {
    isLoadingRoles.value = true
    try {
      const response = await store.dispatch('getData', {
        url: URLS.role.getAll,
        params: params || { id_type_environment: 1 },
      })
      if (response.code === 200) {
        logger.logRequest(URLS.role.getAll, params || {}, response)
        roles.value = response.data || []

        clearIconMaps(customIconMapRole, customDescriptionMapRole)
        updateIconMaps(
          customIconMapRole,
          customDescriptionMapRole,
          response.data,
          ICONS_MULTISELECT.role,
          {
            dataKey: 'name',
            descriptionPrefix: 'Rol:',
          },
        )
      }
      return roles.value
    } catch (error: any) {
      logger.logRequest(URLS.role.getAll, params || {}, error)
      swalToast.showError(`${ERROR.errorGet} roles`)
      return []
    } finally {
      isLoadingRoles.value = false
    }
  }

  /**
   * Limpiar ciudades (útil cuando cambia el estado seleccionado)
   */
  const clearCities = () => {
    cities.value = []
    clearIconMaps(customIconMapCity, customDescriptionMapCity)
  }

  return {
    // States
    states,
    customIconMapState,
    customDescriptionMapState,
    isLoadingStates,
    getStates,

    // Cities
    cities,
    customIconMapCity,
    customDescriptionMapCity,
    isLoadingCities,
    getCities,
    clearCities,

    // Roles
    roles,
    customIconMapRole,
    customDescriptionMapRole,
    isLoadingRoles,
    getRoles,
  }
}
