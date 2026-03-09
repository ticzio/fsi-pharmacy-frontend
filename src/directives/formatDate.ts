import moment from 'moment'
import type { Directive } from 'vue'

export const formatDate: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const date = binding.value
    if (date) {
      el.textContent = moment(date).format('DD-MM-YYYY')
    } else {
      el.textContent = 'N/A'
    }
  },
  updated(el, binding) {
    const date = binding.value
    if (date) {
      el.textContent = moment(date).format('DD-MM-YYYY')
    } else {
      el.textContent = 'N/A'
    }
  },
}
