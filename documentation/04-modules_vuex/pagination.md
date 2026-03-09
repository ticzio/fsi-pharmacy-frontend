# Módulo Vuex: `pagination`

## Propósito

El módulo **`pagination`** centraliza el estado de paginación por tabla/vista para evitar que se pierda la página actual al navegar a otra vista (por ejemplo: entrar a detalle y volver).

- El estado **se mantiene durante la navegación** (sesión en runtime).
- El estado **NO persiste** si recargas la página.

## Ubicación

```
documentation/modules_vuex/pagination.md
src/store/modules/pagination.ts
src/store/index.ts
```

## Registro en el Store

El módulo está registrado en `src/store/index.ts` dentro de `modules` con el nombre:

- `pagination`

Por lo tanto, se usa con namespace:

- Getters: `pagination/<getter>`
- Actions: `pagination/<action>`

## Estructura del Estado

El estado se guarda por una **key única** (string). Cada key representa una tabla/vista.

```js
{
  pages: {
    'key-unica': {
      currentPage: 1,
      totalPages: 1,
      filters: {},
    },
  },
}
```

## Ejemplo real en este proyecto (Composition API / `<script setup>`)

Basado en:

```
src/views/notifications/List.vue
```

### Objetivo

- Recuperar la última página guardada al volver a la vista.
- Guardar `currentPage` cuando cambia la paginación.
- Guardar `totalPages` después de consultar el API.

### Ejemplo (adaptación para integrar `pagination`)

```ts
<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { TABLE_PAGINATION } from '@/const/tableConst'

const store = useStore()

// Key única por vista/tabla
const paginationKey = 'notifications-list'

const pagination = reactive({
  currentPage: TABLE_PAGINATION.currentPage,
  totalPages: TABLE_PAGINATION.totalPages,
  limit: TABLE_PAGINATION.limit,
})

const getNotifications = async () => {
  const response = await store.dispatch('getData', {
    url: '...',
    params: {
      page: pagination.currentPage,
      limit: pagination.limit,
      // otros params...
    },
  })

  // ejemplo: response.data.meta.last_page
  pagination.totalPages = response.data.meta.last_page

  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
  })
}

const handlePageChange = (page: number) => {
  pagination.currentPage = page

  store.dispatch('pagination/updatePagination', {
    key: paginationKey,
    currentPage: page,
  })

  getNotifications()
}

onMounted(() => {
  const savedPageGetter = store.getters['pagination/getPage']
  pagination.currentPage = savedPageGetter(paginationKey)
  getNotifications()
})
</script>
```

### Sugerencia Bootstrap 5 para el paginador

- Contenedor superior: `d-flex justify-content-between align-items-center`
- Componente de páginas: `pagination pagination-sm mb-0`
- Botones: `page-item` + `page-link`

## Implementación (sintaxis del proyecto)

Este proyecto maneja módulos Vuex con **objeto simple** (similar a `utils.ts` / `calendar.ts`):

```ts
const defaultEntry = () => ({
  currentPage: 1,
  totalPages: 1,
  filters: {},
})

export default {
  namespaced: true,
  state: {
    pages: {},
  },
  // mutations/actions/getters...
}
```

### Recomendación de keys

Usa claves descriptivas y únicas. Ejemplos:

- `collaborators-pending`
- `collaborators-approved`
- `request-headquarter`
- `assigned-collaborators`

También puedes usar `useRoute().name` si tus rutas tienen `name`.

## Getters disponibles

| Getter               | Parámetro | Retorna   | Descripción                                            |
| -------------------- | --------- | --------- | ------------------------------------------------------ |
| `getPage`            | `key`     | `number`  | Página actual (default: `1`)                           |
| `getTotalPages`      | `key`     | `number`  | Total de páginas (default: `1`)                        |
| `getFilters`         | `key`     | `object`  | Filtros guardados (default: `{}`)                      |
| `getPaginationState` | `key`     | `object`  | Estado completo `{ currentPage, totalPages, filters }` |
| `hasPaginationState` | `key`     | `boolean` | Indica si existe estado guardado para esa key          |

## Actions disponibles

| Action               | Payload                                        | Descripción                                   |
| -------------------- | ---------------------------------------------- | --------------------------------------------- |
| `setPage`            | `{ key, page }`                                | Establece la página actual                    |
| `setTotalPages`      | `{ key, totalPages }`                          | Establece total de páginas                    |
| `setFilters`         | `{ key, filters }`                             | Guarda filtros aplicados                      |
| `setPaginationState` | `{ key, paginationState }`                     | Reemplaza/mergea el estado de esa key         |
| `updatePagination`   | `{ key, currentPage?, totalPages?, filters? }` | Actualiza parcial (página, total y/o filtros) |
| `clearPagination`    | `key`                                          | Limpia el estado de una key                   |
| `clearAllPagination` | -                                              | Limpia todo el estado del módulo              |

## Limpieza de estado (Composition API)

### Limpieza de una tabla/vista

```ts
store.dispatch('pagination/clearPagination', paginationKey)
```

### Limpieza total (por ejemplo, al cerrar sesión)

```ts
store.dispatch('pagination/clearAllPagination')
```
