# errorConst

## Ubicación

`src/const/errorConst.ts`

## Descripción

Mensajes de error estándar para operaciones CRUD y autenticación. Centraliza los textos de error para mantener consistencia en toda la aplicación.

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna

## Exports

### `ERROR`

```ts
export const ERROR = {
  errorGet: 'Error al obtener listado desde el servidor',
  errorDelete: 'Error al eliminar:',
  errorUpdate: 'Error al actualizar:',
  errorCreate: 'Error al guardar:',
  errorActive: 'Error al activar:',
  errorDeactive: 'Error al desactivar:',
  errorEdited: 'No puedes editar este registro por que se encuentra desactivado',
  errorLogin: 'Error al intentar iniciar sesión',
  errorGetRegister: 'Error al obtener datos del registro',
}
```

## Ejemplo de Uso

```ts
import { ERROR } from '@/const/errorConst'
import { useSwalToast } from '@/composables/useSwalToast'

const { showError } = useSwalToast()

try {
  await store.dispatch('deleteData', { url, id })
} catch (e) {
  showError(`${ERROR.errorDelete} ${e.message}`)
}
```

## Usado por

- Views: Manejo de errores en operaciones CRUD
- Composables: Mensajes de error en `useSwal`, `useSwalToast`
