import moment from 'moment'
import type { Directive } from 'vue'

const formatDate = (dateTime: string | null | undefined): string => {
  if (dateTime) {
    // Parsear formato del backend (YYYY-MM-DD HH:mm:ss) como UTC y convertir a hora local
    return moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss').local().format('DD-MM-YYYY hh:mm a')
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
