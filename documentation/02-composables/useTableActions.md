# Composable `useTableActions`

Un composable centralizado y reutilizable para manejar la lógica de permisos de acciones en tablas. Elimina la repetición de código y proporciona un sistema consistente para gestionar qué acciones puede realizar cada usuario según su rol.

## 📁 Archivo

`src/composables/useTableActions.ts`

## 🚀 Instalación y Uso

### 1. Importar el composable

```typescript
import { useTableActions } from '@/composables/useTableActions'
```

### 2. Inicializar en tu componente

```typescript
// En tu componente Vue
const { getConcessionaireActions, getUserActions, getAdminActions } = useTableActions()

// Usar la función específica para tu módulo
const getTableActions = getConcessionaireActions
```

## 🎯 Interfaces

### `Action`

Interfaz que coincide con `CustomTable`:

```typescript
export interface Action {
  name: string // Nombre de la acción ('edit', 'delete', etc.)
  icon: string // Clase de icono Bootstrap ('bi bi-pencil', etc.)
  class: string // Clases CSS para el botón
  tooltip?: string // Texto del tooltip
}
```

### `PermissionConfig`

Configuración de permisos por acción:

```typescript
export interface PermissionConfig {
  [actionName: string]: {
    roles: number[] // Roles permitidos
    allowAll?: boolean // Permitir a todos los roles
  }
}
```

## 📚 Funciones Principales

### `getActionsWithPermissions()`

Función genérica para verificar permisos de acciones.

```typescript
getActionsWithPermissions(
  item,                 // any - Item de la tabla
  customActions?,       // Action[] - Acciones personalizadas
  customPermissions?   // PermissionConfig - Permisos personalizados
): Promise<Action[]>
```

### Funciones Específicas por Módulo

#### `getConcessionaireActions()`

Para el módulo de concesionarios:

```typescript
const getTableActions = getConcessionaireActions
```

**Permisos configurados:**

- `edit`: roles [1, 2, 3, 4, 5]
- `deactivate`: roles [1, 2]
- `delete`: roles [1, 2]

#### `getUserActions()`

Para el módulo de usuarios:

```typescript
const getTableActions = getUserActions
```

**Permisos configurados:**

- `edit`: roles [1, 2]
- `deactivate`: roles [1]
- `delete`: roles [1]
- `view`: roles [1, 2, 3, 4, 5]

#### `getAdminActions()`

Para el módulo de administradores:

```typescript
const getTableActions = getAdminActions
```

**Permisos configurados:**

- `edit`: roles [1]
- `deactivate`: roles [1]
- `delete`: roles [1]
- `view`: roles [1, 2]

### `createCustomActions()`

Crea funciones de acciones personalizadas:

```typescript
const customActions = [
  { name: 'edit', icon: 'bi bi-pencil', class: 'btn btn-primary' },
  { name: 'approve', icon: 'bi bi-check', class: 'btn btn-success' },
]

const customPermissions = {
  edit: { roles: [1, 2] },
  approve: { roles: [1] },
}

const getTableActions = createCustomActions(customActions, customPermissions)
```

## 🔄 Integración con CustomTable

### Uso Básico

```vue
<template>
  <CustomTable
    :data="items"
    :headers="headers"
    :actions="getTableActions"
    @action-click="handleTableAction"
  />
</template>

<script setup lang="ts">
import { useTableActions } from '@/composables/useTableActions'

const { getConcessionaireActions } = useTableActions()
const getTableActions = getConcessionaireActions

const handleTableAction = ({ actionName, item }) => {
  if (actionName === 'edit') {
    // Lógica de edición
  }
  if (actionName === 'delete') {
    // Lógica de eliminación
  }
}
</script>
```

### Uso con Acciones Personalizadas

```vue
<script setup lang="ts">
import { useTableActions } from '@/composables/useTableActions'

const { createCustomActions } = useTableActions()

// Definir acciones personalizadas
const customActions = [
  {
    name: 'edit',
    icon: 'bi bi-pencil-square',
    class: 'btn btn-outline-primary btn-sm',
  },
  {
    name: 'activate',
    icon: 'bi bi-toggle-on',
    class: 'btn btn-success btn-sm',
  },
  {
    name: 'details',
    icon: 'bi bi-eye',
    class: 'btn btn-info btn-sm',
  },
]

// Definir permisos
const permissions = {
  edit: { roles: [1, 2, 3] },
  activate: { roles: [1, 2] },
  details: { roles: [1, 2, 3, 4, 5] },
}

// Crear función de acciones
const getTableActions = createCustomActions(customActions, permissions)
</script>
```

## ⚙️ Configuración de Permisos

### Permisos por Defecto

```typescript
const defaultPermissions = {
  edit: { roles: [1, 2, 3, 4, 5] },
  deactivate: { roles: [1, 2] },
  delete: { roles: [1, 2] },
  view: { roles: [1, 2, 3, 4, 5] },
}
```

