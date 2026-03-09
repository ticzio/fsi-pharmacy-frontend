# buttonConst

## Ubicación

`src/const/buttonConst.ts`

## Descripción

Define la configuración de botones reutilizables en la aplicación, incluyendo iconos, clases CSS y tooltips por contexto.

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna

## Exports

### `ButtonConfig` (Type)

```ts
export type ButtonConfig = {
  tooltipTitle: string
}
```

### `ButtonKey` (Type)

```ts
export type ButtonKey = keyof typeof BUTTON_TOOLTIPS
```

### `BUTTONS_TOOLTIPS`

Tooltips por contexto para botones de "nuevo".

```ts
export const BUTTONS_TOOLTIPS: Record<ButtonKey, ButtonConfig>
```

| Key                     | Tooltip                          |
| ----------------------- | -------------------------------- |
| `filter`                | Limpiar filtros y recargar tabla |
| `concessionaire`        | Nuevo concesionario              |
| `company`               | Nueva empresa                    |
| `client`                | Nuevo cliente                    |
| `vehicle`               | Nuevo vehículo                   |
| `administrator`         | Nuevo gerente                    |
| `news`                  | Nueva noticia                    |
| `notification`          | Nueva notificación               |
| `cities`                | Nueva ciudad                     |
| `role`                  | Nuevo rol                        |
| `state`                 | Nuevo estado                     |
| `typeEnvironment`       | Nuevo tipo de entorno            |
| `typeFuel`              | Nuevo tipo de combustible        |
| `typeTransmission`      | Nuevo tipo de transmisión        |
| `typeEngine`            | Nuevo tipo de motor              |
| `typeColor`             | Nuevo color                      |
| `typeBrake`             | Nuevo tipo de freno              |
| `typeVehicle`           | Nuevo tipo de vehículo           |
| `typePurchase`          | Nuevo tipo de compra             |
| `typeService`           | Nuevo tipo de servicio           |
| `typeNotification`      | Nuevo tipo de notificación       |
| `concessionaireService` | Nuevo servicio                   |

### `BUTTONS`

Configuración de estilos para tipos de botones.

```ts
export const BUTTONS = {
  new: { icon, class, tooltipPos },
  filter: { icon, class, tooltipPos },
  search: { icon, class, tooltipPos },
  update: { icon, class, tooltipPos },
  delete: { icon, class, tooltipPos, title },
}
```

| Tipo     | Icono                          | Clase CSS                    |
| -------- | ------------------------------ | ---------------------------- |
| `new`    | `bi-plus text-white`           | `btn btn-dark ...`           |
| `filter` | `bi bi-eraser-fill text-white` | `btn btn-danger ...`         |
| `search` | `bi bi-search`                 | `input-group-text ...`       |
| `update` | `bi bi-upload text-white ms-1` | `btn btn-dark ...`           |
| `delete` | `bi bi-trash3-fill`            | `btn btn-outline-danger ...` |

## Ejemplo de Uso

```ts
import { BUTTONS, BUTTONS_TOOLTIPS } from '@/const/buttonConst'

// Obtener configuración de botón "nuevo"
const newButtonConfig = BUTTONS.new
// { icon: 'bi-plus text-white', class: '...', tooltipPos: 'left' }

// Obtener tooltip para contexto "company"
const tooltip = BUTTONS_TOOLTIPS.company.tooltipTitle
// 'Nueva empresa'
```

## Usado por

- Componentes: Botones en vistas `List.vue`
- Views: Todas las vistas con acciones de crear/filtrar
