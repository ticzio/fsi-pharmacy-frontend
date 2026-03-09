# multiselectConst

## Ubicación

`src/const/multiselectConst.ts`

## Descripción

Define los iconos Bootstrap Icons que se muestran junto a las opciones en componentes multiselect.

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna

## Exports

### `ICONS_MULTISELECT`

```ts
export const ICONS_MULTISELECT = {
  state: 'bi bi-map',
  city: 'bi bi-building',
  role: 'bi bi-person-workspace',
  services: 'bi bi-gear-fill',
  engine: 'bi bi-lightning-fill',
  brake: 'bi bi-disc-fill',
  vehicleModel: 'bi bi-car-front',
  transmission: 'bi bi-gear-fill',
  typeVehicle: 'bi bi-truck-front-fill',
  notification: 'bi bi-envelope',
}
```

| Key            | Icono                    | Uso                        |
| -------------- | ------------------------ | -------------------------- |
| `state`        | `bi bi-map`              | Selector de estados        |
| `city`         | `bi bi-building`         | Selector de ciudades       |
| `role`         | `bi bi-person-workspace` | Selector de roles          |
| `services`     | `bi bi-gear-fill`        | Selector de servicios      |
| `engine`       | `bi bi-lightning-fill`   | Selector de motores        |
| `brake`        | `bi bi-disc-fill`        | Selector de frenos         |
| `vehicleModel` | `bi bi-car-front`        | Selector de modelos        |
| `transmission` | `bi bi-gear-fill`        | Selector de transmisión    |
| `typeVehicle`  | `bi bi-truck-front-fill` | Selector de tipo vehículo  |
| `notification` | `bi bi-envelope`         | Selector de notificaciones |

## Ejemplo de Uso

```ts
import { ICONS_MULTISELECT } from '@/const/multiselectConst'

// Obtener icono para selector de ciudades
const cityIcon = ICONS_MULTISELECT.city
// 'bi bi-building'
```

## Usado por

- Composables: `useMultiselectIcons`
- Componentes: Multiselect con iconos
