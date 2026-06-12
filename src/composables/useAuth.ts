// src/composables/useAuth.ts

import { ref } from 'vue'
import Cookies from 'js-cookie'

// El estado sigue siendo global (singleton)
const userRole = ref<number | null>(null)
const isRoleInitialized = ref(false)

/**
 * Función interna para leer y decodificar la cookie.
 * Ahora está separada para poder ser llamada de nuevo.
 */
function initializeRole() {
  try {
    const hashedRole = Cookies.get('fsi_pharmacy_id_role') || Cookies.get('id_role')

    if (hashedRole) {
      const decodedRoleString = atob(hashedRole)
      const roleId = parseInt(decodedRoleString, 10)
      userRole.value = !isNaN(roleId) ? roleId : null
    } else {
      userRole.value = null // Si no hay cookie, no hay rol
    }
  } catch (error) {
    console.error('Error al decodificar el rol:', error)
    userRole.value = null
  } finally {
    isRoleInitialized.value = true
  }
}

/**
 * Composable para la gestión de autenticación y roles de usuario.
 */
export function useAuth() {
  // Si no se ha inicializado, lo hacemos la primera vez que se usa.
  if (!isRoleInitialized.value) {
    initializeRole()
  }

  /**
   * Verifica si el rol del usuario está en una lista de roles permitidos.
   * @param {number[]} allowedRoles - Un arreglo de IDs de roles permitidos.
   * @returns {boolean} - `true` si el usuario tiene el rol, de lo contrario `false`.
   */
  const hasRole = (allowedRoles: number[]): boolean => {
    if (userRole.value === null) {
      return false
    }
    return allowedRoles.includes(userRole.value)
  }

  /**
   * **NUEVA FUNCIÓN EXPORTADA**
   * Resetea el estado y fuerza la relectura de la cookie.
   * Debe llamarse después de un inicio o cierre de sesión.
   */
  const resetAuthRole = () => {
    isRoleInitialized.value = false // Marcamos para que se pueda reinicializar
    initializeRole() // Volvemos a leer la cookie
  }

  return {
    hasRole,
    userRole,
    resetAuthRole, // La exportamos para poder usarla fuera
  }
}
