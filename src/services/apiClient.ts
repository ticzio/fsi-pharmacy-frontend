// src/services/apiClient.ts
import axios from 'axios'
import { useSwal } from '@/composables/useSwal'
import { API_PATH } from '@/services/initApi'
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

apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {} as typeof config.headers
    }
    const { getCookie } = useCookies()
    const token = getCookie('fsi_pharmacy_token')
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
  async (response) => {
    const { showConfirm } = useSwal()
    const data = response.data

    // 1. Manejar respuestas con éxito HTTP (200), pero que contienen errores de lógica de negocio (ej. UNAUTHORIZED)
    if (data && (data.status === 'UNAUTHORIZED' || data.code === 401)) {
      await showConfirm(
        data.alert || 'Sesión Expirada',
        'Tu sesión ha finalizado. Por favor, inicia sesión de nuevo.',
        {
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        },
      )
      store.dispatch('logout')
      window.location.href = '/login'
      return Promise.reject(response)
    }

    return response
  },
  async (error) => {
    const { showError } = useSwal()

    const status = error.response

    if (status) {
      switch (status) {
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
