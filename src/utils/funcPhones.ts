/**
 * Valida un número de teléfono de forma básica.
 * Permite solo dígitos y opcionalmente un '+' al inicio.
 * Longitud aproximada entre 7 y 15 caracteres.
 * 
 * @param phone - El string del teléfono a validar
 * @returns boolean - True si cumple el formato básico
 */
export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false
  const PHONE_REGEX = /^\+?[0-9]{7,15}$/
  return PHONE_REGEX.test(phone)
}
