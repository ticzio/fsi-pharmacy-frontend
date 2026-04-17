/**
 * Filtra un string para permitir solo caracteres válidos de DNI/Cédula.
 * Soporta el formato venezolano (V, E, J, G, P) o solo números.
 *
 * @param value - El string a filtrar o el número a convertir y filtrar
 * @returns string - El string filtrado en mayúsculas
 */
export function filterDniCharacters(value: string | number): string {
  let str = String(value).toUpperCase()

  // Eliminar caracteres que no sean letras de prefijo, números o guiones
  str = str.replace(/[^VEJGP0-9-]/g, '')

  if (str.length === 0) return ''

  const firstChar = str[0]

  // Si comienza con un número, solo permitimos números en todo el string
  if (/[0-9]/.test(firstChar)) {
    return str.replace(/[^0-9]/g, '')
  }

  // Si comienza con una letra de prefijo válida (V, E, J, G, P)
  if (/[VEJGP]/.test(firstChar)) {
    const letter = firstChar
    // Del resto quitamos cualquier letra que no deba estar ahí
    const rest = str.slice(1).replace(/[^0-9-]/g, '')
    return letter + rest
  }

  // Por defecto, si el primer caracter no es válido, intentamos extraer solo los números
  return str.replace(/[^0-9]/g, '')
}

/**
 * Valida si un formato de DNI es aceptable de forma flexible.
 * Un DNI venezolano válido suele empezar por prefijo o ser solo números (5-15 caracteres).
 *
 * @param dni - El string del DNI a validar
 * @returns boolean - True si el formato es válido
 */
export function isDniFormatValid(dni: string | null | undefined): boolean {
  if (!dni) return false
  // Formato: Solo números (5-15) O Prefijo[VEJGP] seguido de números/guiones (5-15 total)
  const DNI_REGEX = /^([0-9]{5,15}|[VEJGP][- ]?[0-9]{4,15})$/
  return DNI_REGEX.test(dni.toUpperCase())
}
