# BaseInput Component

El componente `BaseInput` es un elemento de formulario reutilizable, polimórfico y desacoplado, diseñado para facilitar la creación de interfaces de usuario robustas mediante la inyección de reglas de validación y soporte de múltiples tipos de entradas (texto, contraseña, número, etc.).

## Características principales

- **Polimorfismo de tipos**: Soporta múltiples tipos de inputs a través de la propiedad `type` (`text`, `password`, `number`, `email`, etc.).
- **Gestión de contraseñas**: Incluye funcionalidad integrada para alternar la visibilidad de las contraseñas cuando `type="password"`.
- **Inyección de Reglas de Validación**: Cumple con el principio de inversión de control permitiendo pasar funciones validadoras, lo cual evita el "anti patrón del Componente Dios".
- **Estilos consistentes**: Integra clases de estilo customizadas y de Bootstrap para mantener armonía visual con el resto de la aplicación (fue diseñado basándose en la vista de Login).

## Propiedades (Props)

| Prop          | Tipo                | Requerido | Valor por Defecto | Descripción                                                           |
| ------------- | ------------------- | --------- | ----------------- | --------------------------------------------------------------------- |
| `id`          | `String`            | **Sí**    | -                 | Identificador único del input. Usado para enlazarse con el `<label>`. |
| `modelValue`  | `String` o `Number` | No        | `''`              | Valor del input para el binding bidireccional (`v-model`).            |
| `type`        | `String`            | No        | `'text'`          | Define el tipo de input. Ej: `text`, `password`, `email`, `number`.   |
| `label`       | `String`            | No        | `''`              | Texto para la etiqueta descriptiva (`<label>`) del campo.             |
| `placeholder` | `String`            | No        | `''`              | Placeholder del input.                                                |
| `disabled`    | `Boolean`           | No        | `false`           | Deshabilita el input cuando se evalúa como `true`.                    |
| `rules`       | `Array<Function>`   | No        | `[]`              | Colección de funciones validadoras para el input.                     |

## Eventos (Emits)

| Evento              | Payload              | Descripción                                                                                        |
| ------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `update:modelValue` | `String` \| `Number` | Emitido cada vez que el usuario modifica el valor del input. Habilita el uso natural de `v-model`. |

## Inyección de Reglas (Validación)

La validación está diseñada para recibir un arreglo de funciones mediante la prop `rules`. Cada función:

1. Recibirá el valor actual del input (como `string` o `number`).
2. Deberá devolver un `String` con el mensaje de error si falla la validación.
3. Deberá devolver `true` si la validación es exitosa.

### Ejemplo de funciones validadoras:

```ts
const emailRule = (val: string) => {
  const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return pattern.test(val) || 'Ingresa un correo electrónico válido'
}

const requiredRule = (val: string) => {
  return !!val || 'Este campo es obligatorio'
}

const minLength = (min: number) => (val: string) => {
  return val.length >= min || `Mínimo de caracteres requeridos: ${min}`
}
```

## Ejemplo de Uso Básico

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'

const username = ref('')

// Inyectar regla de validación
const isRequired = (val: string) => !!val || 'El usuario es requerido'
</script>

<template>
  <BaseInput
    id="usernameInput"
    label="Nombre de usuario"
    v-model="username"
    placeholder="Ingresa tu usuario"
    :rules="[isRequired]"
  />
</template>
```

## Ejemplo de Input tipo Contraseña

Al pasar `type="password"`, el componente añade automáticamente un botón interactivo (con ícono) para visualizar/ocultar el texto ingresado.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'

const password = ref('')

const passwordRules = [
  (val: string) => !!val || 'Contraseña es requerida',
  (val: string) => val.length >= 8 || 'Mínimo 8 caracteres',
]
</script>

<template>
  <BaseInput
    id="passwordInput"
    type="password"
    label="Contraseña"
    v-model="password"
    placeholder="*********"
    :rules="passwordRules"
  />
</template>
```
