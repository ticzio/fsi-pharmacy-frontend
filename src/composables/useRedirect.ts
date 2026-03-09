import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useRedirect() {
  const router = useRouter()

  const isRedirecting = ref(false)
  const redirectMessage = ref('')

  /**
   * Redirige a una ruta con un mensaje de overlay
   * @param route - Ruta destino (string o objeto de ruta)
   * @param message - Mensaje a mostrar en el overlay
   * @param delay - Tiempo de espera antes de redirigir (ms)
   */
  const redirectTo = (
    route: string | { name: string; params?: Record<string, any> },
    message = 'Redirigiendo...',
    delay = 700
  ) => {
    isRedirecting.value = true
    redirectMessage.value = message

    setTimeout(() => {
      router.replace(route)
    }, delay)
  }

  /**
   * Redirige al listado
   */
  const redirectToList = (listName: string, message = 'Redirigiendo al listado...') => {
    redirectTo({ name: listName }, message)
  }

  /**
   * Redirige a los detalles
   */
  const redirectToDetails = (path: string, message = 'Redirigiendo a los detalles...') => {
    redirectTo(path, message)
  }

  return {
    isRedirecting,
    redirectMessage,
    redirectTo,
    redirectToList,
    redirectToDetails,
  }
}
