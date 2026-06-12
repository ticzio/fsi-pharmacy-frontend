import moment from 'moment'
import 'moment/dist/locale/es'

/**
 * Composables for Moment.js
 * Centralizes date and time formatting for the application.
 */
export function useMoment() {
  // Set default locale to Spanish
  moment.locale('es')

  /**
   * Formats a date to DD/MM/YYYY
   * Example: 17/03/2026
   */
  const formatToStandard = (date: any) => {
    if (!date) return '-'
    return moment(date).format('DD/MM/YYYY')
  }

  /**
   * Formats a date to DD/MM/YYYY HH:mm
   * Example: 17/03/2026 14:30
   */
  const formatToDateTime = (date: any) => {
    if (!date) return '-'
    return moment(date).format('DD/MM/YYYY HH:mm')
  }

  /**
   * Formats a date to YYYY-MM-DD (useful for HTML inputs and APIs)
   * Example: 2026-03-17
   */
  const formatToSQL = (date: any) => {
    if (!date) return null
    return moment(date).format('YYYY-MM-DD')
  }

  /**
   * Formats a date to a relative string
   * Example: "hace 2 días", "hace unos segundos"
   */
  const formatToRelative = (date: any) => {
    if (!date) return '-'
    return moment(date).fromNow()
  }

  /**
   * Formats a date to a long human-readable string
   * Example: "17 de marzo de 2026"
   */
  const formatToLongDate = (date: any) => {
    if (!date) return '-'
    return moment(date).format('D [de] MMMM [de] YYYY')
  }

  /**
   * Formats a date to Month YYYY
   * Example: "Marzo 2026"
   */
  const formatToMonthYear = (date: any) => {
    if (!date) return '-'
    const formatted = moment(date).format('MMMM YYYY')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  /**
   * Checks if a date is valid
   */
  const isValidDate = (date: any) => {
    return moment(date).isValid()
  }

  /**
   * Returns a moment object for advanced manipulation
   */
  const getMoment = (date?: any) => {
    return moment(date)
  }

  return {
    formatToStandard,
    formatToDateTime,
    formatToSQL,
    formatToRelative,
    formatToLongDate,
    formatToMonthYear,
    isValidDate,
    getMoment,
  }
}
