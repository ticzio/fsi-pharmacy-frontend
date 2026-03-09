// 1. Importa la librería y los estilos
import Swal from 'sweetalert2'
import type { SweetAlertOptions } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import type { TSwalOptions } from '@/interfaces/sweetAlert2'

// 2. Define tu objeto de opciones de personalización
const swalOptions: TSwalOptions = {
  customClass: {
    popup: 'rounded-4 shadow-sm px-xl-4',
    title: 'text-dark fw-bold pt-xl-1',
    htmlContainer: 'small lh-base text-dark',
    confirmButton: 'btn btn-primary rounded-3  text-uppercase mb-4 shadow-sm',
    denyButton: 'btn  btn-danger rounded-3 text-uppercase mb-4 shadow-sm mx-2',
    cancelButton: 'btn btn-outline-secondary  rounded-3 text-uppercase mb-4 shadow-sm mx-2',
    icon: 'border-0 mt-5 mb-0', // He cambiado mt5 a mt-5 (estándar de Bootstrap)
  },
  // Puedes añadir otras opciones por defecto aquí si quieres
  // Por ejemplo, para que todos los botones de confirmación no muestren el color por defecto
  showConfirmButton: true,
  buttonsStyling: false, // ¡IMPORTANTE! Esto le dice a SweetAlert que no aplique sus estilos por defecto a los botones
  timer: 2000,
  timerProgressBar: true,
}

// 3. Crea la instancia pre-configurada con Swal.mixin()
const StyledSwal = Swal.mixin(swalOptions)

// 4. Exporta una función que devuelve la instancia ESTILIZADA
export function useSwal() {
  /**
   * Muestra una notificación de éxito.
   * @param {string} title El mensaje a mostrar.
   */
  const showSuccess = (title = 'Operación Exitosa') => {
    return StyledSwal.fire({
      icon: 'success',
      title: title,
      showConfirmButton: false,
    })
  }

  /**
   * Muestra una notificación/alerta de error estándar.
   * @param {string} title El mensaje de error.
   */
  const showError = (title = 'Ocurrió un error') => {
    return StyledSwal.fire({
      icon: 'error',
      title: title,
      timer: 5000,
      showConfirmButton: false,
    })
  }

  /**
   * Muestra un modal de confirmación (ej. antes de una eliminación).
   * Devuelve una Promesa para manejar la respuesta del usuario.
   * @param {string} title El título de la confirmación.
   * @param {string} text El cuerpo del mensaje.
   * @param {SweetAlertOptions} options Opciones extra para personalizar el Swal (botones, reverseButtons, etc.).
   * @returns {Promise<boolean>} Resuelve a true si confirma, false si cancela.
   */
  const showConfirm = async (title: string, text: string, options: SweetAlertOptions = {}) => {
    const result = await StyledSwal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      // Sobrescribimos el comportamiento del mixin para que no tenga timer ni barra de tiempo
      timer: undefined,
      timerProgressBar: false,
      ...options,
    })

    return result.isConfirmed
  }

  /**
   * Muestra un modal de información con una lista de textos.
   * @param {string} title El título del modal.
   * @param {string[]} texts Array de textos a mostrar en forma de lista.
   */
  const showInfoList = (title: string, texts: string[]) => {
    const html =
      `<ul class="text-start mb-0">` +
      texts.map((t) => `<li class="mb-1">${t}</li>`).join('') +
      `</ul>`
    return StyledSwal.fire({
      icon: 'info',
      title: title,
      html: html,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      timer: undefined,
      timerProgressBar: false,
    })
  }

  return {
    showSuccess,
    showError,
    showConfirm,
    showInfoList,
  }
}
