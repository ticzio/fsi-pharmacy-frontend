/**
 * Mapa de permisos por rol
 *
 * Cuando el backend devuelva permissions directamente,
 * solo hay que cambiar la fuente de datos en useAccessControl,
 * sin tocar el resto del código.
 *
 * Roles conocidos:
 * 1 = Super Admin
 * 2 = Admin
 * 3 = Supervisor
 * 4 = Editor
 * 5 = Viewer
 * 6 = Marketing (solo Noticias y Notificaciones)
 * 7 = Concessionaire User
 * 8 = Concessionaire Admin
 */

import { PERMISSIONS, PERMISSION_WILDCARD } from './permissions'

export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  SUPERVISOR: 3,
  EDITOR: 4,
  VIEWER: 5,
  MARKETING: 6,
  CONCESSIONAIRE_USER: 7,
  CONCESSIONAIRE_ADMIN: 8,
} as const

export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS]

/**
 * Mapa rol -> permisos
 * '*' = acceso total (wildcard)
 */
export const ROLE_PERMISSIONS: Record<number, string[]> = {
  // Super Admin: acceso total
  [ROLE_IDS.SUPER_ADMIN]: [PERMISSION_WILDCARD],

  // Admin: casi todo excepto configuración crítica
  [ROLE_IDS.ADMIN]: [
    // Dashboard
    PERMISSIONS.dashboard.read,

    // Concesionarios
    PERMISSIONS.concessionaire.read,
    PERMISSIONS.concessionaire.create,
    PERMISSIONS.concessionaire.update,
    PERMISSIONS.concessionaire.deactivate,

    // Empresas
    PERMISSIONS.company.read,
    PERMISSIONS.company.create,
    PERMISSIONS.company.update,
    PERMISSIONS.company.deactivate,

    // Administradores
    PERMISSIONS.administrator.read,
    PERMISSIONS.administrator.create,
    PERMISSIONS.administrator.update,
    PERMISSIONS.administrator.deactivate,

    // Clientes
    PERMISSIONS.client.read,
    PERMISSIONS.client.create,
    PERMISSIONS.client.update,
    PERMISSIONS.client.deactivate,

    // Exhibiciones
    PERMISSIONS.exhibition.read,
    PERMISSIONS.exhibition.create,
    PERMISSIONS.exhibition.update,
    PERMISSIONS.exhibition.deactivate,

    // Noticias
    PERMISSIONS.news.read,
    PERMISSIONS.news.create,
    PERMISSIONS.news.update,
    PERMISSIONS.news.deactivate,

    // Notificaciones
    PERMISSIONS.notification.read,
    PERMISSIONS.notification.create,
    PERMISSIONS.notification.update,

    // Configuración
    PERMISSIONS.settings.read,
  ],

  // Supervisor: lectura + algunas ediciones
  [ROLE_IDS.SUPERVISOR]: [
    PERMISSIONS.dashboard.read,

    PERMISSIONS.concessionaire.read,
    PERMISSIONS.concessionaire.update,

    PERMISSIONS.company.read,
    PERMISSIONS.company.update,

    PERMISSIONS.administrator.read,

    PERMISSIONS.client.read,
    PERMISSIONS.client.update,

    PERMISSIONS.exhibition.read,
    PERMISSIONS.exhibition.update,

    PERMISSIONS.news.read,
    PERMISSIONS.news.update,

    PERMISSIONS.notification.read,

    PERMISSIONS.settings.read,
  ],

  // Editor: lectura + crear/editar contenido
  [ROLE_IDS.EDITOR]: [
    PERMISSIONS.dashboard.read,

    PERMISSIONS.concessionaire.read,

    PERMISSIONS.company.read,

    PERMISSIONS.client.read,

    PERMISSIONS.exhibition.read,
    PERMISSIONS.exhibition.create,
    PERMISSIONS.exhibition.update,

    PERMISSIONS.news.read,
    PERMISSIONS.news.create,
    PERMISSIONS.news.update,

    PERMISSIONS.notification.read,
    PERMISSIONS.notification.create,
  ],

  // Viewer: solo lectura
  [ROLE_IDS.VIEWER]: [
    PERMISSIONS.dashboard.read,
    PERMISSIONS.concessionaire.read,
    PERMISSIONS.company.read,
    PERMISSIONS.client.read,
    PERMISSIONS.exhibition.read,
    PERMISSIONS.news.read,
    PERMISSIONS.notification.read,
  ],

  // Marketing: acceso a Noticias, Notificaciones e Inicio
  [ROLE_IDS.MARKETING]: [
    PERMISSIONS.dashboard.read,

    PERMISSIONS.news.read,
    PERMISSIONS.news.create,
    PERMISSIONS.news.update,
    PERMISSIONS.news.deactivate,

    PERMISSIONS.notification.read,
    PERMISSIONS.notification.create,
    PERMISSIONS.notification.update,
  ],

  // Concessionaire User: gestión de actividades
  [ROLE_IDS.CONCESSIONAIRE_USER]: [
    PERMISSIONS.dashboard.read,
    PERMISSIONS.activity.read,
    PERMISSIONS.activity.manage,
  ],

  // Concessionaire Admin: gestión de actividades
  [ROLE_IDS.CONCESSIONAIRE_ADMIN]: [
    PERMISSIONS.dashboard.read,
    PERMISSIONS.activity.read,
    PERMISSIONS.activity.manage,
  ],
}

/**
 * Obtener permisos de un rol
 */
export const getPermissionsByRole = (roleId: number): string[] => {
  return ROLE_PERMISSIONS[roleId] || []
}

/**
 * Verificar si un rol tiene un permiso específico
 */
export const roleHasPermission = (roleId: number, permission: string): boolean => {
  const permissions = getPermissionsByRole(roleId)

  // Wildcard = acceso total
  if (permissions.includes(PERMISSION_WILDCARD)) {
    return true
  }

  return permissions.includes(permission)
}

/**
 * Verificar si un rol tiene TODOS los permisos especificados
 */
export const roleHasAllPermissions = (roleId: number, requiredPermissions: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.every((perm) => roleHasPermission(roleId, perm))
}

/**
 * Verificar si un rol tiene AL MENOS UNO de los permisos especificados
 */
export const roleHasAnyPermission = (roleId: number, requiredPermissions: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.some((perm) => roleHasPermission(roleId, perm))
}
