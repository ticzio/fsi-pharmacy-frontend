import { TABLE_ACTIONS } from '@/const/tableConst'
import { useAccessControl } from '@/composables/useAccessControl'
import { PERMISSIONS } from '@/const/permissions'

// Interface que coincide con CustomTable
export interface Action {
  name: string
  icon: string
  class: string
  tooltip?: string
}

/**
 * Configuración de permisos por acción
 * Ahora usa strings de permisos en vez de arrays de roles
 */
export interface ActionPermissionConfig {
  [actionName: string]: {
    permission?: string // Permiso requerido (ej: 'company.update')
    permissions?: string[] // Múltiples permisos (requiere todos)
    anyPermission?: string[] // Requiere al menos uno
    allowAll?: boolean // Permitir sin verificar
  }
}

export const useTableActions = () => {
  const { can, canAll, canAny, isAuthenticated } = useAccessControl()

  /**
   * Configuración de permisos por defecto para acciones de tabla
   * Mapea nombre de acción -> permiso requerido
   */
  const defaultActionPermissions: ActionPermissionConfig = {
    edit: {
      // Por defecto, edit requiere el permiso .update del módulo
      // Se sobreescribe con getModuleActions()
      allowAll: true,
    },
    deactivate: {
      allowAll: true,
    },
    delete: {
      allowAll: true,
    },
    view: {
      allowAll: true,
    },
  }

  /**
   * Verificar si una acción está permitida según su configuración
   */
  const isActionAllowed = (config: ActionPermissionConfig[string]): boolean => {
    if (!config) return true
    if (config.allowAll) return true

    // Permiso único
    if (config.permission) {
      return can(config.permission)
    }

    // Múltiples permisos (requiere todos)
    if (config.permissions && config.permissions.length > 0) {
      return canAll(config.permissions)
    }

    // Al menos uno de los permisos
    if (config.anyPermission && config.anyPermission.length > 0) {
      return canAny(config.anyPermission)
    }

    return true
  }

  /**
   * Filtrar acciones según permisos
   */
  const filterActionsByPermissions = (
    actions: Action[],
    permissionConfig: ActionPermissionConfig
  ): Action[] => {
    if (!isAuthenticated.value) return []

    return actions.filter((action) => {
      const config = permissionConfig[action.name]
      return isActionAllowed(config)
    })
  }

  /**
   * Obtener acciones con verificación de permisos
   * @param item - Item de la tabla (para determinar estado activo/inactivo)
   * @param customActions - Acciones personalizadas (opcional)
   * @param permissionConfig - Configuración de permisos por acción
   */
  const getActionsWithPermissions = (
    item: any,
    customActions?: Action[],
    permissionConfig?: ActionPermissionConfig
  ): Action[] => {
    const actions = customActions || getDefaultActions(item)
    const config = { ...defaultActionPermissions, ...permissionConfig }

    return filterActionsByPermissions(actions, config)
  }

  /**
   * Acciones por defecto para tablas
   */
  const getDefaultActions = (item: any): Action[] => [
    TABLE_ACTIONS.edit,
    {
      name: TABLE_ACTIONS.deactivate.name,
      icon: !item.active ? 'bi bi-x-circle-fill fs-5' : 'bi bi-check-circle-fill fs-5',
      class: !item.active
        ? `${TABLE_ACTIONS.deactivate.class} btn btn-warning`
        : `${TABLE_ACTIONS.deactivate.class} btn btn-success`,
      tooltip: !item.active ? 'activar' : 'desactivar',
    },
    TABLE_ACTIONS.delete,
  ]

  /**
   * Acciones seguras en caso de error (solo view)
   */
  const getDefaultSafeActions = (): Action[] => [TABLE_ACTIONS.edit]

  // ============================================
  // FUNCIONES POR MÓDULO (usan permisos atómicos)
  // ============================================

  /**
   * Acciones para módulo Concesionarios
   */
  const getConcessionaireActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.concessionaire.update },
      deactivate: { permission: PERMISSIONS.concessionaire.deactivate },
      delete: { permission: PERMISSIONS.concessionaire.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Empresas
   */
  const getCompanyActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.company.update },
      deactivate: { permission: PERMISSIONS.company.deactivate },
      delete: { permission: PERMISSIONS.company.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Administradores
   */
  const getAdminActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.administrator.update },
      deactivate: { permission: PERMISSIONS.administrator.deactivate },
      delete: { permission: PERMISSIONS.administrator.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Clientes
   */
  const getClientActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.client.update },
      deactivate: { permission: PERMISSIONS.client.deactivate },
      delete: { permission: PERMISSIONS.client.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Exhibiciones
   */
  const getExhibitionActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.exhibition.update },
      deactivate: { permission: PERMISSIONS.exhibition.deactivate },
      delete: { permission: PERMISSIONS.exhibition.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Noticias
   */
  const getNewsActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.news.update },
      deactivate: { permission: PERMISSIONS.news.deactivate },
      delete: { permission: PERMISSIONS.news.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Acciones para módulo Notificaciones
   */
  const getNotificationActions = (item: any): Action[] => {
    const config: ActionPermissionConfig = {
      edit: { permission: PERMISSIONS.notification.update },
      delete: { permission: PERMISSIONS.notification.delete },
    }
    return getActionsWithPermissions(item, undefined, config)
  }

  /**
   * Crear función de acciones personalizada para un módulo
   * @param modulePermissions - Objeto con permisos del módulo (ej: PERMISSIONS.company)
   */
  const createModuleActions = (modulePermissions: {
    update?: string
    deactivate?: string
    delete?: string
  }) => {
    return (item: any): Action[] => {
      const config: ActionPermissionConfig = {
        edit: modulePermissions.update
          ? { permission: modulePermissions.update }
          : { allowAll: true },
        deactivate: modulePermissions.deactivate
          ? { permission: modulePermissions.deactivate }
          : { allowAll: true },
        delete: modulePermissions.delete
          ? { permission: modulePermissions.delete }
          : { allowAll: true },
      }
      return getActionsWithPermissions(item, undefined, config)
    }
  }

  return {
    // Función principal
    getActionsWithPermissions,

    // Funciones específicas por módulo
    getConcessionaireActions,
    getCompanyActions,
    getAdminActions,
    getClientActions,
    getExhibitionActions,
    getNewsActions,
    getNotificationActions,

    // Utilidades
    getDefaultActions,
    getDefaultSafeActions,
    createModuleActions,
    filterActionsByPermissions,
    isActionAllowed,

    // Permisos (para referencia)
    PERMISSIONS,
  }
}
