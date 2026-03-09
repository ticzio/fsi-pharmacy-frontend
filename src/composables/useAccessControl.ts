/**
 * Composable para control de acceso basado en permisos
 *
 * Centraliza toda la lógica de verificación de permisos:
 * - Decodifica el rol desde la cookie (Base64)
 * - Resuelve permisos desde ROLE_PERMISSIONS
 * - Expone funciones can(), canAny(), canAll()
 *
 * Uso:
 *   const { can, canAny, canAll, roleId } = useAccessControl()
 *   if (can('company.create')) { ... }
 */

import { computed } from 'vue'
import Cookies from 'js-cookie'
import {
  roleHasPermission,
  roleHasAllPermissions,
  roleHasAnyPermission,
  getPermissionsByRole,
  ROLE_IDS,
} from '@/const/rolePermissions'
import { PERMISSION_WILDCARD } from '@/const/permissions'

/**
 * Decodifica el id_role desde la cookie (Base64)
 */
export const getRoleIdFromCookie = (): number | null => {
  try {
    // Intentamos leer con la nueva key prefijada usando js-cookie directo (para evitar dependencia circular si useCookies usa algo complejo, aunque useCookies es seguro)
    // Sin embargo, para consistencia, usaremos el nombre correcto.
    const raw = Cookies.get('changan_admin_id_role')
    if (!raw) return null

    // Decodificar Base64
    const decoded = atob(raw)
    const roleId = Number(decoded)

    return Number.isFinite(roleId) ? roleId : null
  } catch {
    console.warn('useAccessControl: Error decodificando id_role de cookie')
    return null
  }
}

/**
 * Decodifica un valor hasheado (Base64) a número
 * Alias para compatibilidad con código legacy
 */
export const decodeRole = async (hashedValue: string | number): Promise<number> => {
  if (typeof hashedValue === 'number') return hashedValue

  try {
    if (/^\d+$/.test(hashedValue)) return parseInt(hashedValue, 10)

    const decoded = atob(hashedValue)
    if (/^\d+$/.test(decoded)) return parseInt(decoded, 10)

    return 0
  } catch {
    return 0
  }
}

export function useAccessControl() {
  /**
   * ID del rol actual (decodificado de cookie)
   */
  const roleId = computed<number | null>(() => getRoleIdFromCookie())

  /**
   * Permisos del rol actual
   */
  const permissions = computed<string[]>(() => {
    const id = roleId.value
    if (id === null) return []
    return getPermissionsByRole(id)
  })

  /**
   * ¿Es super admin? (tiene wildcard)
   */
  const isSuperAdmin = computed<boolean>(() => {
    return permissions.value.includes(PERMISSION_WILDCARD)
  })

  /**
   * ¿Está autenticado? (tiene rol válido)
   */
  const isAuthenticated = computed<boolean>(() => {
    return roleId.value !== null && roleId.value > 0
  })

  /**
   * Verificar si tiene UN permiso específico
   * @param permission - Permiso a verificar (ej: 'company.create')
   */
  const can = (permission: string): boolean => {
    const id = roleId.value
    if (id === null) return false
    return roleHasPermission(id, permission)
  }

  /**
   * Verificar si tiene TODOS los permisos especificados
   * @param requiredPermissions - Array de permisos requeridos
   */
  const canAll = (requiredPermissions: string[]): boolean => {
    const id = roleId.value
    if (id === null) return false
    return roleHasAllPermissions(id, requiredPermissions)
  }

  /**
   * Verificar si tiene AL MENOS UNO de los permisos
   * @param requiredPermissions - Array de permisos
   */
  const canAny = (requiredPermissions: string[]): boolean => {
    const id = roleId.value
    if (id === null) return false
    return roleHasAnyPermission(id, requiredPermissions)
  }

  /**
   * Verificar si el rol actual es uno de los especificados
   * @param allowedRoles - Array de IDs de rol permitidos
   */
  const hasRole = (allowedRoles: number[]): boolean => {
    const id = roleId.value
    if (id === null) return false
    return allowedRoles.includes(id)
  }

  /**
   * Verificar si es un rol específico
   * @param targetRoleId - ID del rol a verificar
   */
  const isRole = (targetRoleId: number): boolean => {
    return roleId.value === targetRoleId
  }

  return {
    // Estado reactivo
    roleId,
    permissions,
    isSuperAdmin,
    isAuthenticated,

    // Funciones de verificación
    can,
    canAll,
    canAny,
    hasRole,
    isRole,

    // Constantes útiles
    ROLE_IDS,
  }
}

// Exportar también la función de obtener rol para uso directo
export { ROLE_IDS }
