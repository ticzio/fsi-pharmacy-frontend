# `useAccessControl`

## Propósito

`useAccessControl` es el composable central del sistema de control de acceso basado en permisos (RBAC). Centraliza toda la lógica de verificación de permisos para:

- **Rutas** (router guard)
- **Menú lateral** (filtrar items)
- **Tabs** (mostrar/ocultar)
- **Botones/acciones** (directiva `v-can`)
- **Acciones de tabla** (`useTableActions`)

## Ubicación

`src/composables/useAccessControl.ts`

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Cookie: id_role (Base64)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              useAccessControl (composable)                  │
│  - getRoleIdFromCookie() → decodifica Base64                │
│  - can(), canAll(), canAny() → verifican permisos           │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Router Guard   │ │  DashboardLayout│ │  useTableActions│
│  (rutas)        │ │  (menú lateral) │ │  (acciones)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
              │               │               │
              ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│              const/rolePermissions.ts                       │
│  ROLE_PERMISSIONS: { roleId: ['permission1', 'permission2'] }│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              const/permissions.ts                           │
│  PERMISSIONS.module.action (strings atómicos)               │
└─────────────────────────────────────────────────────────────┘
```

## Dependencias

- `js-cookie` para leer la cookie `id_role`
- `const/permissions.ts` - permisos atómicos
- `const/rolePermissions.ts` - mapa rol → permisos

## API

### Estado reactivo

| Propiedad         | Tipo                          | Descripción                       |
| ----------------- | ----------------------------- | --------------------------------- |
| `roleId`          | `ComputedRef<number \| null>` | ID del rol decodificado de cookie |
| `permissions`     | `ComputedRef<string[]>`       | Permisos del rol actual           |
| `isSuperAdmin`    | `ComputedRef<boolean>`        | `true` si tiene wildcard `*`      |
| `isAuthenticated` | `ComputedRef<boolean>`        | `true` si tiene rol válido        |

### Funciones

#### `can(permission: string): boolean`

Verifica si tiene UN permiso específico.

```ts
if (can('company.create')) {
  // Puede crear empresas
}
```

#### `canAll(permissions: string[]): boolean`

Verifica si tiene TODOS los permisos especificados.

```ts
if (canAll(['company.read', 'company.update'])) {
  // Puede leer Y actualizar empresas
}
```

#### `canAny(permissions: string[]): boolean`

Verifica si tiene AL MENOS UNO de los permisos.

```ts
if (canAny(['company.update', 'company.delete'])) {
  // Puede actualizar O eliminar empresas
}
```

#### `hasRole(allowedRoles: number[]): boolean`

Verifica si el rol actual está en la lista.

```ts
if (hasRole([1, 2])) {
  // Es Super Admin o Admin
}
```

#### `isRole(targetRoleId: number): boolean`

Verifica si es un rol específico.

```ts
if (isRole(ROLE_IDS.SUPER_ADMIN)) {
  // Es Super Admin
}
```

## Archivos relacionados

### `const/permissions.ts`

Define los permisos atómicos del sistema:

```ts
export const PERMISSIONS = {
  company: {
    read: 'company.read',
    create: 'company.create',
    update: 'company.update',
    delete: 'company.delete',
    deactivate: 'company.deactivate',
  },
  // ... otros módulos
}
```

### `const/rolePermissions.ts`

Mapea roles a permisos:

```ts
export const ROLE_PERMISSIONS: Record<number, string[]> = {
  1: ['*'], // Super Admin: acceso total
  2: ['company.read', 'company.update', ...], // Admin
  3: ['company.read'], // Viewer
}
```

### `const/menuItems.ts`

Define items del menú con permisos requeridos:

```ts
export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Empresas',
    to: '/companies',
    icon: 'bi-buildings',
    iconActive: 'bi-buildings-fill',
    permissions: [PERMISSIONS.company.read],
  },
]
```

## Ejemplos de uso

### 1) En un componente Vue

```ts
import { useAccessControl } from '@/composables/useAccessControl'
import { PERMISSIONS } from '@/const/permissions'

