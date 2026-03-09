import { ref, type Ref } from 'vue'

export interface IconMapConfig {
  iconMap: Ref<Record<string, string>>
  descriptionMap: Ref<Record<string, string>>
}

export interface MultiselectIconOptions {
  dataKey?: string // 'name', 'nombre', 'title', etc.
  descriptionPrefix?: string // 'Estado:', 'Ciudad:', 'Rol:', etc.
  defaultIcon?: string // icono por defecto si no se especifica
}

export const useMultiselectIcons = () => {
  // Función genérica para crear mapas de iconos
  const createIconMaps = (
    data: any[],
    icon: string,
    options: MultiselectIconOptions = {}
  ): IconMapConfig => {
    const { dataKey = 'name', descriptionPrefix = '', defaultIcon = icon } = options

    const iconMap: Record<string, string> = {}
    const descriptionMap: Record<string, string> = {}

    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        const itemName =
          item[dataKey] || item.name || item.nombre || item.title || `Item ${item.id}`
        iconMap[itemName] = icon
        descriptionMap[itemName] = descriptionPrefix ? `${descriptionPrefix} ${itemName}` : itemName
      })
    }

    return {
      iconMap: ref(iconMap),
      descriptionMap: ref(descriptionMap),
    }
  }

  // Función para actualizar mapas existentes (reactividad)
  const updateIconMaps = (
    existingIconMap: Ref<Record<string, string>>,
    existingDescriptionMap: Ref<Record<string, string>>,
    data: any[],
    icon: string,
    options: MultiselectIconOptions = {}
  ) => {
    const { dataKey = 'name', descriptionPrefix = '', defaultIcon = icon } = options

    const newIconMap: Record<string, string> = {}
    const newDescriptionMap: Record<string, string> = {}

    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        const itemName =
          item[dataKey] || item.name || item.nombre || item.title || `Item ${item.id}`
        newIconMap[itemName] = icon
        newDescriptionMap[itemName] = descriptionPrefix
          ? `${descriptionPrefix} ${itemName}`
          : itemName
      })
    }

    // Actualizar reactivamente
    Object.assign(existingIconMap.value, newIconMap)
    Object.assign(existingDescriptionMap.value, newDescriptionMap)
  }

  // Función para limpiar mapas
  const clearIconMaps = (
    iconMap: Ref<Record<string, string>>,
    descriptionMap: Ref<Record<string, string>>
  ) => {
    Object.assign(iconMap.value, {})
    Object.assign(descriptionMap.value, {})
  }

  // Función para crear mapas preconfigurados para tipos comunes
  const createLocationMaps = (states: any[], cities: any[] = []) => {
    const stateIconMap = ref<Record<string, string>>({})
    const stateDescriptionMap = ref<Record<string, string>>({})
    const cityIconMap = ref<Record<string, string>>({})
    const cityDescriptionMap = ref<Record<string, string>>({})

    // Procesar estados
    updateIconMaps(stateIconMap, stateDescriptionMap, states, 'bi bi-map', {
      dataKey: 'name',
      descriptionPrefix: 'Estado:',
    })

    // Procesar ciudades
    updateIconMaps(cityIconMap, cityDescriptionMap, cities, 'bi bi-building', {
      dataKey: 'name',
      descriptionPrefix: 'Ciudad:',
    })

    return {
      stateIconMap,
      stateDescriptionMap,
      cityIconMap,
      cityDescriptionMap,
    }
  }

  // Función para crear mapas personalizados con diferentes iconos
  const createCustomMaps = (
    data: any[],
    iconMap: Record<string, string>,
    options: MultiselectIconOptions = {}
  ) => {
    const resultIconMap = ref<Record<string, string>>({})
    const resultDescriptionMap = ref<Record<string, string>>({})

    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        const itemName = item.name || item.nombre || item.title || `Item ${item.id}`
        const icon = iconMap[itemName] || options.defaultIcon || 'bi bi-circle'
        const descriptionPrefix = options.descriptionPrefix || ''

        resultIconMap.value[itemName] = icon
        resultDescriptionMap.value[itemName] = descriptionPrefix
          ? `${descriptionPrefix} ${itemName}`
          : itemName
      })
    }

    return {
      iconMap: resultIconMap,
      descriptionMap: resultDescriptionMap,
    }
  }

  // Función para crear mapas de estatus con iconos específicos
  const createStatusMaps = (
    statuses: any[],
    customIcons?: Record<string, string>
  ): IconMapConfig => {
    const iconMap: Record<string, string> = {}
    const descriptionMap: Record<string, string> = {}

    // Iconos por defecto para estatus comunes
    const defaultStatusIcons = {
      Activos: 'bi bi-check-circle-fill text-success',
      Inactivos: 'bi bi-x-circle-fill text-danger',
      Activo: 'bi bi-check-circle-fill text-success',
      Inactivo: 'bi bi-x-circle-fill text-danger',
      Active: 'bi bi-check-circle-fill text-success',
      Inactive: 'bi bi-x-circle-fill text-danger',
      enabled: 'bi bi-check-circle-fill text-success',
      disabled: 'bi bi-x-circle-fill text-danger',
    }

    if (statuses && Array.isArray(statuses)) {
      statuses.forEach((status: any) => {
        const statusName = status.name || status.nombre || status.title || `Status ${status.id}`

        // Usar icono personalizado si se proporciona, sino usar el por defecto
        iconMap[statusName] =
          customIcons?.[statusName] ||
          (defaultStatusIcons as Record<string, string>)[statusName] ||
          'bi bi-circle-fill'

        descriptionMap[statusName] = `Estado: ${statusName}`
      })
    }

    return {
      iconMap: ref(iconMap),
      descriptionMap: ref(descriptionMap),
    }
  }

  return {
    createIconMaps,
    updateIconMaps,
    clearIconMaps,
    createLocationMaps,
    createCustomMaps,
    createStatusMaps,
  }
}
