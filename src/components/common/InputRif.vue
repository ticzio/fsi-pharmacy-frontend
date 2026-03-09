<template>
  <!-- Contenedor principal del componente con clase personalizada -->
  <div class="prefixed-input-container">
    <label v-if="label" :for="inputId" class="prefixed-input-label">{{ label }}</label>
    <!-- 
      Grupo de input con clases personalizadas.
      Los estados de validación también usan clases personalizadas.
    -->
    <div
      class="prefixed-input-group"
      :class="{ 'has-error': hasError, 'is-valid': isDirty && !hasError }"
    >
      <!-- Dropdown personalizado -->
      <div class="custom-select-wrapper" ref="selectWrapper">
        <button
          type="button"
          class="prefixed-select-button border-radius-left"
          @click="toggleDropdown"
          :disabled="disabled"
          aria-haspopup="listbox"
          :aria-expanded="isDropdownOpen"
        >
          <span class="ps-2"> {{ selectedPrefix }}-</span>
        </button>
        <ul v-if="isDropdownOpen" class="custom-options-list show rounded-4" role="listbox">
          <li v-for="prefix in prefixes" :key="prefix">
            <a class="dropdown-item" href="#" @click.prevent="selectPrefix(prefix)">
              {{ prefix }}-
            </a>
          </li>
        </ul>
      </div>

      <!-- Input para la parte numérica con clase personalizada -->
      <input
        type="text"
        :id="inputId"
        class="prefixed-numeric-input border-radius-right"
        :value="numericPart"
        @input="handleNumericInput"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        aria-describedby="error-feedback"
      />
    </div>
    <!-- Mensaje de error con clase personalizada -->
    <div v-if="hasError" id="error-feedback" class="prefixed-error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// --- DEFINICIÓN DE PROPS Y EMITS ---
const props = withDefaults(
  defineProps<{
    modelValue: string // v-model: El valor completo del input (ej: "J-12345678")
    label?: string // Etiqueta opcional para el input
    placeholder?: string // Placeholder para la parte numérica
    disabled?: boolean // Para deshabilitar el componente
    required?: boolean // Indica si el campo es obligatorio
    minLength?: number // Longitud mínima para la parte numérica
    maxLength?: number // Longitud máxima para la parte numérica
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: 'Ej: 12345678',
    disabled: false,
    required: true,
    minLength: 7,
    maxLength: 9,
  },
)

const emit = defineEmits(['update:modelValue'])

// --- ESTADO INTERNO DEL COMPONENTE ---
const prefixes = ['J', 'V', 'E', 'G', 'P']
const selectedPrefix = ref<string>(prefixes[0])
const numericPart = ref<string>('')
const errorMessage = ref<string | null>(null)
const isDirty = ref<boolean>(false)
const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLDivElement | null>(null)

const inputId = `prefixed-input-${Math.random().toString(36).substring(2, 9)}`

// --- LÓGICA DE COMPUTADAS Y WATCHERS ---
const fullValue = computed(() => {
  if (numericPart.value) {
    return `${selectedPrefix.value}-${numericPart.value}`
  }
  return ''
})

const hasError = computed(() => errorMessage.value !== null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue.includes('-')) {
      const [prefix, number] = newValue.split('-', 2)
      if (prefixes.includes(prefix) && number) {
        selectedPrefix.value = prefix
        numericPart.value = number
      }
    } else if (!newValue) {
      numericPart.value = ''
      selectedPrefix.value = prefixes[0]
      isDirty.value = false
      errorMessage.value = null
    }
  },
  { immediate: true },
)

// --- MANEJADORES DE EVENTOS Y VALIDACIÓN ---

// Función unificada para validar y emitir el valor actualizado.
const validateAndEmit = () => {
  isDirty.value = true
  validate()
  emit('update:modelValue', fullValue.value)
}

// Manejador para el input numérico.
const handleNumericInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  numericPart.value = target.value.replace(/\D/g, '')
  validateAndEmit()
}

const handleBlur = () => {
  isDirty.value = true
  validate()
}

// --- Lógica del Dropdown Personalizado ---
const toggleDropdown = () => {
  if (props.disabled) return
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectPrefix = (prefix: string) => {
  selectedPrefix.value = prefix
  isDropdownOpen.value = false
  validateAndEmit() // Validar y emitir al cambiar el prefijo.
}

// Cierra el dropdown si se hace clic fuera de él.
const handleClickOutside = (event: MouseEvent) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

// Lógica central de validación.
const validate = () => {
  if (props.required && !numericPart.value) {
    errorMessage.value = 'Este campo es obligatorio.'
    return
  }
  if (numericPart.value && numericPart.value.length < props.minLength) {
    errorMessage.value = `El número debe tener al menos ${props.minLength} dígitos.`
    return
  }
  errorMessage.value = null
}
</script>

<style scoped>
/* --- Estilos Personalizados - Inspirados en Bootstrap 5.3 --- */

/* Contenedor principal */
.prefixed-input-container {
  margin-bottom: 1rem;
}

/* Etiqueta del input */
.prefixed-input-label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

/* Grupo de input que contiene el botón y el campo de texto */
.prefixed-input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  height: 40px;
}

/* Estilos base compartidos para el botón y el input */
.prefixed-select-button,
.prefixed-numeric-input {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  padding: 0.375rem 0.75rem;
  height: calc(1.5em + 0.75rem + 2px);
}

