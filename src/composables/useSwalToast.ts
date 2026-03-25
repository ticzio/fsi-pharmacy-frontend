// src/composables/useSwalToast.ts

// 1. Importa la librería y los estilos
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import type { TSwalOptions } from '@/interfaces/sweetAlert2'

// 2. Define tu objeto de opciones de personalización
const swalOptions: TSwalOptions = {
  customClass: {
    popup:
      'rounded-4 shadow-lg px-4 py-3 border-0 bg-white bg-opacity-75 backdrop-blur-md d-flex align-items-center',
    title: 'text-dark fw-semibold mb-0 ps-2 pe-4',
    htmlContainer: 'small lh-base text-dark-50 ps-2 pe-4',
    confirmButton: 'btn rounded-pill btn-primary text-uppercase mb-3 shadow-sm px-4',
    denyButton: 'btn rounded-pill btn-danger text-uppercase mb-3 shadow-sm mx-2 px-4',
    cancelButton: 'btn rounded-pill btn-secondary text-uppercase mb-3 shadow-sm mx-2 px-4',
    icon: 'border-0 mt-2 mb-2 ms-2 me-1 fs-3',
    closeButton: 'btn btn-sm btn-outline-dark rounded-circle p-0 fs-6 me-1 mt-1',
  },
  showConfirmButton: false,
  buttonsStyling: false,
  timer: 2500,
  timerProgressBar: true,
  toast: true,
  position: 'top-end',
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
   */
  const showSuccess = (title = 'Operación Exitosa') => {
    StyledSwal.fire({
      icon: 'success',
      title: title,
      background: 'rgba(255, 255, 255, 0.85)',
      color: '#044692',
      iconColor: '#00b100',
      width: 400,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 backdrop-blur-md border-start border-5 border-success d-flex align-items-center text-primary',
        title: 'text-primary fw-bold mb-0 ps-2 pe-3',
        htmlContainer: 'small lh-base text-dark-50 ps-2 pe-3',
        timerProgressBar: 'bg-success',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInRight animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight animate__faster',
      },
    })
  }

  /**
   * Muestra una sola alerta con un listado de errores (hasta 3) y un resumen si hay más.
   */
  const showFormErrors = (
    errors: string[] = [],
    title = 'Por favor, corrige los siguientes errores:',
  ) => {
    if (!errors || errors.length === 0) {
      return
    }

    const errorsToShow = errors.slice(0, 3)
    let errorList =
      '<ul class="mb-3 text-start ms-2" style="line-height: 1.5; color: #444;">' +
      errorsToShow.map((e) => `<li>${e}</li>`).join('') +
      '</ul>'
    if (errors.length > 3) {
      errorList += `<p class="mt-2 mb-0 fst-italic text-secondary small">Y ${errors.length - 3} error(es) más...</p>`
    }

    StyledSwal.fire({
      icon: 'error',
      title,
      html: errorList,
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#ce000c',
      iconColor: '#ce000c',
      timer: 5000,
      width: 420,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 backdrop-blur-md border-start border-5 border-danger text-dark',
        title: 'text-danger fw-bold mb-2 ps-2 pe-3',
        htmlContainer: 'text-dark ps-2 pe-3',
        confirmButton: 'btn btn-sm rounded-pill btn-danger text-uppercase mb-2 shadow-sm px-3',
        timerProgressBar: 'bg-danger',
      },
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
    })
  }

  /**
   * Muestra una notificación/alerta de error estándar.
   */
  const showError = (title = 'Ocurrió un error') => {
    StyledSwal.fire({
      icon: 'error',
      title,
      background: 'rgba(255, 255, 255, 0.85)',
      color: '#ce000c',
      iconColor: '#ce000c',
      timer: 3000,
      width: 400,
      customClass: {
        popup:
          'rounded-4 shadow-lg px-3 py-2 border-0 backdrop-blur-md border-start border-5 border-danger d-flex align-items-center text-danger',
        title: 'text-danger fw-bold mb-0 ps-2 pe-3',
        htmlContainer: 'small lh-base text-dark-50 ps-2 pe-3',
        timerProgressBar: 'bg-danger',
      },
    })
  }

  /**
   * Muestra un modal de confirmación.
   */
  const showConfirm = async (title: string, text: string) => {
    const result = await StyledSwal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#044692',
      cancelButtonColor: '#ce000c',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#044692',
      toast: false,
      position: 'center',
      timer: undefined,
      customClass: {
        popup: 'rounded-4 shadow-xl border-0 p-4',
        title: 'text-primary fw-bold mb-3',
        htmlContainer: 'text-secondary mb-4',
        confirmButton: 'btn rounded-pill btn-primary px-4 py-2 me-2',
        cancelButton: 'btn rounded-pill btn-outline-danger px-4 py-2',
      },
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
