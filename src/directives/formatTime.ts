import moment from 'moment'
import type { Directive } from 'vue'

/**
 * Parsea un valor de tiempo a formato 12h.
 *
 * @param time  - Cadena de tiempo o datetime
 * @param local - Si es true, no convierte zona horaria (el valor ya viene en hora local)
 *               Si es false (default), convierte de UTC a hora local del navegador
 *
 * Uso:
 *   v-format-time="value"         → modo UTC: convierte a hora local del navegador
 *   v-format-time:local="value"   → modo local: muestra la hora tal cual viene del backend
 */
const parseTime = (time: string | null | undefined, local = false): string => {
  if (!time) return ''

  // Si ya es una hora en formato HH:mm:ss o HH:mm
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) {
    return moment(time, ['HH:mm:ss', 'HH:mm']).format('hh:mm a')
  }

  // Si viene como datetime completo (YYYY-MM-DD HH:mm:ss o YYYY/MM/DD HH:mm:ss)
  if (local) {
    // Modo local: el backend ya devuelve la hora en zona local, no convertir
    return moment(time, ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss']).format('hh:mm a')
  }

  // Modo UTC (default): convertir de UTC a hora local del navegador
  return moment.utc(time, ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss']).local().format('hh:mm a')
}

export const formatTime: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.textContent = parseTime(binding.value, binding.arg === 'local')
  },
  updated(el, binding) {
    el.textContent = parseTime(binding.value, binding.arg === 'local')
  },
}
