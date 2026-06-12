import { ref, computed, provide, inject, reactive } from 'vue'

/**
 * Clave única para el contexto de validación de formularios
 */
const FORM_VALIDATION_KEY = Symbol('form-validation')

export interface FormValidationContext {
  registerField: (id: string, hasError: boolean) => void
  unregisterField: (id: string) => void
  updateFieldStatus: (id: string, hasError: boolean) => void
}

/**
 * Provee un contexto de validación a los componentes hijos.
 * Usado usualmente en la Vista principal del formulario.
 */
export function provideFormValidation() {
  const fields = reactive<Record<string, boolean>>({})

  const registerField = (id: string, hasError: boolean) => {
    fields[id] = hasError
  }

  const unregisterField = (id: string) => {
    delete fields[id]
  }

  const updateFieldStatus = (id: string, hasError: boolean) => {
    fields[id] = hasError
  }

  const isFormValid = computed(() => {
    return Object.values(fields).every((hasError) => !hasError)
  })

  const context: FormValidationContext = {
    registerField,
    unregisterField,
    updateFieldStatus,
  }

  provide(FORM_VALIDATION_KEY, context)

  return {
    isFormValid,
  }
}

/**
 * Consume el contexto de validación provisto por un ancestro.
 * Usado en componentes de Input.
 */
export function useFormValidation() {
  return inject<FormValidationContext | null>(FORM_VALIDATION_KEY, null)
}
