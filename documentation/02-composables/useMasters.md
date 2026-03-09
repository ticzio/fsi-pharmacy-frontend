# `useMasters`

## Propósito

`useMasters` es un composable que centraliza la carga de **maestros** usados frecuentemente en multiselects:

- Estados (`states`)
- Ciudades (`cities`)
- Roles (`roles`)

Además, genera y mantiene los mapas requeridos por `MultiselectCustom`:

- `customIconMap*`
- `customDescriptionMap*`

Con esto se evita repetir en cada vista:

- `store.dispatch('getData', { url: URLS.*.getAll })`
- Manejo de errores con `useSwalToast`
- Logging con `useLogger`
- Creación/limpieza de iconos/descripciones con `useMultiselectIcons`

## Ubicación

`src/composables/Masters/useMasters.ts`

## Dependencias

- Vue: `ref`
- Vuex: `useStore()`
- `useSwalToast()`
- `useLogger()`
- `useMultiselectIcons()`
- Constantes: `URLS`, `ERROR`, `ICONS_MULTISELECT`

## API

### Estado reactivo

#### Estados

- `states: Ref<any[]>`
- `customIconMapState: Ref<Record<string, string>>`
- `customDescriptionMapState: Ref<Record<string, string>>`
- `isLoadingStates: Ref<boolean>`

#### Ciudades

- `cities: Ref<any[]>`
- `customIconMapCity: Ref<Record<string, string>>`
- `customDescriptionMapCity: Ref<Record<string, string>>`
- `isLoadingCities: Ref<boolean>`

#### Roles

- `roles: Ref<any[]>`
- `customIconMapRole: Ref<Record<string, string>>`
- `customDescriptionMapRole: Ref<Record<string, string>>`
- `isLoadingRoles: Ref<boolean>`

### Funciones

#### `getStates(): Promise<any[]>`

Obtiene todos los estados desde `URLS.state.getAll` y actualiza:

- `states`
- `customIconMapState`
- `customDescriptionMapState`

Maneja:

- `isLoadingStates`
- Error toast: `${ERROR.errorGet} estados`
- Log request con `logger.logRequest`

#### `getCities(idState?: number | null): Promise<any[]>`

Obtiene ciudades desde `URLS.city.getAll`.

- Si `idState` viene definido y es truthy, envía `params: { id_state: idState }`.
- Si no, envía `params: {}` (trae todas las ciudades si el backend lo permite).

Actualiza:

- `cities`
- `customIconMapCity`
- `customDescriptionMapCity`

Maneja:

- `isLoadingCities`
- Error toast: `${ERROR.errorGet} ciudades`

Nota: en vistas donde `selectedState.id` puede venir como `string`, conviene llamar:

- `await getCities(Number(selectedState.value.id))`

#### `clearCities(): void`

Limpia `cities` y resetea:

- `customIconMapCity`
- `customDescriptionMapCity`

Uso típico: cuando el usuario limpia el estado seleccionado.

#### `getRoles(params?: Record<string, any>): Promise<any[]>`

Obtiene roles desde `URLS.role.getAll` con parámetros opcionales.

Ejemplos de params:

- `{ type_role: 1 }`
- `{ id_type_environment: 1 }`
- `{ id_type_environment: 2 }`

Actualiza:

- `roles`
- `customIconMapRole`
- `customDescriptionMapRole`

Maneja:

- `isLoadingRoles`
- Error toast: `${ERROR.errorGet} roles`

## Ejemplos de uso

### 1) Estados + Ciudades (dependientes)

```ts
import { ref, onMounted, watch } from 'vue'
import { useMasters } from '@/composables/Masters/useMasters'

const {
  states,
  customIconMapState,
  customDescriptionMapState,
  getStates,
  cities,
  customIconMapCity,
  customDescriptionMapCity,
  getCities,
  clearCities,
} = useMasters()

const selectedState = ref<any>(null)
const selectedCity = ref<any>(null)

const handleStateChange = async () => {
  selectedCity.value = null
  if (selectedState.value?.id) {
    await getCities(Number(selectedState.value.id))
  } else {
    clearCities()
  }
}

onMounted(async () => {
  await getStates()
})

watch(selectedState, () => {
  handleStateChange()
})
```

#### En template con `MultiselectCustom`

```vue
<MultiselectCustom
  v-model="selectedState"
  :options="states"
  placeholder="Seleccionar estado"
  helper-type="custom"
  variant="primary"
  :custom-icon-map="customIconMapState"
  :custom-description-map="customDescriptionMapState"
  @select="handleStateChange"
/>

<MultiselectCustom
  v-model="selectedCity"
  :options="cities"
  placeholder="Seleccionar ciudad"
  helper-type="custom"
  variant="primary"
  :custom-icon-map="customIconMapCity"
  :custom-description-map="customDescriptionMapCity"
  :disabled="!selectedState"
/>
```

### 2) Roles con parámetros

```ts
import { onMounted } from 'vue'
import { useMasters } from '@/composables/Masters/useMasters'

const { roles, customIconMapRole, customDescriptionMapRole, getRoles } = useMasters()

onMounted(async () => {
  await getRoles({ id_type_environment: 1 })
})
```

## Buenas prácticas / notas

- **Evitar doble llamada**: si usas `@select="handleStateChange"` y también `watch(selectedState, ...)`, normalmente vas a disparar 2 veces. Mantén solo 1. (En el proyecto se está usando `watch` + `handleStateChange()`.)
- **Conversión a número**: si `id` viene como `string`, usa `Number(id)` antes de llamar `getCities`.
- **Limpieza**: cuando el estado se limpia, llama `clearCities()` para evitar que queden ciudades viejas.

## Sugerencias de layout con Bootstrap 5 (para formularios con multiselects)

- **Contenedor**: `container` o `container-fluid`
- **Grid**: `row g-3` + `col-12 col-md-6` (2 columnas en desktop)
- **Alineación de acciones**: `d-flex justify-content-end gap-2`
- **Input group** (buscar): `input-group` + `rounded-pill`
- **Tarjetas/secciones**: `border rounded-4 p-3` o `shadow-sm`