const { can, canAny, isSuperAdmin } = useAccessControl()

// Verificar permiso específico
const canCreateCompany = can(PERMISSIONS.company.create)

// Verificar múltiples permisos
const canManageCompany = canAny([PERMISSIONS.company.update, PERMISSIONS.company.delete])
```

### 2) En template con directiva `v-can`

```vue
<!-- Ocultar si no tiene permiso -->
<button v-can="'company.create'" class="btn btn-primary">
  Nueva empresa
</button>

<!-- Deshabilitar en vez de ocultar -->
<button v-can.disable="'company.delete'" class="btn btn-danger">
  Eliminar
</button>

<!-- Requiere al menos uno -->
<div v-can:any="['company.update', 'company.delete']">
  Panel de gestión
</div>
```

### 3) En rutas (meta.permissions)

```ts
// router/routes/companies.ts
{
  path: '/companies',
  name: 'Companies',
  component: () => import('@/views/companies/List.vue'),
  meta: { permissions: ['company.read'] }
}
```

### 4) En acciones de tabla

```ts
import { useTableActions } from '@/composables/useTableActions'

const { getCompanyActions } = useTableActions()

// Retorna solo las acciones que el usuario puede ejecutar
const actions = getCompanyActions(item)
```

## Roles del sistema

| ID  | Nombre      | Descripción                 |
| --- | ----------- | --------------------------- |
| 1   | Super Admin | Acceso total (`*`)          |
| 2   | Admin       | Casi todo excepto eliminar  |
| 3   | Supervisor  | Lectura + algunas ediciones |
| 4   | Editor      | Crear/editar contenido      |
| 5   | Viewer      | Solo lectura                |

## Agregar un nuevo permiso

1. Agregar en `const/permissions.ts`:

   ```ts
   newModule: {
     read: 'newModule.read',
     create: 'newModule.create',
   }
   ```

2. Asignar a roles en `const/rolePermissions.ts`:

   ```ts
   [ROLE_IDS.ADMIN]: [
     ...existingPermissions,
     PERMISSIONS.newModule.read,
     PERMISSIONS.newModule.create,
   ]
   ```

3. Usar en componentes:
   ```ts
   if (can(PERMISSIONS.newModule.create)) { ... }
   ```

## Agregar un nuevo rol

1. Agregar ID en `const/rolePermissions.ts`:

   ```ts
   export const ROLE_IDS = {
     ...existing,
     NEW_ROLE: 6,
   }
   ```

2. Definir permisos:
   ```ts
   [ROLE_IDS.NEW_ROLE]: [
     PERMISSIONS.company.read,
     // ... permisos del nuevo rol
   ]
   ```

## Migración futura: backend con permissions

Cuando el backend devuelva `permissions[]` directamente:

1. Modificar `useAccessControl.ts`:

   - En vez de leer de `ROLE_PERMISSIONS[roleId]`
   - Leer de `store.getters['auth/permissions']` o similar

2. El resto del código **no cambia** porque usa `can()`, `canAll()`, etc.

## Sugerencias Bootstrap 5

### Botones de acción

```html
<div class="d-flex gap-2 justify-content-end">
  <button v-can="'company.create'" class="btn btn-primary">Crear</button>
  <button v-can="'company.delete'" class="btn btn-danger">Eliminar</button>
</div>
```

### Tabs condicionales

```html
<ul class="nav nav-tabs">
  <li v-can="'company.read'" class="nav-item">
    <a class="nav-link" href="#">General</a>
  </li>
  <li v-can="'company.update'" class="nav-item">
    <a class="nav-link" href="#">Configuración</a>
  </li>
</ul>
```

### Cards con permisos

```html
<div v-can="'settings.read'" class="card shadow-sm">
  <div class="card-body">Contenido restringido</div>
</div>
```
