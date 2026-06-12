import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'

export interface BackendErrorResponse {
  status?: string | number
  code?: number
  message?: string
  alert?: string
  failed_attempts?: number
  [key: string]: any
}

export function useHandleError() {
  const swal = useSwal()
  const swalToast = useSwalToast()

  /**
   * Maneja errores devueltos por la API o excepciones generales,
   * y muestra una alerta (Swal o Toast) usando el mensaje 'alert' del backend o alertas por defecto.
   *
   * @param error - Objeto de error enviado por backend o excepción en JS
   * @param defaultMessage - Mensaje por defecto en caso de no poder extraerlo
   */
  const handleErrorResponse = (
    error: any,
    defaultMessage: string = 'Error al procesar la solicitud',
  ) => {
    // Si error es de axios, a menudo el body de error que envía el backend viene en error.response.data
    // Si viene directo del reject() de nuestro store, ya es el objeto parseado.
    const errData = error?.response?.data || error

    if (errData && typeof errData === 'object') {
      // CASO LOGIN: si hay 401 y failed_attempts existe, mostrar confirm
      if (errData.code === 401 && errData.failed_attempts !== undefined) {
        swal.showConfirm(
          errData.alert || errData.message || defaultMessage,
          `Intentos fallidos: ${errData.failed_attempts}`,
          {
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Entendido',
          },
        )
        return
      }

      // CASO 404 NOT FOUND: Recurso no encontrado
      if (errData.status === 404) {
        swalToast.showError('Error en la URL solicitada.')
        return
      }

      if (errData.code === 400) {
        swalToast.showError('Error en los datos enviados.')
        return
      }

      // CASO GENERAL: Utilizar el atributo 'alert' provisto por la estructura de backend
      if (errData.alert) {
        swalToast.showError(errData.alert)
        return
      }
    }

    // FALLBACK FINAL: si es un error nativo u otro formato, mostramos el valor por defecto
    swalToast.showError(defaultMessage)
  }

  return {
    handleErrorResponse,
  }
}
