# useLocationInfo

Composable para centralizar la lógica de visualización de ubicación (ciudad, estado, dirección y enlace de Google Maps) en modales de SweetAlert2.

## Importación

```ts
import { useLocationInfo } from '@/composables/useLocationInfo'

const { showLocationInfo } = useLocationInfo()
```

## API

### `showLocationInfo(options)`

Muestra un modal con la información de ubicación.

#### Parámetros

```ts
interface LocationOptions {
  idCity: number
  title: string
  subtitle?: string
  address?: string | null
  latitude?: string | null
  longitude?: string | null
  showAddress?: boolean // default: false
  showMapsLink?: boolean // default: false
  enableCopy?: boolean // default: false
}
```

- **idCity**: ID de la ciudad (se usa para pedir los datos al backend).
- **title**: Título del modal.
- **subtitle**: Texto secundario bajo el título (opcional).
- **address**: Dirección en texto libre (opcional, se muestra solo si `showAddress` es `true`).
- **latitude / longitude**: Coordenadas para construir la URL de Google Maps.
- **showAddress**: Si es `true`, se muestra el bloque de dirección.
- **showMapsLink**: Si es `true` y hay coordenadas, se muestra el enlace de Google Maps.
- **enableCopy**: Si es `true`, se muestra un botón para copiar la URL de Google Maps al portapapeles.

### Comportamiento interno

- Usa `store.dispatch('getData', { url: `${URLS.city.prefix}/${idCity}` })` para obtener:
  - `cityInfo.name`
  - `cityInfo.state.name` (si existe)
- Construye dinámicamente un `html` con:
  - Ciudad (siempre que exista `cityInfo`).
  - Estado (si `cityInfo.state` existe).
  - Dirección (solo si `showAddress === true`).
  - Enlace de Google Maps y botón "copiar" (solo si `showMapsLink` y `enableCopy` son `true`).
- Muestra el modal mediante `swal.showConfirm`.
- Maneja errores con `swalToast.showError`.

## Ejemplos de uso

### 1. Concesionarios (con dirección, Google Maps y copiar URL)

```ts
import { useLocationInfo } from '@/composables/useLocationInfo'

const { showLocationInfo } = useLocationInfo()

const showAddressInfo = async (item: any) => {
  const address = item.address || 'Sin dirección registrada'

  await showLocationInfo({
    idCity: item.id_city,
    title: 'Ubicación del concesionario',
    subtitle: 'Revisa la información de ubicación:',
    address,
    latitude: item.latitude,
    longitude: item.longitude,
    showAddress: true,
    showMapsLink: true,
    enableCopy: true,
  })
}
```

### 2. Clientes de empresa (solo ciudad y estado)

```ts
import { useLocationInfo } from '@/composables/useLocationInfo'

const { showLocationInfo } = useLocationInfo()

const showAddressInfo = async (idCity: number) => {
  await showLocationInfo({
    idCity,
    title: 'Ubicación del cliente',
    showAddress: false,
    showMapsLink: false,
    enableCopy: false,
  })
}
```

## Casos de uso recomendados

- Listados donde tengas una columna "Ubicación" / "Ciudad - Estado" que abra un modal.
- Vistas donde necesites reutilizar el mismo patrón de ciudad + estado + enlace de Google Maps.
- Cualquier nueva entidad que tenga `id_city`, `latitude`, `longitude` y quieras un modal uniforme.

## Notas

- El composable asume que existe un endpoint `city/{id}` expuesto en `URLS.city.prefix`.
- El texto de los botones y estilos visuales se apoyan en tu configuración actual de SweetAlert2 y Bootstrap.
