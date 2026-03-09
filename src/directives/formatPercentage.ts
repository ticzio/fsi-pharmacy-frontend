import type { Directive } from 'vue'

export const formatPercentage: Directive<HTMLElement, number | string> = {
  mounted(el, binding) {
    const value = binding.value
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (typeof numericValue === 'number' && !isNaN(numericValue)) {
      // Formatear con 2 decimales por defecto, eliminando ceros innecesarios
      const formattedValue = parseFloat(numericValue.toFixed(2))
      el.textContent = `${formattedValue} %`
    } else {
      el.textContent = 'N/A'
    }
  },
  updated(el, binding) {
    const value = binding.value
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (typeof numericValue === 'number' && !isNaN(numericValue)) {
      // Formatear con 2 decimales por defecto, eliminando ceros innecesarios
      const formattedValue = parseFloat(numericValue.toFixed(2))
      el.textContent = `${formattedValue} %`
    } else {
      el.textContent = 'N/A'
    }
  },
}
