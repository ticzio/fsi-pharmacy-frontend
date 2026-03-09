# useAuth

Composable para gestionar el rol del usuario a partir de la cookie `id_role`. Expone el estado reactivo del rol y helpers para validar permisos.

## Descripción general

- Lee la cookie `id_role`, la decodifica desde Base64 y la convierte a `number`.
- Mantiene un estado global (singleton) con el rol actual (`userRole`).
- Permite verificar si el rol actual está dentro de una lista de roles permitidos.
- Permite forzar la recarga del rol desde la cookie (útil después de login/logout).

## API

### `useAuth()`

Devuelve un objeto con:

- `userRole: Ref<number | null>`  
  Rol actual del usuario (o `null` si no hay cookie válida).

- `hasRole(allowedRoles: number[]): boolean`  
  Devuelve `true` si `userRole` está dentro de `allowedRoles`.

- `resetAuthRole(): void`  
  Reinicia el estado interno y vuelve a leer la cookie `id_role`.

## Ejemplo de uso básico

```ts
import { useAuth } from '@/composables/useAuth'

const { userRole, hasRole, resetAuthRole } = useAuth()

if (hasRole([1, 2])) {
  // El usuario tiene un rol permitido
}

// Después de login/logout
resetAuthRole()
```
