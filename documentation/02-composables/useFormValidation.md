# useFormValidation

Composables para gestionar el estado de validación global de un formulario mediante el patrón `provide/inject`. Permite que componentes hijos (como inputs) registren su estado de error y que el componente padre (el formulario) reaccione a la validez total.

## Descripción general

- **`provideFormValidation()`**: Se utiliza en el componente padre (generalmente la vista o el contenedor del formulario). Crea un registro reactivo de todos los campos hijos y expone un estado computado `isFormValid`.
- **`useFormValidation()`**: Se utiliza en los componentes de input hijos. Permite a cada input informar si tiene errores o no, registrándose automáticamente al montar y desregistrándose al desmontar (si se implementa así en el componente).

## API

### `provideFormValidation()`

Debe llamarse en el `setup()` del componente que contiene el formulario.

**Retorna:**
- `isFormValid: ComputedRef<boolean>`  
  Es `true` si todos los campos registrados actualmente no tienen errores (`hasError: false`).

### `useFormValidation()` (Contexto)

Retorna el objeto `FormValidationContext` inyectado por el padre, o `null` si no hay un proveedor ancestro.

**Métodos disponibles en el contexto:**
- `registerField(id: string, hasError: boolean): void`  
  Registra un nuevo campo en el sistema de validación.
- `unregisterField(id: string): void`  
  Elimina un campo del sistema de validación (útil al desmontar el componente).
- `updateFieldStatus(id: string, hasError: boolean): void`  
  Actualiza el estado de error de un campo ya registrado.

## Ejemplo de uso

### 1. En el componente Padre (Formulario)

```vue
<script setup>
import { provideFormValidation } from '@/composables/useFormValidation'

const { isFormValid } = provideFormValidation()

const handleSubmit = () => {
  if (isFormValid.value) {
    // Enviar formulario
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Componentes hijos con validación -->
    <BaseInput id="email" label="Email" />
    <BaseInput id="password" label="Password" />
    
    <button :disabled="!isFormValid" type="submit">
      Guardar
    </button>
  </form>
</template>
```

### 2. En el componente Hijo (Input)

```vue
<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

const props = defineProps(['id', 'modelValue'])
const validation = useFormValidation()

// Lógica local de error
const hasError = computed(() => props.modelValue.length === 0)

if (validation) {
  onMounted(() => {
    validation.registerField(props.id, hasError.value)
  })

  watch(hasError, (newVal) => {
    validation.updateFieldStatus(props.id, newVal)
  })

  onUnmounted(() => {
    validation.unregisterField(props.id)
  })
}
</script>
```
