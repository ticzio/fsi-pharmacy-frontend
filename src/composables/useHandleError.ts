// src/composables/useHandleError.ts
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'

/**
 * Composable centralizado para manejar errores del backend de forma estandarizada.
 *
 * Reglas:
 *  - Si el error tiene code: 401 y un atributo failed_attempts → modal de confirmación (swal.showConfirm)
 *  - Si el error tiene un campo alert enviado por el backend → toast de error (swalToast.showError)
 *  - En cualquier otro caso → muestra el defaultMessage como toast de error
 */
export function useHandleError() {
  const swal = useSwal()
  const swalToast = useSwalToast()

  /**
   * Maneja la respuesta de error del backend.
   * @param error   El objeto rechazado por la promesa (viene directamente del backend).
   * @param defaultMessage  Mensaje genérico a mostrar si el error no incluye un campo `alert`.
   */
  const handleErrorResponse = (error: any, defaultMessage = 'Ocurrió un error inesperado') => {
    // Caso 1: 401 con intentos fallidos registrados
    if (error?.code === 401 && error?.failed_attempts !== undefined) {
      swal.showConfirm(error.alert || 'Acceso denegado', `Intentos fallidos: ${error.failed_attempts}`, {
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Entendido',
      })
      return
    }

    // Caso 2: El backend envía un campo `alert` con el mensaje a mostrar
    if (error?.alert) {
      swalToast.showError(error.alert)
      return
    }

    // Caso 3: Fallback al mensaje por defecto
    swalToast.showError(defaultMessage)
  }

  return { handleErrorResponse }
}
