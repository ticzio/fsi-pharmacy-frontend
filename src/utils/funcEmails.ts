// Helpers de email: normalizar a minúsculas y validar formato básico
export function normalizeEmail(email: string | null | undefined): string {
  return (email || '').trim().toLowerCase()
}
export function isValidEmail(email: string): boolean {
  // Permite A-Z, 0-9, '-', '_', '.' en local y dominio; prohíbe '..'; TLD de 2+ letras
  const EMAIL_REGEX = /^(?!.*\.\.)[A-Z0-9._-]+@[A-Z0-9._-]+\.[A-Z]{2,}$/i
  return EMAIL_REGEX.test(email)
}
