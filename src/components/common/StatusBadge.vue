<template>
  <span :class="computedClasses">
    {{ computedText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Constantes locales para estilos de estado
const STATUS_STYLES = {
  base: 'w-100 border-radius-left border-radius-right p-2 text-uppercase',
  active: 'badge border-primary text-white border-0 bg-primary-subtle',
  inactive: 'badge bg-body-tertiary text-body-secondary border-0 border-body-50',
  textActive: 'Activo',
  textInactive: 'Inactivo',
}

const props = defineProps<{
  value?: boolean | number | null | undefined
  /** Clases adicionales opcionales, por ejemplo para ancho en mobile */
  extraClass?: string | string[]
  /** Texto a mostrar cuando el estado es activo. Si no se define, usa STATUS_STYLES.textActive */
  activeText?: string
  /** Texto a mostrar cuando el estado es inactivo. Si no se define, usa STATUS_STYLES.textInactive */
  inactiveText?: string
  /** Texto personalizado para mostrar en lugar de "Activo"/"Inactivo" */
  label?: string
  /** Clase personalizada para el badge (ej: badge bg-warning) */
  variant?: string
  /**
   * Número de intentos fallidos del usuario. Si alcanza `blockedThreshold`,
   * el badge muestra "Cuenta bloqueada" con estilo de advertencia.
   * Útil para modelos que tienen `user.failed_attempts`.
   */
  blockedAttempts?: number | null
  /**
   * Umbral de intentos para considerar la cuenta bloqueada.
   * Por defecto: 10
   */
  blockedThreshold?: number
}>()

const isActive = computed(() => {
  if (props.value === 1) return true
  if (props.value === 0) return false
  return Boolean(props.value)
})

/** Determina si la cuenta está bloqueada según los intentos fallidos */
const isBlocked = computed(() => {
  if (props.blockedAttempts == null) return false
  const threshold = props.blockedThreshold ?? 10
  return props.blockedAttempts >= threshold
})

/** Clase efectiva para el badge */
const resolvedVariant = computed(() => {
  if (isBlocked.value) return 'badge bg-warning text-dark border-0'
  return props.variant
})

const computedClasses = computed(() => {
  // Cuenta bloqueada o variant explícito
  if (resolvedVariant.value) {
    const baseWithVariant = [resolvedVariant.value, STATUS_STYLES.base]
    if (!props.extraClass) return baseWithVariant
    if (Array.isArray(props.extraClass)) {
      return [...baseWithVariant, ...props.extraClass]
    }
    return [...baseWithVariant, props.extraClass]
  }

  // Comportamiento activo/inactivo
  const base = [isActive.value ? STATUS_STYLES.active : STATUS_STYLES.inactive, STATUS_STYLES.base]

  if (!props.extraClass) return base

  if (Array.isArray(props.extraClass)) {
    return [...base, ...props.extraClass]
  }

  return [...base, props.extraClass]
})

const computedText = computed(() => {
  // Cuenta bloqueada tiene prioridad
  if (isBlocked.value) return 'Cuenta bloqueada'

  // Label manual
  if (props.label) return props.label

  if (isActive.value) {
    return props.activeText ?? STATUS_STYLES.textActive
  }

  return props.inactiveText ?? STATUS_STYLES.textInactive
})
</script>
