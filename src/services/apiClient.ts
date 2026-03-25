// src/services/apiClient.ts
import axios from 'axios'
import { useSwal } from '@/composables/useSwal'
import { API_PATH } from '@/services/initApi'
import type { IValidationErrors } from '@/interfaces/http'
import { generate_daily_tokenticz } from '@/utils/tokenticz'
import { useCookies } from '@/composables/useCookies'
import store from '@/store'

// 1. Crear la instancia de Axios SIN baseURL para evitar llamar API_PATH() antes de InitializeConfig()
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Permite configurar la baseURL una vez que InitializeConfig() haya terminado
export function setApiBaseURL() {
  apiClient.defaults.baseURL = API_PATH()
}

// 2. Función auxiliar para manejar errores de validación 422
const handleValidationError = (errors: IValidationErrors, showError: (message: string) => void) => {
  // Implementación de la lógica para extraer el primer error visible
  let firstError = ''
  if (errors && typeof errors === 'object') {
    for (const field in errors) {
      if (errors[field] && Array.isArray(errors[field]) && errors[field].length > 0) {
        firstError = errors[field][0]
        break
      }
    }
  }
  showError(firstError || 'Se encontraron errores de validación.')
}

apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {} as typeof config.headers
    }
    const { getCookie } = useCookies()
    const token = getCookie('fsi_admin_token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['tokenticz'] = generate_daily_tokenticz()
    config.headers['Accept'] = 'application/json'

    // Si el data es FormData, eliminar Content-Type para que axios lo configure automáticamente con boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 3. Interceptor de Errores
apiClient.interceptors.response.use(
  (response) => response, // Respuesta exitosa: pasa
  async (error) => {
    const { showError, showConfirm } = useSwal()

    const status = error.response?.status
    const data = error.response?.data

    if (status) {
      switch (status) {
        case 422:
          // Manejo específico del objeto de errores de validación
          handleValidationError(data.errors, showError)
          break
        case 404:
          showError('No se encontró el registro.')
          break
        case 500:
          showError('Error interno del servidor. Inténtalo más tarde.')
          break
        default:
        // Muestra el mensaje de error de la API o un genérico
      }
    } else {
      // Fallo de red/timeout
      showError('Error de conexión o timeout. Verifica tu red.')
    }

    // Crucial: Rechazar la promesa para que el .catch() en Vuex se ejecute
    return Promise.reject(error)
  },
)

export default apiClient
