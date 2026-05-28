import axios from 'axios'

const urlDomain = window.location.host
let configUrl = ''
export let isApiConnected = false

// Info del ambiente detectado para mostrar alerta después del login
let detectedEnvironment: {
  type: 'development' | 'quality' | null
  title: string
  message: string
} = {
  type: null,
  title: '',
  message: '',
}

/**
 * Retorna la info del ambiente detectado (para mostrar alerta desde el login).
 * Después de consumirla, se limpia para no mostrarla de nuevo.
 */
export function getEnvironmentAlert() {
  const env = { ...detectedEnvironment }
  // Limpiar para que solo se muestre una vez
  detectedEnvironment = { type: null, title: '', message: '' }
  return env
}

export const API_VERSION = '1.0'
export async function InitializeConfig() {
  try {
    if (urlDomain.includes('localhost:517') || urlDomain.includes('localhost:417')) {
      configUrl = import.meta.env.VITE_API_PATH_DEVELOP
    } else if (
      urlDomain.includes('dashtest.miFSI.com') ||
      urlDomain.includes(import.meta.env.VITE_DOMAIN_DEVELOP)
    ) {
      configUrl = import.meta.env.VITE_API_PATH_DEVELOP
      detectedEnvironment = {
        type: 'development',
        title: 'Ambiente de Desarrollo',
        message: 'Estás en un ambiente de desarrollo (servidor de pruebas).',
      }
    } else if (
      urlDomain.includes(import.meta.env.VITE_DOMAIN) ||
      urlDomain.includes('dashmin.miFSI.com')
    ) {
      configUrl = import.meta.env.VITE_API_PATH
    } else {
      throw new Error(`Dominio no reconocido: ${urlDomain}`)
    }

    const response = await axios.get(configUrl)
    if (response.status === 200) {
      configUrl = `${configUrl}api/${API_VERSION}`
      isApiConnected = true
      console.log(
        `Conectado con el backend.\n${configUrl}\n%cRespuesta: ${JSON.stringify(response.data)}`,
        'color: #bada55; font-weight: bold',
      )
    } else {
      isApiConnected = false
      throw new Error(
        `[FSI] No se pudo establecer conexión con el backend. Respuesta HTTP: ${JSON.stringify(
          response.data,
        )}`,
      )
    }
  } catch (error) {
    isApiConnected = false
    console.error('[FSI] Error de inicialización de API:', error)
  }
}

export function API_PATH(): string {
  if (!configUrl) {
    const error = new Error('API no Inicializada.')
    console.error('[FSI] Error de inicialización de API:', error)
    throw error
  }
  return configUrl
}
