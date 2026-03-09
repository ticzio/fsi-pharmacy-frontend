/**
 * Verifica si la contraseña tiene la longitud mínima requerida
 * @param password Contraseña a evaluar
 * @param minLength Longitud mínima (por defecto 8)
 * @returns boolean
 */
export function hasMinLength(password: string, minLength = 8): boolean {
  return password.length >= minLength
}

/**
 * Verifica si la contraseña contiene al menos una letra mayúscula
 * @param password Contraseña a evaluar
 * @returns boolean
 */
export function hasUpperCase(password: string): boolean {
  return /[A-Z]/.test(password)
}

/**
 * Verifica si la contraseña contiene al menos una letra minúscula
 * @param password Contraseña a evaluar
 * @returns boolean
 */
export function hasLowerCase(password: string): boolean {
  return /[a-z]/.test(password)
}

/**
 * Verifica si la contraseña contiene al menos un número
 * @param password Contraseña a evaluar
 * @returns boolean
 */
export function hasNumber(password: string): boolean {
  return /[0-9]/.test(password)
}

/**
 * Verifica si la contraseña contiene al menos un carácter especial
 * @param password Contraseña a evaluar
 * @returns boolean
 */
export function hasSpecialChar(password: string): boolean {
  // Incluye caracteres especiales comunes
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
}

/**
 * Verifica si es una contraseña fuerte.
 * Cumple con todos los requisitos mínimos de seguridad:
 * - Al menos 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 *
 * @param password Contraseña a evaluar
 * @returns boolean
 */
export function isStrongPassword(password: string): boolean {
  return (
    hasMinLength(password) &&
    hasUpperCase(password) &&
    hasLowerCase(password) &&
    hasNumber(password) &&
    hasSpecialChar(password)
  )
}

/**
 * Genera un arreglo de mensajes de error con los requisitos que no cumple la contraseña.
 * Útil para mostrar al usuario exactamente qué le falta a su contraseña.
 *
 * @param password Contraseña a evaluar
 * @returns string[] Arreglo con los mensajes de error
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = []

  if (!hasMinLength(password)) {
    errors.push('Debe tener al menos 8 caracteres')
  }
  if (!hasUpperCase(password)) {
    errors.push('Debe contener al menos una letra mayúscula (A-Z)')
  }
  if (!hasLowerCase(password)) {
    errors.push('Debe contener al menos una letra minúscula (a-z)')
  }
  if (!hasNumber(password)) {
    errors.push('Debe contener al menos un número (0-9)')
  }
  if (!hasSpecialChar(password)) {
    errors.push('Debe contener al menos un carácter especial (!@#$...)')
  }

  return errors
}
