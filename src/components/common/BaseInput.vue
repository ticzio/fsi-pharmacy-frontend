<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

interface Props {
  modelValue: string | number
  type?: string
  label?: string
  id: string
  placeholder?: string
  disabled?: boolean
  autocomplete?: string
  rules?: Array<(val: any) => string | boolean>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
  autocomplete: 'off',
  rules: () => [],
})

const emit = defineEmits(['update:modelValue'])

const internalErrors = ref<string[]>([])
const isPasswordVisible = ref(false)
const validationContext = useFormValidation()

onMounted(() => {
  validationContext?.registerField(props.id, internalErrors.value.length > 0)
})

onUnmounted(() => {
  validationContext?.unregisterField(props.id)
})

watch(
  () => internalErrors.value.length,
  (newCount) => {
    validationContext?.updateFieldStatus(props.id, newCount > 0)
  },
)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const validate = (value: any) => {
  if (!props.rules || props.rules.length === 0) {
    internalErrors.value = []
    return true
  }

  const errors: string[] = []
  for (const rule of props.rules) {
    const result = rule(value)
    if (typeof result === 'string') {
      errors.push(result)
    } else if (result === false) {
      errors.push('Campo inválido')
    }
  }
  internalErrors.value = errors
  return errors.length === 0
}

// Opcional: Validar cuando cambia el valor desde fuera
watch(
  () => props.modelValue,
  (newVal) => {
    if (internalErrors.value.length > 0) {
      validate(newVal)
    }
  },
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  validate(value)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  validate(target.value)
}

const togglePasswordVisibility = () => {
  if (props.disabled) return
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div class="mb-3 form-group-custom">
    <label v-if="label" :for="id" class="form-label mb-1 fw-bold">{{ label }}</label>

    <div :class="{ 'input-group': type === 'password' }">
      <input
        :id="id"
        :type="inputType"
        class="form-control"
        :class="{
          'is-invalid': internalErrors.length > 0,
          'border-end-0': type === 'password' && internalErrors.length === 0,
          'custom-input': true,
        }"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
      />

      <span
        v-if="type === 'password'"
        class="input-group-text bg-white custom-input-icon"
        :class="{
          'border-start-0': internalErrors.length === 0,
          'border-danger': internalErrors.length > 0,
        }"
      >
        <button
          class="btn btn-link p-0 text-muted text-decoration-none"
          type="button"
          @click="togglePasswordVisibility"
          tabindex="-1"
          :disabled="disabled"
        >
          <i :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </span>
    </div>

    <transition name="fade">
      <div v-if="internalErrors.length > 0" class="errors-wrapper">
        <div class="errors-wrapper-inner">
          <transition-group
            name="list"
            tag="div"
            class="invalid-feedback d-block mt-1 errors-container"
          >
            <div v-for="error in internalErrors" :key="error" class="error-item">• {{ error }}</div>
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-group-custom label {
  font-size: 1rem;
}

.custom-input {
  font-size: 1.1rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #111827;
  box-shadow: none;
}

.custom-input::placeholder {
  color: #6b7280;
  font-size: 1.1rem;
}

.custom-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1);
}

.input-group > .custom-input:focus {
  z-index: 3;
}

.custom-input-icon {
  border: 1px solid #e5e7eb;
  border-radius: 0 10px 10px 0;
  background-color: #ffffff;
}

.custom-input.border-end-0 {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.custom-input-icon.border-start-0 {
  border-left: none;
}

.input-group .btn-link {
  color: #9ca3af;
}
.input-group .btn-link:focus,
.input-group .btn-link:hover {
  color: #4b5563;
  outline: none;
  box-shadow: none;
}

.invalid-feedback {
  font-size: 0.875em;
  color: #dc3545;
}

.errors-wrapper {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  /* El pseudo-elemento creará la sombra/difuminado en la parte de abajo indicando scroll */
}

.errors-wrapper-inner {
  min-height: 0;
  overflow: hidden;
}

.errors-container {
  max-height: 3.2em; /* Muestra hasta 2 errores cómodamente */
  overflow-y: scroll; /* Fuerza la barra de scroll a estar visible si se excede el alto */
  /* Fallback para Firefox */
  scrollbar-width: thin;
  scrollbar-color: #fca5a5 #f9fafb;
  padding-right: 4px;
}

/* Forzar Webkit (Chrome/Safari/Edge/MacOS) a mostrar el scroll siempre */
.errors-container::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
}
.errors-container::-webkit-scrollbar-track {
  background: #f9fafb; /* Fondo muy gris claro para que el track exista visualmente */
  border-radius: 4px;
}
.errors-container::-webkit-scrollbar-thumb {
  background-color: #fca5a5; /* Color del scrollbar rojo tenue */
  border-radius: 4px;
  border: 1px solid #f9fafb; /* Pequeño borde para separarlo del track */
}

.error-item {
  line-height: 1.4em;
  margin-bottom: 4px;
  word-break: break-word; /* Rompe palabras extra largas que no tienen espacios */
  overflow-wrap: break-word; /* Asegura el salto de línea al llegar al borde */
  white-space: normal; /* Asegura que el texto respete los bordes de la caja */
  overflow: hidden;
  max-height: 5em;
}
.error-item:last-child {
  margin-bottom: 0;
}

.is-invalid {
  border-color: #dc3545 !important;
}

/* Transición del bloque de errores completo */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  grid-template-rows: 0fr;
}

/* Transición individual de los errores al agregarse o quitarse */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  max-height: 0;
  margin-bottom: 0;
}
</style>
