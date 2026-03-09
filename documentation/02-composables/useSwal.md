# useSwal

Composable para mostrar modales de SweetAlert2 con estilos personalizados.

## Descripción general

- Crea una instancia de `Swal` preconfigurada mediante `Swal.mixin`.
- Aplica clases de Bootstrap 5 para popup, títulos, botones e íconos.
- Expone helpers para mostrar mensajes de éxito, error y confirmación.

## API

### `useSwal()`

Devuelve:

- `showSuccess(title?: string): void`  
  Muestra un modal de éxito simple.

- `showError(title?: string): void`  
  Muestra un modal de error con un tiempo más largo para leer el mensaje.

- `showConfirm(title: string, text: string, options?: SweetAlertOptions): Promise<boolean>`  
  Muestra un modal de confirmación y resuelve a `true` si el usuario confirma.

## Ejemplos de uso

### Notificación de éxito

```ts
import { useSwal } from '@/composables/useSwal'

const { showSuccess } = useSwal()

showSuccess('Datos guardados correctamente')
```

### Notificación de error

```ts
import { useSwal } from '@/composables/useSwal'

const { showError } = useSwal()

showError('No se pudo guardar la información')
```

### Confirmación antes de eliminar

```ts
import { useSwal } from '@/composables/useSwal'

const { showConfirm } = useSwal()

const confirmed = await showConfirm('¿Eliminar registro?', 'Esta acción no se puede deshacer.')

if (confirmed) {
  // Ejecutar eliminación
}
```
