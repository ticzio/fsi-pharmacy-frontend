# CustomTable

Componente de tabla reutilizable y extensible. Maneja la visualización de datos tabulares con soporte para:

- Encabezados configurables
- Acciones por fila (síncronas, dinámicas y asíncronas)
- Slots de celda para renderizado personalizado
- Paginación integrada
- Estado de carga (loading overlay)
- Estado vacío automático

---

## Arquitectura

El componente está dividido en cuatro archivos dentro de `src/components/common/`:

```
CustomTable.vue                  ← Coordinador principal (lógica + estado)
CustomTable/
  ├── TableHeader.vue            ← Renderiza el <thead>
  ├── TableBody.vue              ← Renderiza el <tbody> y acciones por fila
  └── TablePagination.vue        ← Renderiza la navegación de páginas
```

`CustomTable.vue` actúa como un **orquestador**: mantiene todo el estado reactivo y delega el renderizado a los tres sub-componentes. Los slots definidos por el consumidor se reenvían automáticamente hacia `TableBody` usando el patrón de slot forwarding de Vue.

---

## Props

| Prop             | Tipo                                                                | Default | Descripción                                                                |
| ---------------- | ------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `data`           | `EntityItem[]`                                                      | —       | **Requerido.** Array de objetos a mostrar. Cada objeto debe tener un `id`. |
| `headers`        | `Header[]`                                                          | `[]`    | Configuración de columnas. Ver tipo `Header` más abajo.                    |
| `actions`        | `Action[]` \| `(item) => Action[]` \| `(item) => Promise<Action[]>` | `[]`    | Acciones por fila. Acepta array estático, función síncrona o asíncrona.    |
| `currentPage`    | `number`                                                            | `1`     | Página actualmente activa.                                                 |
| `totalPages`     | `number`                                                            | `1`     | Total de páginas disponibles.                                              |
| `maxPagesToShow` | `number`                                                            | `5`     | Máximo de botones de página visibles en la paginación.                     |
| `isLoading`      | `boolean`                                                           | `false` | Muestra un overlay spinner sobre la tabla.                                 |
| `hidePagination` | `boolean`                                                           | `false` | Oculta completamente el componente de paginación.                          |

### Tipo `Header`

```ts
interface Header {
  key: string // Clave del campo en el objeto de datos (soporta notación punto: "address.city")
  label: string // Texto visible en el encabezado de la columna
}
```

### Tipo `Action`

```ts
interface Action {
  name: string // Identificador del evento al hacer clic (ej: 'edit', 'delete')
  icon: string // Clase CSS del ícono Bootstrap Icons (ej: 'bi-pencil-fill')
  class: string // Clases CSS aplicadas al botón (ej: 'btn btn-sm btn-outline-primary')
  tooltip?: string // Texto del tooltip al hacer hover
}
```

### Tipo `EntityItem`

```ts
interface EntityItem {
  id: string | number
  [key: string]: any
}
```

---

## Eventos

| Evento         | Payload                                    | Descripción                                               |
| -------------- | ------------------------------------------ | --------------------------------------------------------- |
| `change-page`  | `page: number`                             | Se emite al hacer clic en un botón de paginación.         |
| `action-click` | `{ actionName: string; item: EntityItem }` | Se emite al hacer clic en un botón de acción de una fila. |
| `row-click`    | `item: EntityItem`                         | Se emite al hacer clic en cualquier fila de la tabla.     |

---

## Slots

Los slots permiten personalizar el contenido de cualquier celda sin modificar el componente.

### `#cell({key})`

Reemplaza el renderizado de la celda para la columna indicada por `{key}`.

**Slot props disponibles:**

| Prop    | Tipo         | Descripción                                       |
| ------- | ------------ | ------------------------------------------------- |
| `value` | `any`        | Valor de la celda (equivale a `item[header.key]`) |
| `item`  | `EntityItem` | Objeto completo de la fila                        |

```vue
<!-- Personalizar la celda de la columna "price" -->
<template #cell(price)="{ value }">
  <span class="fw-bold text-success">${{ value.toFixed(2) }}</span>
</template>

<!-- Personalizar usando el item completo (columna "address") -->
<template #cell(address)="{ item }">
  <button class="btn btn-sm btn-primary" @click="showMap(item)">
    <i class="bi bi-geo-alt-fill"></i>
  </button>
</template>
```

> **Nota:** Si no se define un slot para una columna, se muestra el valor tal cual (o `-` si es nulo). Las claves con notación punto (ej: `"address.city"`) son resueltas automáticamente por la función `getNestedValue`.

---

## Acciones por fila

La prop `actions` acepta tres formas:

