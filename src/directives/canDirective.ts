/**
 * Directiva v-can para control de acceso en templates
 *
 * Uso:
 *   <button v-can="'company.create'">Crear</button>
 *   <button v-can="['company.update', 'company.delete']">Editar/Eliminar</button>
 *   <button v-can:any="['company.update', 'company.delete']">Al menos uno</button>
 *   <button v-can:all="['company.update', 'company.delete']">Todos</button>
 *
 * Modificadores:
 *   v-can.disable  -> deshabilita en vez de ocultar
 *   v-can.hide     -> oculta (default)
 */

import type { Directive, DirectiveBinding } from 'vue'
import { getRoleIdFromCookie } from '@/composables/useAccessControl'
import {
  roleHasPermission,
  roleHasAllPermissions,
  roleHasAnyPermission,
} from '@/const/rolePermissions'

type CanElement = HTMLElement & {
  _canOriginalDisplay?: string
  _canOriginalDisabled?: boolean
  disabled?: boolean
}

type CanValue = string | string[]

const checkPermission = (binding: DirectiveBinding<CanValue>): boolean => {
  const roleId = getRoleIdFromCookie()
  if (roleId === null) return false

  const value = binding.value
  const arg = binding.arg // 'any' | 'all' | undefined

  // Si es un string, verificar ese permiso
  if (typeof value === 'string') {
    return roleHasPermission(roleId, value)
  }

  // Si es un array
  if (Array.isArray(value)) {
    if (arg === 'any') {
      return roleHasAnyPermission(roleId, value)
    }
    // Por defecto (o 'all'), requiere todos
    return roleHasAllPermissions(roleId, value)
  }

  // Sin valor = permitir
  return true
}

const applyPermission = (el: CanElement, binding: DirectiveBinding<CanValue>) => {
  const hasPermission = checkPermission(binding)
  const useDisable = binding.modifiers.disable

  // Guardar estado original
  if (el._canOriginalDisplay === undefined) {
    el._canOriginalDisplay = el.style.display || ''
  }
  if (el._canOriginalDisabled === undefined) {
    el._canOriginalDisabled = (el as HTMLButtonElement).disabled || false
  }

  if (hasPermission) {
    // Restaurar estado original
    el.style.display = el._canOriginalDisplay || ''
    if (el._canOriginalDisabled !== undefined) {
      ;(el as any).disabled = el._canOriginalDisabled
    }
    el.classList.remove('permission-denied')
    el.classList.add('permission-granted')
  } else {
    if (useDisable) {
      // Deshabilitar en vez de ocultar
      ;(el as any).disabled = true
      el.classList.add('permission-denied')
    } else {
      // Ocultar (default)
      el.style.display = 'none'
    }
    el.classList.remove('permission-granted')
  }

  // Data attribute para debugging/CSS
  el.setAttribute('data-has-permission', hasPermission.toString())
}

export const canDirective: Directive<CanElement, CanValue> = {
  mounted(el, binding) {
    applyPermission(el, binding)
  },

  updated(el, binding) {
    applyPermission(el, binding)
  },

  unmounted(el) {
    // Limpiar
    el.removeAttribute('data-has-permission')
    el.classList.remove('permission-granted', 'permission-denied')

    if (el._canOriginalDisplay !== undefined) {
      el.style.display = el._canOriginalDisplay
      delete el._canOriginalDisplay
    }
    if (el._canOriginalDisabled !== undefined) {
      ;(el as any).disabled = el._canOriginalDisabled
      delete el._canOriginalDisabled
    }
  },
}

export default canDirective
