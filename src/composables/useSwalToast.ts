// src/composables/useSwalToast.ts

// 1. Importa la librería y los estilos
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import type { TSwalOptions } from '@/interfaces/sweetAlert2'

// 2. Define tu objeto de opciones de personalización
const swalOptions: TSwalOptions = {
  customClass: {
    popup:
      'rounded-4 shadow-lg px-4 py-3 border-0 bg-dark bg-opacity-75 backdrop-blur-sm d-flex align-items-center text-white',
    title: 'text-white fw-semibold mb-0 ps-2 pe-4',
    htmlContainer: 'small lh-base text-white-50 ps-2 pe-4',
    confirmButton: 'btn rounded-pill btn-primary text-uppercase mb-3 shadow-sm px-4',
    denyButton: 'btn rounded-pill btn-danger text-uppercase mb-3 shadow-sm mx-2 px-4',
    cancelButton: 'btn rounded-pill btn-secondary text-uppercase mb-3 shadow-sm mx-2 px-4',
    icon: 'border-0 mt-2 mb-2 ms-2 me-1 fs-3', // He cambiado mt5 a mt-5 (estándar de Bootstrap)
    closeButton: 'btn btn-sm btn-outline-light rounded-circle p-0 fs-6 me-1 mt-1',
  },
  // Puedes añadir otras opciones por defecto aquí si quieres
  // Por ejemplo, para que todos los botones de confirmación no muestren el color por defecto
  showConfirmButton: false,
  buttonsStyling: false, // ¡IMPORTANTE! Esto le dice a SweetAlert que no aplique sus estilos por defecto a los botones
  timer: 1500,
  timerProgressBar: true,
  toast: true, // Mostrar como una "tostada" o notificación, no un modal central
  position: 'top-end', // Posición en la esquina superior derecha
  didOpen: (toast: any) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
}

// 3. Crea la instancia pre-configurada con Swal.mixin()
const StyledSwal = Swal.mixin(swalOptions)

// 4. Exporta una función que devuelve la instancia ESTILIZADA
export function useSwalToast() {
  /**
   * Muestra una notificación de éxito.
   * @param {string} title El mensaje a mostrar.
   */
  const showSuccess = (title = 'Operación Exitosa') => {
    StyledSwal.fire({
      icon: 'success',
      title: title,
      background: 'transparent',
      color: '#ffffff',
      iconColor: '#20c997',
      width: 360,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 bg-dark bg-opacity-75 border-start border-4 border-success d-flex align-items-center text-white',
        title: 'text-white fw-semibold mb-0 ps-2 pe-3',
        htmlContainer: 'small lh-base text-white-50 ps-2 pe-3',
        confirmButton: 'btn rounded-pill btn-success text-uppercase mb-3 shadow-sm px-3',
        icon: 'border-0 mt-2 mb-2 ms-2 me-1 fs-3 text-success',
        timerProgressBar: 'bg-success',
      },
    })
  }

  /**
   * Muestra una sola alerta con un listado de errores (hasta 3) y un resumen si hay más.
   * @param {string[]} errors Arreglo de mensajes de error.
   * @param {string} title Título opcional para la alerta.
   */
  const showFormErrors = (
    errors: string[] = [],
    title = 'Por favor, corrige los siguientes errores:'
  ) => {
    if (!errors || errors.length === 0) {
      return
    }

    const errorsToShow = errors.slice(0, 3)
    let errorList =
      '<ul class="mb-3" style="line-height: 1.5;">' +
      errorsToShow.map((e) => `<li>${e}</li>`).join('') +
      '</ul>'
    if (errors.length > 3) {
      errorList += `<p class="mt-2 mb-0 fst-italic">Y ${errors.length - 3} error(es) más...</p>`
    }

    StyledSwal.fire({
      icon: 'error',
      title,
      html: errorList,
      background: 'transparent',
      color: '#ffffff',
      iconColor: '#ff6b6b',
      timer: 4000,
      width: 360,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 bg-dark bg-opacity-75 border-start border-4 border-danger text-white',
        title: 'text-white fw-semibold mb-2 ps-2 pe-3',
        htmlContainer: 'small lh-base text-white ps-2 pe-3',
        confirmButton: 'btn rounded-pill btn-light text-danger text-uppercase mb-3 shadow-sm px-3',
        icon: 'border-0 mt-2 mb-2 ms-2 me-1 fs-3 text-white',
        timerProgressBar: 'bg-danger',
      },
    })
  }

  /**
   * Muestra una notificación/alerta de error estándar.
   * @param {string} title El mensaje de error.
   */
  const showError = (title = 'Ocurrió un error') => {
    StyledSwal.fire({
      icon: 'error',
      title,
      background: 'transparent',
      color: '#ffffff',
      iconColor: '#ff6b6b',
      timer: 2500,
      width: 360,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 bg-dark bg-opacity-75 border-start border-4 border-danger d-flex align-items-center text-white',
        title: 'text-white fw-semibold mb-0 ps-2 pe-3',
        htmlContainer: 'small lh-base text-white-50 ps-2 pe-3',
        confirmButton: 'btn rounded-pill btn-light text-danger text-uppercase mb-3 shadow-sm px-3',
        icon: 'border-0 mt-2 mb-2 ms-2 me-1 fs-3 text-white',
        timerProgressBar: 'bg-danger',
      },
    })
  }

  /**
   * Muestra un modal de confirmación (ej. antes de una eliminación).
   * Devuelve una Promesa para manejar la respuesta del usuario.
   * @param {string} title El título de la confirmación.
   * @param {string} text El cuerpo del mensaje.
   * @returns {Promise<boolean>} Resuelve a true si confirma, false si cancela.
   */
  const showConfirm = async (title: string, text: string) => {
    const result = await StyledSwal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    })

    return result.isConfirmed
  }

  return {
    showSuccess,
    showError,
    showFormErrors,
    showConfirm,
  }
}
