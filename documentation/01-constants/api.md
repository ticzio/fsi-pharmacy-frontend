# api

## Ubicación

`src/const/api.ts`

## Descripción

Define los endpoints de la API de forma dinámica usando una función constructora. Cada recurso obtiene automáticamente los endpoints estándar: `prefix`, `save`, `update`, `changeStatus` y `getAll`.

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna

## Exports

### `URLS`

Objeto generado dinámicamente con los endpoints de cada recurso.

```ts
export const URLS: {
  [resource: string]: {
    prefix: string
    save: string
    update: string
    changeStatus: string
    getAll: string
  }
}
```

## Recursos Disponibles

| Key                     | Prefix                   |
| ----------------------- | ------------------------ |
| `concessionaire`        | `concessionaire`         |
| `daySchedule`           | `day_schedule`           |
| `administrator`         | `admin`                  |
| `user`                  | `user`                   |
| `userConcessionaire`    | `user_concessionaire`    |
| `state`                 | `state`                  |
| `city`                  | `city`                   |
| `role`                  | `role`                   |
| `typeEnvironment`       | `type_environment`       |
| `typeFuel`              | `type_fuel`              |
| `notification`          | `notification`           |
| `typeTransmission`      | `type_transmission`      |
| `typeEngine`            | `type_engine`            |
| `typeColor`             | `type_color`             |
| `typeBrake`             | `type_brake`             |
| `typeVehicle`           | `type_vehicle`           |
| `typePurchase`          | `type_purchase`          |
| `typeService`           | `type_service`           |
| `vehicleModel`          | `vehicle_model`          |
| `typeNotification`      | `type_notification`      |
| `vehicleModelImage`     | `vehicle_model_image`    |
| `vehicleModelColor`     | `vehicle_model_color`    |
| `exhibition`            | `exhibition`             |
| `news`                  | `new`                    |
| `company`               | `company`                |
| `client`                | `client`                 |
| `clientVehicle`         | `client_vehicle`         |
| `concessionaireService` | `concessionaire_service` |

## Ejemplo de Uso

```ts
import { URLS } from '@/const/api'

// Obtener todos los concesionarios
store.dispatch('getData', { url: URLS.concessionaire.getAll })

// Guardar un nuevo cliente
store.dispatch('postData', { url: URLS.client.save, data: clientData })

// Actualizar una ciudad
store.dispatch('putData', { url: URLS.city.update, data: cityData })

// Cambiar estado de un usuario
store.dispatch('putData', { url: URLS.user.changeStatus, data: { id, active } })
```

## Usado por

- Composables: `useLocationInfo`
- Views: Todas las vistas que hacen peticiones al backend
- Store: Acciones de Vuex
