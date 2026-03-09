# useSwalToast

Composable para mostrar notificaciones tipo "toast" usando SweetAlert2, con estilos personalizados y posicionamiento en la esquina superior derecha.

## Descripción general

- Usa `Swal.mixin` con opciones pensadas para toasts.
- Desactiva el botón de confirmación por defecto.
- Aplica clases de Bootstrap 5 para popup, título, contenido e ícono.
- Controla el timer y la barra de progreso, pausando el tiempo al colocar el mouse encima.

## API

### `useSwalToast()`

Devuelve:

- `showSuccess(title?: string): void`  
  Muestra un toast de éxito con colores y estilos verdes.

- `showError(title?: string): void`  
  Muestra un toast de error con colores y estilos rojos.

- `showConfirm(title: string, text: string): Promise<boolean>`  
  Muestra un toast/modal de confirmación y resuelve a `true` si el usuario confirma.

## Ejemplos de uso

### Toast de éxito

```ts
import { useSwalToast } from '@/composables/useSwalToast'

const { showSuccess } = useSwalToast()

showSuccess('Operación realizada correctamente')
```

### Toast de error

```ts
import { useSwalToast } from '@/composables/useSwalToast'

const { showError } = useSwalToast()

showError('Ocurrió un error inesperado')
```

### Confirmación rápida

```ts
import { useSwalToast } from '@/composables/useSwalToast'

const { showConfirm } = useSwalToast()

const confirmed = await showConfirm('¿Confirmar acción?', 'Esta operación no se puede deshacer.')

if (confirmed) {
  // Ejecutar acción crítica
}
```
