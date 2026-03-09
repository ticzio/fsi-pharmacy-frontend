import Cookies from 'js-cookie'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

// 1. Inferencia del Tipo de Opciones desde js-cookie
// Obtiene el tipo del tercer parámetro de la función Cookies.set (que son las opciones)
// Se usa NonNullable para evitar que el tipo se reduzca a never en algunas combinaciones de overloads
type CookieOptions = NonNullable<Parameters<typeof Cookies.set>[2]>

// Define opciones por defecto para evitar repetición en el código
const DEFAULT_OPTIONS: CookieOptions = {
  expires: 7, // 7 días por defecto
  path: '/',
}

/**
 * Define la interfaz para el valor que se guarda en la cookie.
 * Puede ser cualquier tipo serializable a JSON, o los tipos primitivos que js-cookie maneja por defecto.
 */
type SerializableValue = string | number | boolean | object | null | undefined

/**
 * Composable para gestionar las cookies de forma centralizada.
 * Proporciona métodos tipados para obtener, establecer, y eliminar cookies,
 * además de una función para usarlas reactivamente en componentes.
 */
export function useCookies() {
  /**
   * Obtiene una cookie específica.
   * @param name - El nombre de la cookie.
   * @returns El valor de la cookie como string, o undefined si no existe.
   */
  const getCookie = (name: string): string | undefined => {
    return Cookies.get(name)
  }

  /**
   * Obtiene una cookie y la convierte al tipo genérico especificado (ej. JSON).
   * @param name - El nombre de la cookie.
   * @returns El valor de la cookie parseado, o null si no existe o falla el parseo.
   */
  const getCookieJson = <T extends object>(name: string): T | null => {
    const value = getCookie(name)
    if (!value) {
      return null
    }
    try {
      return JSON.parse(value) as T
    } catch (e) {
      console.error(`[useCookies] Error al parsear la cookie JSON ${name}:`, e)
      return null
    }
  }

  /**
   * Establece una cookie con un valor simple (string).
   * @param name - El nombre de la cookie.
   * @param value - El valor string a guardar.
   * @param options - Opciones de la cookie (ej: { expires: 30 }).
   */
  const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
    Cookies.set(name, value, { ...DEFAULT_OPTIONS, ...options })
  }

  /**
   * Establece una cookie convirtiendo el valor a JSON (útil para objetos o arrays).
   * @param name - El nombre de la cookie.
   * @param value - El objeto o array a guardar.
   * @param options - Opciones de la cookie.
   */
  const setCookieJson = (name: string, value: object, options: CookieOptions = {}): void => {
    try {
      const jsonString = JSON.stringify(value)
      setCookie(name, jsonString, options)
    } catch (e) {
      console.error('[useCookies] Error al serializar el valor de la cookie a JSON.', e)
    }
  }

  /**
   * Elimina una cookie.
   * @param name - El nombre de la cookie a eliminar.
   * @param options - Opciones (solo 'path' y 'domain' son relevantes para eliminar).
   */
  const removeCookie = (name: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void => {
    // Es crucial usar las mismas opciones de path/domain con las que se estableció.
    // Combinamos con DEFAULT_OPTIONS para asegurar que 'path: /' se use si no se especifica otra cosa.
    const opts = { ...DEFAULT_OPTIONS, ...options }
    Cookies.remove(name, opts)
  }

  // --- Función Reactiva (La joya del Composable) ---

  /**
   * Devuelve una referencia reactiva (Ref) que sincroniza su valor
   * bidireccionalmente con una cookie específica.
   * @param name - El nombre de la cookie a observar.
   * @param defaultValue - Valor inicial si la cookie no existe.
   */
  const useReactiveCookie = <T extends SerializableValue>(
    name: string,
    defaultValue: T,
  ): Ref<T> => {
    // 1. Obtener el valor inicial (si es objeto/array usa getCookieJson)
    let initialValue: T

    if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
      // Es un objeto: intentar obtenerlo como JSON
      initialValue = getCookieJson<T & object>(name) || defaultValue
    } else {
      // Es un primitivo o array: obtenerlo como string y usar el default
      const cookieValue = getCookie(name)
      initialValue = cookieValue !== undefined ? (cookieValue as T) : defaultValue
    }

    const reactiveValue: Ref<T> = ref(initialValue) as Ref<T>

    // 2. Observar los cambios en el Ref y actualizar la cookie
    watch(
      reactiveValue,
      (newValue) => {
        if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
          // Es un objeto (guardar como JSON)
          setCookieJson(name, newValue as object)
        } else if (newValue !== undefined && newValue !== null) {
          // Es un primitivo o array (guardar como string)
          setCookie(name, String(newValue))
        } else {
          // Es nulo o indefinido (remover)
          removeCookie(name)
        }
      },
      { deep: typeof defaultValue === 'object' && defaultValue !== null },
    ) // Deep watch para objetos/arrays

    return reactiveValue
  }

  return {
    getCookie,
    getCookieJson,
    setCookie,
    setCookieJson,
    removeCookie,
    useReactiveCookie,
  }
}
