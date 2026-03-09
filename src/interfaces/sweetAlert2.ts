import type { SweetAlertOptions, SweetAlertCustomClass } from 'sweetalert2'

/**
 * Extiende las opciones de SweetAlert2 para añadir tipado estricto
 * a las clases personalizadas que usamos en el proyecto.
 */
export interface ICustomSwalClass extends SweetAlertCustomClass {
  popup?: string
  title?: string
  htmlContainer?: string
  confirmButton?: string
  denyButton?: string
  cancelButton?: string
  icon?: string
}

/**
 * Define la estructura de nuestro objeto de opciones personalizadas para Swal,
 * asegurando que `customClass` utilice nuestra interfaz extendida.
 */
export type TSwalOptions = SweetAlertOptions & {
  customClass?: ICustomSwalClass
}