/* El input numérico ocupa el espacio restante */
.prefixed-numeric-input {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  height: 40px;

  min-width: 0;
  background-color: #fff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* El botón del selector */
.prefixed-select-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 5rem;
  background-color: var(--bs-light);
  cursor: pointer;
  border-right: none;
  height: 40px;
}

.prefixed-select-button:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Foco en el input y el botón */
.prefixed-numeric-input:focus,
.prefixed-select-button:focus {
  color: #212529;
  border-color: #b0b0b0; /* Color de borde por defecto en foco */
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(176, 176, 176, 0.5); /* Sombra por defecto en foco */
  z-index: 3;
}
.prefixed-numeric-input:focus {
  border-left-color: #b0b0b0; /* Asegura que el borde izquierdo también cambie */
}

/* Estados de Validación */
.prefixed-input-group.has-error .prefixed-numeric-input,
.prefixed-input-group.has-error .prefixed-select-button {
  z-index: 2;
}
/* Sin efecto de sombra en foco para el estado de error */
.prefixed-input-group.has-error .prefixed-numeric-input:focus,
.prefixed-input-group.has-error .prefixed-select-button:focus {
  box-shadow: none;
}

.prefixed-input-group.is-valid .prefixed-numeric-input,
.prefixed-input-group.is-valid .prefixed-select-button {
  z-index: 1;
}
/* Sin efecto de sombra en foco para el estado válido */
.prefixed-input-group.is-valid .prefixed-numeric-input:focus,
.prefixed-input-group.is-valid .prefixed-select-button:focus {
  box-shadow: none;
}

/* Mensaje de error */
.prefixed-error-message {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  font-weight: normal;
  color: var(--bs-danger);
}

/* --- Dropdown Personalizado --- */
.custom-select-wrapper {
  position: relative;
  height: 40px;
}

/* Flecha del dropdown */
.prefixed-select-button::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: '';
  border-top: 0.4em solid;
  border-right: 0.4em solid transparent;
  border-bottom: 0;
  border-left: 0.4em solid transparent;
}

/* Lista de opciones */
.custom-options-list {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem 0;
  margin-top: 0.25rem;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 0.375rem;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: var(--bs-light);
}
</style>
<!--
  # Documentación del Componente `RifInput.vue`

  Este componente crea un campo de entrada de texto (`<input>`) con un selector de prefijos personalizable. Está diseñado para capturar identificadores como RIF o Cédula de Identidad, comunes en Venezuela. Es totalmente compatible con `v-model` y utiliza Bootstrap 5.3 para su estilo base.

  ## Cómo Usar

  Importa el componente en tu archivo `.vue` y úsalo dentro de la sección `<template>`. La forma más común de usarlo es con la directiva `v-model` para enlazar su valor a una variable en el estado de tu componente padre.

  ```vue
  <template>
    <RifInput label="RIF o Cédula" v-model="miVariableRif" />
  </template>

  <script setup lang="ts">
  import { ref } from 'vue';
  import RifInput from './components/RifInput.vue';

  const miVariableRif = ref(''); // Se actualizará con 'J-12345678'
  </script>
  ```

  ## Props (Propiedades)

  Puedes personalizar el componente pasando las siguientes propiedades:

  | Prop         | Tipo      | Por Defecto    | Descripción                                                              |
  |--------------|-----------|----------------|--------------------------------------------------------------------------|
  | `modelValue` | `String`  | `''`           | **Requerido por v-model.** El valor completo del campo (ej. "V-12345678"). |
  | `label`      | `String`  | `''`           | El texto que se mostrará en la etiqueta (`<label>`) sobre el input.      |
  | `placeholder`| `String`  | `'Ej: 12345678'` | El texto de marcador de posición para la parte numérica del input.       |
  | `disabled`   | `Boolean` | `false`        | Si es `true`, deshabilita tanto el selector como el campo de texto.      |
  | `required`   | `Boolean` | `true`         | Si es `true`, el campo no pasará la validación si está vacío.            |
  | `minLength`  | `Number`  | `7`            | La longitud mínima de la parte numérica para que sea válida.             |
  | `maxLength`  | `Number`  | `9`            | La longitud máxima de la parte numérica del input (`maxlength` del HTML).|

  ## Emits (Eventos)

  - **`update:modelValue`**: Este es el evento estándar que permite el funcionamiento de `v-model`. Se emite cada vez que el valor del componente cambia (ya sea por escribir en el campo numérico o por cambiar el prefijo), enviando el valor completo (`prefijo-número`) al componente padre.

  ## Ejemplos de Uso

  ### 1. Uso Básico y Requerido
  Un campo de cédula estándar, obligatorio y con una etiqueta.

  ```vue
  <RifInput
    label="Cédula de Identidad"
    v-model="Cédula"
    placeholder="Ej: 19876543"
    :minLength="7"
    :maxLength="8"
  />
  ```

  ### 2. Campo Opcional para un RIF de Empresa
  Un campo para un RIF de una empresa, que no es obligatorio.

  ```vue
  <RifInput
    label="RIF de la Empresa (Opcional)"
    v-model="rifEmpresa"
    :required="false"
    :minLength="8"
    :maxLength="9"
  />
  ```
  
  ### 3. Campo Deshabilitado
  Para mostrar un valor que no se puede editar.

  ```vue
  <RifInput
    label="Identificador de Usuario"
    v-model="valorFijo"
    :disabled="true"
  />
  ```
-->
