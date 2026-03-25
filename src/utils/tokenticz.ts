import CryptoJS from 'crypto-js'

const TOKENTICZ_BASE = import.meta.env.VITE_TOKENTICZ_BASE
const TOKENTICZ_SECRET = import.meta.env.VITE_TOKENTICZ_SECRET_KEY

/**
 * Genera un token dinámico basado en HMAC-SHA256 usando la fecha UTC actual.
 * El token caduca forzosamente al cambio de día UTC.
 * @returns {string} Los primeros 48 caracteres del hash generado.
 */
export const generate_daily_tokenticz = (): string => {
  if (!TOKENTICZ_BASE || !TOKENTICZ_SECRET) {
    console.error('Faltan variables de entorno para la generación del Tokenticz')
    return ''
  }

  // CRÍTICO: Siempre usar el horario UTC para empatar con los validadores backend
  const today = new Date().toISOString().split('T')[0]
  const data = `${TOKENTICZ_BASE}|${today}`

  return CryptoJS.HmacSHA256(data, TOKENTICZ_SECRET).toString(CryptoJS.enc.Hex).substring(0, 48)
}