### Permitir a Todos los Roles

```typescript
const permissions = {
  view: { roles: [], allowAll: true }, // Todos los roles pueden ver
}
```

### Combinar Permisos

```typescript
const customPermissions = {
  ...defaultPermissions, // Heredar permisos por defecto
  customAction: { roles: [1, 2] }, // Agregar permisos personalizados
}
```

## 🎨 Acciones Dinámicas

### Acciones Condiciones por Estado

```typescript
const getDynamicActions = (item) => [
  {
    name: 'edit',
    icon: 'bi bi-pencil',
    class: item.active ? 'btn btn-primary' : 'btn btn-secondary',
    tooltip: item.active ? 'Editar' : 'No disponible',
  },
  {
    name: 'toggle',
    icon: item.active ? 'bi bi-pause' : 'bi bi-play',
    class: item.active ? 'btn btn-warning' : 'btn btn-success',
    tooltip: item.active ? 'Desactivar' : 'Activar',
  },
]
```

### Acciones con Iconos Dinámicos

```typescript
const getActionsWithDynamicIcons = (item) => [
  {
    name: 'status',
    icon: item.status === 'active' ? 'bi bi-check-circle' : 'bi bi-x-circle',
    class: `btn btn-${item.status === 'active' ? 'success' : 'danger'}`,
    tooltip: `Estado: ${item.status}`,
  },
]
```

## 🛠️ Casos de Uso Avanzados

### Múltiples Tipos de Usuario

```typescript
const getRoleBasedActions = async (item) => {
  const userRole = await getCurrentUserRole()

  const baseActions = [{ name: 'view', icon: 'bi bi-eye', class: 'btn btn-info' }]

  if (userRole === 'admin') {
    baseActions.push(
      { name: 'edit', icon: 'bi bi-pencil', class: 'btn btn-primary' },
      { name: 'delete', icon: 'bi bi-trash', class: 'btn btn-danger' }
    )
  }

  return baseActions
}
```

### Acciones Contextuales

```typescript
const getContextualActions = (item) => {
  const actions = []

  // Si el item pertenece al usuario actual
  if (item.userId === currentUserId) {
    actions.push({
      name: 'edit',
      icon: 'bi bi-pencil',
      class: 'btn btn-primary',
    })
  }

  // Si el item está pendiente de aprobación
  if (item.status === 'pending') {
    actions.push({
      name: 'approve',
      icon: 'bi bi-check',
      class: 'btn btn-success',
    })
  }

  return actions
}
```

## ✅ Ventajas

- ✅ **DRY**: Elimina repetición de código de permisos
- ✅ **Centralizado**: Lógica de permisos en un solo lugar
- ✅ **Consistente**: Misma lógica en toda la aplicación
- ✅ **Mantenible**: Fácil actualizar permisos
- ✅ **TypeScript**: Totalmente tipado
- ✅ **Flexible**: Adaptable a diferentes módulos
- ✅ **Escalable**: Fácil agregar nuevos módulos

## 🔧 Tips y Buenas Prácticas

### 1. Usar Funciones Específicas

```typescript
// ✅ Bueno - Usa función predefinida
const getTableActions = getConcessionaireActions

// ❌ Evitar - Repetir lógica
const getTableActions = async (item) => {
  // ... lógica repetida
}
```

### 2. Personalizar Solo Cuando Sea Necesario

```typescript
// ✅ Para casos estándar
const getTableActions = getUserActions

// ✅ Para casos personalizados
const getTableActions = createCustomActions(actions, permissions)
```

### 3. Mantener Consistencia en Nombres

```typescript
// ✅ Usar nombres consistentes
const permissions = {
  edit: { roles: [1, 2] },
  delete: { roles: [1] },
}

// ✅ Mantener estructura similar en todos los módulos
```

### 4. Manejo de Errores

El composable incluye manejo automático de errores:

- Si no se encuentra el rol del usuario → retorna array vacío
- Si hay error en verificación → retorna acciones seguras por defecto
- Si la función de permisos falla → captura y maneja el error

## 📝 Ejemplo Completo

```vue
<!-- UserList.vue -->
<template>
  <div>
    <CustomTable
      :data="users"
      :headers="headers"
      :actions="getTableActions"
      @action-click="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { useTableActions } from '@/composables/useTableActions'

// Usar función predefinida para usuarios
const { getUserActions } = useTableActions()
const getTableActions = getUserActions

// Manejar acciones
const handleAction = ({ actionName, item }) => {
  switch (actionName) {
    case 'edit':
      navigateToEdit(item.id)
      break
    case 'delete':
      confirmDelete(item)
      break
    case 'view':
      showUserDetails(item)
      break
  }
}
</script>
```

¡Listo! Ahora tienes un sistema robusto, centralizado y mantenible para manejar permisos de acciones en todas tus tablas.
