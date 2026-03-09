# Componente Modal

Un componente modal reutilizable para el panel de administración, basado en Bootstrap 5. Diseñado para ofrecer una estructura base flexible donde puedes inyectar cualquier contenido o componente a través de _slots_, aislando así la complejidad del modal.

## Ubicación

`src/components/common/Modal.vue`

## Propiedades (Props)

| Prop    | Tipo     | Requerido | Valor por defecto | Descripción                                                                                                    |
| ------- | -------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `id`    | `String` | **Sí**    | N/a               | ID único del modal. Necesario para que los botones lo puedan abrir (ej. `data-bs-target="#mi-id"`).            |
| `title` | `String` | No        | `''` (vacío)      | Título del modal. Solo se renderiza si se proporciona.                                                         |
| `size`  | `String` | No        | `'md'`            | Tamaño del modal. Tallas soportadas: `'sm'` (pequeño), `'md'` (medio), `'lg'` (grande), `'xl'` (extra grande). |

## Slots

Este componente provee _slots_ predefinidos que cubren la estructura estándar de un modal:

- **`default` (Cuerpo):** Usado para todo el contenido principal del modal.
- **`header`:** Permite sobreescribir o añadir elementos adyacentes al título (se ubica antes de la 'X' para cerrar).
- **`footer`:** Usado para colocar botones de confirmación o cierre abajo del modal (por defecto no se mapea si está vacío).

## Ejemplos de Uso

### Uso Básico

```vue
<script setup>
import Modal from '@/components/common/Modal.vue'
</script>

<template>
  <!-- Botón para lanzar el modal -->
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Abrir Modal
  </button>

  <!-- Componente Modal -->
  <Modal id="exampleModal" title="Ejemplo Básico">
    <p>Este es el contenido principal del modal que se inyecta en el slot por defecto.</p>
  </Modal>
</template>
```

### Uso Avanzado (Añadiendo Footer y modificando tamaño)

```vue
<script setup>
import Modal from '@/components/common/Modal.vue'
</script>

<template>
  <!-- Botón para lanzar el modal -->
  <button
    type="button"
    class="btn btn-secondary"
    data-bs-toggle="modal"
    data-bs-target="#advancedModal"
  >
    Configuración Avanzada
  </button>

  <Modal id="advancedModal" title="Configuración" size="lg">
    <!-- Contenido del Body -->
    <form>
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-control" />
      </div>
    </form>

    <!-- Slot para el Footer -->
    <template #footer>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      <button type="button" class="btn btn-primary">Guardar Cambios</button>
    </template>
  </Modal>
</template>
```

## Notas Adicionales

- Este componente utiliza las clases estructurales de **Bootstrap 5**.
- Para cerrar el modal desde un botón dentro del mismo (o en sus _slots_), basta con agregar los atributos nativos de Bootstrap: `data-bs-dismiss="modal"`.
- Viene preconfigurado con las propiedades `data-bs-backdrop="static"` y `data-bs-keyboard="false"` para evitar que los clics accidentales fuera del modal lo cierren si hay información sin guardar en los modales anidados. Si necesitas cerrar dando clic afuera, puedes sobreescribir o modificar estos comportamientos nativos de bootstrap.
