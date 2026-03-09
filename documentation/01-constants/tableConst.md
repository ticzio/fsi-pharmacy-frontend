# tableConst

## Ubicación

`src/const/tableConst.ts`

## Descripción

Configuración centralizada para tablas: títulos de secciones, headers de columnas, paginación y acciones. Incluye lógica para mostrar columna ID solo en entornos de desarrollo.

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna

## Exports

### `TITLE_SECTION_COMPONENT`

Títulos y descripciones por módulo para las secciones de la aplicación.

```ts
export const TITLE_SECTION_COMPONENT = {
  concessionaire: { title, description, details, new, newDescription },
  company: { title, description, details, stepOne, stepOneDetails, new, newDescription },
  administrator: { title, description },
  client: { title, description },
  vehicle: { title, description },
  exhibition: { title, description, new, newDescription, edit, editDescription },
  news: { title, description, new, newDescription, edit, editDescription },
  notification: { title, description },
  settings: { title, description },
  states: { title, description },
  cities: { title, description },
  roles: { title, description },
  typeEnvironment: { title, description },
  typeFuel: { title, description },
  typeTransmission: { title, description },
  typeService: { title, description },
  typeNotification: { title, description },
  typeEngine: { title, description },
  typeColor: { title, description },
  typeBrake: { title, description },
  typeVehicle: { title, description },
  typePurchase: { title, description },
  concessionaireService: { title, description },
}
```

### `TitleSectionKey` (Type)

```ts
export type TitleSectionKey = keyof typeof TITLE_SECTION_COMPONENT
```

### `TABLE_HEADERS`

Headers de columnas para cada tipo de tabla.

```ts
export const TABLE_HEADERS = {
  concessionaire: [{ key, label }, ...],
  company: [...],
  administrator: [...],
  user: [...],
  companyClients: [...],
  client: [...],
  vehicle: [...],
  exhibition: [...],
  imageExhibition: [...],
  notifications: [...],
  news: [...],
  cities: [...],
  states: [...],
  roles: [...],
  typeEnvironment: [...],
  // ... más tipos
}
```

**Nota**: La columna `ID` solo se muestra en dominios de desarrollo (`localhost:517`, `localhost:417` o `VITE_DOMAIN_DEVELOP`).

### `TABLE_PAGINATION`

Configuración por defecto de paginación.

```ts
export const TABLE_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  limit: 10,
}
```

### `TABLE_ACTIONS`

Configuración de acciones disponibles en tablas.

```ts
export const TABLE_ACTIONS = {
  new: { name, icon, class, tooltip },
  edit: { name, icon, class, tooltip },
  delete: { name, icon, class, tooltip },
  deactivate: { name, icon, class, tooltip },
}
```

| Acción       | Icono                          | Tooltip      |
| ------------ | ------------------------------ | ------------ |
| `new`        | `bi-plus fs-5`                 | Nuevo        |
| `edit`       | `bi-list fs-5`                 | Ver detalles |
| `delete`     | `bi bi-trash3-fill fs-5`       | Eliminar     |
| `deactivate` | `bi bi-check-circle-fill fs-5` | Desactivar   |

## Ejemplo de Uso

```ts
import { TITLE_SECTION_COMPONENT, TABLE_HEADERS, TABLE_PAGINATION } from '@/const/tableConst'

// Obtener título de sección
const title = TITLE_SECTION_COMPONENT.concessionaire.title
// 'Concesionario'

// Obtener headers para tabla de clientes
const headers = TABLE_HEADERS.client
// [{ key: 'id', label: 'ID' }, { key: 'code', label: 'Código' }, ...]

// Inicializar paginación
const pagination = { ...TABLE_PAGINATION }
```

## Usado por

- Componentes: `CustomTable`, `StatusBadge`
- Views: Todas las vistas `List.vue`
- Composables: `useTableActions`
