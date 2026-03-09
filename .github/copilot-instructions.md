# QUIC Admin Frontend — Copilot Instructions

## Arquitectura y Componentes Clave

- Proyecto Vue 3 + Vite, con Vuex para estado global y Vue Router para navegación.
- Estructura modular: cada entidad (centros, usuarios, productos, configuraciones) tiene su propio directorio en `src/views/` y rutas dedicadas en `src/router/routes/`.
- Los componentes de UI reutilizables están en `src/components/common/` (ej: `CustomTable.vue`, `ImageUploader.vue`, `ScrollableTabs.vue`).
- Los modales CRUD usan componentes genéricos (`MasterNewModal.vue`, `MasterEditModal.vue`) y se integran en cada vista de listado.
- Las vistas de listado (`List.vue`) siguen patrón: tabla, modales, paginación, búsqueda, acciones (editar, desactivar, eliminar).

## Flujos y Comandos de Desarrollo

- Instalar dependencias: `npm install`
- Desarrollo local: `npm run dev`
- Build producción: `npm run build`
- Type-check: `npm run type-check`
- Los endpoints y rutas API se definen en `src/utils/api.ts` y se acceden vía el objeto `URLS`.

## Convenciones y Patrones

- Nomenclatura TypeScript:
  - Variables y funciones: `camelCase`
  - Clases, interfaces, tipos: `PascalCase`
  - Constantes globales: `UPPER_SNAKE_CASE`
  - Enums: `PascalCase`
  - Propiedades privadas: `_camelCase`
- Los componentes de tabla usan props: `data`, `headers`, `actions`, y slots para celdas customizadas.
- Los modales CRUD reciben props para endpoint, título y callbacks, y exponen `openModal()` vía `ref`.
- Las vistas usan `DashboardLayout` y `titleSection` para consistencia visual.
- Las acciones de tabla se definen en `TABLE_ACTIONS` y se pasan como función a la tabla.
- Los formularios usan validación reactiva y feedback visual con SweetAlert2 (`useSwal`) y/o `ToastCustom`.
- Los datos de paginación y búsqueda se gestionan con `reactive` y `ref`, y se actualizan en handlers dedicados.
- Los endpoints de API se acceden siempre vía `store.dispatch('getData'|...)` y el objeto `URLS`.

## Integraciones y Comunicación

- SweetAlert2 para notificaciones y confirmaciones.
- Bootstrap 5 y Bootstrap Icons para estilos y modales.
- Multiselect (`vue-multiselect`) para selects avanzados.
- Zod para validación de formularios complejos.
- Las imágenes se gestionan con `ImageUploader.vue` y se pasan como `File` vía v-model.

## Ejemplos de Uso

- Para abrir un modal de creación:
  ```js
  const modalRef = ref()
  // ...
  modalRef.value.openModal()
  ```
- Para definir acciones de tabla:
  ```js
  const getTableActions = (item) => [
    { name: 'edit', ... },
    { name: 'delete', ... }
  ]
  ```
- Para consumir API:
  ```js
  store.dispatch('getData', { url: URLS.product.getAll })
  ```

## Archivos y Directorios Clave

- `src/views/centers/`, `src/views/settings/`, `src/views/products/`: módulos principales
- `src/components/common/`: componentes reutilizables
- `src/router/routes/`: definición de rutas por módulo
- `src/utils/api.ts`: endpoints y utilidades de API
- `src/utils/const.ts`: headers, acciones y constantes de UI
- `.prettierrc`: reglas de formato

---

¿Falta algún patrón, flujo o convención importante? Indica el módulo o archivo y lo agrego.
