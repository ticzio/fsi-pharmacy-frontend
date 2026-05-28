import moment from 'moment'
import type { Directive } from 'vue'

const formatDate = (dateTime: string | null | undefined): string => {
  if (dateTime) {
    // Parsear formatos del backend (DD/MM/YYYY HH:mm:ss, YYYY-MM-DD HH:mm:ss o YYYY/MM/DD HH:mm:ss) como UTC y convertir a hora local
    return moment.utc(dateTime, ['DD/MM/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss']).local().format('DD-MM-YYYY hh:mm a')
  }
  return ''
}

export const formatDateTime: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.textContent = formatDate(binding.value)
  },
  updated(el, binding) {
    el.textContent = formatDate(binding.value)
  },
}