### 1. Array estático (mismas acciones para todas las filas)

```ts
const actions = [
  {
    name: 'edit',
    icon: 'bi-pencil-fill',
    class: 'btn btn-sm btn-outline-primary',
    tooltip: 'Editar',
  },
  {
    name: 'delete',
    icon: 'bi-trash-fill',
    class: 'btn btn-sm btn-outline-danger',
    tooltip: 'Eliminar',
  },
]
```

### 2. Función síncrona (acciones condicionales por fila)

```ts
const actions = (item: EntityItem): Action[] => {
  const base = [{ name: 'edit', icon: 'bi-pencil-fill', class: 'btn btn-sm btn-outline-primary' }]
  if (item.active) {
    base.push({ name: 'delete', icon: 'bi-trash-fill', class: 'btn btn-sm btn-outline-danger' })
  }
  return base
}
```

### 3. Función asíncrona (acciones calculadas desde una API/composable)

```ts
const actions = async (item: EntityItem): Promise<Action[]> => {
  return await getDefaultActions(item) // ej: composable useTableActions
}
```

> Cuando se usa una función asíncrona, la tabla muestra un spinner mientras se resuelven las acciones para cada fila, y las cachea para evitar re-fetching.

---

## Paginación

La paginación es responsabilidad del componente padre. `CustomTable` solo muestra los botones y emite `change-page`. El padre debe paginar sus datos:

```ts
const pagination = reactive({ currentPage: 1, totalPages: 10, limit: 15 })

const handlePageChange = (page: number) => {
  pagination.currentPage = page
}
```

```vue
<CustomTable
  :current-page="pagination.currentPage"
  :total-pages="pagination.totalPages"
  @change-page="handlePageChange"
/>
```

Para ocultar la paginación en tablas cortas:

```vue
<CustomTable :hide-pagination="true" ... />
```

---

## Ejemplo completo de uso

Tomado del componente real `src/views/pharmacy/List.vue`:

```vue
<CustomTable
  :data="concessionaires"
  :headers="TABLE_HEADERS.concessionaire"
  :actions="getTableActions"
  :is-loading="loading"
  :current-page="pagination.currentPage"
  :total-pages="pagination.totalPages"
  @change-page="handleTablePagination"
  @action-click="handleTableAction"
>
  <!-- Logo del concesionario -->
  <template #cell(url_logo)="{ value }">
    <img
      :src="value || defaultProfileImage"
      class="img-fluid object-fit-cover rounded-pill"
      style="width: 50px; height: 50px"
      @error="(e) => (e.target.src = defaultProfileImage)"
    />
  </template>

  <!-- Estado activo/inactivo -->
  <template #cell(active)="{ value }">
    <StatusBadge :value="value" />
  </template>

  <!-- Botón de mapa para la dirección -->
  <template #cell(address)="{ item }">
    <button class="btn btn-sm btn-primary rounded-pill" @click="showAddressInfo(item)">
      <i class="bi bi-geo-alt-fill"></i>
    </button>
  </template>
</CustomTable>
```

```ts
// Acciones asíncronas usando composable
const getTableActions = async (item: any) => {
  return getDefaultActions(item)
}

// Handler de acciones
const handleTableAction = ({ actionName, item }) => {
  if (actionName === 'edit') {
    if (!item.active) {
      swalToast.showError(ERROR.errorEdited)
      return
    }
    router.push(`/concessionaire/edit/${item.id}/detail-concessionaire`)
  }
}
```

---

## Comportamiento interno de carga de acciones asíncronas

Cuando `actions` es una función que retorna una `Promise`, `CustomTable` sigue este flujo:

```
Primera renderización de cada fila
        │
        ▼
¿Están las acciones cacheadas?
   ├─ Sí → Retornar acciones del caché
   └─ No → Marcar item como "cargando" y llamar a la función
               │
               ▼
        Resolver Promise
               │
        ┌──────┴──────┐
        ▼             ▼
     Éxito          Error
   Cachear      Asignar []
   acciones    Limpiar flag
```

El caché se limpia automáticamente cuando la prop `data` cambia (`watch` profundo).

---

## Sub-componentes internos

Estos componentes **no deben usarse directamente** fuera de `CustomTable`. Son detalles de implementación del sistema de tabla.

| Componente            | Responsabilidad                                                       |
| --------------------- | --------------------------------------------------------------------- |
| `TableHeader.vue`     | Renderiza `<thead>` con los encabezados y la columna "Acciones"       |
| `TableBody.vue`       | Renderiza `<tbody>`, estado vacío, slots de celda y botones de acción |
| `TablePagination.vue` | Renderiza los controles de paginación con elipsis adaptativa          |
