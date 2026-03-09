# Composable `useMultiselectIcons`

Un composable flexible y reutilizable para manejar iconos dinámicos en componentes `MultiselectCustom`. Permite generar mapas de iconos y descripciones para cualquier tipo de datos de forma centralizada.

## 📁 Archivo

`src/composables/useMultiselectIcons.ts`

## 🚀 Instalación y Uso

### 1. Importar el composable

```typescript
import { useMultiselectIcons } from '@/composables/useMultiselectIcons'
```

### 2. Inicializar en tu componente

```typescript
// En tu componente Vue
const { updateIconMaps, clearIconMaps, createIconMaps } = useMultiselectIcons()

// Variables reactivas para los mapas
const customIconMap = ref<Record<string, string>>({})
const customDescriptionMap = ref<Record<string, string>>({})
```

## 🎯 Funciones Principales

### `updateIconMaps()`

Actualiza mapas de iconos existentes de forma reactiva.

```typescript
updateIconMaps(
  iconMapRef,           // Ref<Record<string, string>>
  descriptionMapRef,    // Ref<Record<string, string>>
  data,                 // any[] - Datos del backend
  icon,                 // string - Icono a usar
  options?              // MultiselectIconOptions (opcional)
)
```

**Parámetros:**

- `iconMapRef`: Referencia reactiva al mapa de iconos
- `descriptionMapRef`: Referencia reactiva al mapa de descripciones
- `data`: Array de datos del backend
- `icon`: Icono Bootstrap a aplicar
- `options`: Configuración adicional

### `clearIconMaps()`

Limpia los mapas de iconos y descripciones.

```typescript
clearIconMaps(iconMapRef, descriptionMapRef)
```

### `createIconMaps()`

Crea nuevos mapas de iconos (para casos donde no existen referencias previas).

```typescript
const { iconMap, descriptionMap } = createIconMaps(
  data,
  icon,
  options?
)
```

## ⚙️ Opciones de Configuración

### `MultiselectIconOptions`

```typescript
interface MultiselectIconOptions {
  dataKey?: string // 'name', 'nombre', 'title', etc. (default: 'name')
  descriptionPrefix?: string // 'Estado:', 'Ciudad:', 'Rol:', etc.
  defaultIcon?: string // Icono por defecto (default: el icono proporcionado)
}
```

## 📚 Ejemplos de Uso

### Ejemplo 1: Estados y Ciudades

```typescript
// Para estados
updateIconMaps(customIconMapState, customDescriptionMapState, response.data, 'bi bi-map', {
  dataKey: 'name',
  descriptionPrefix: 'Estado:',
})

// Para ciudades
updateIconMaps(customIconMapCity, customDescriptionMapCity, response.data, 'bi bi-building', {
  dataKey: 'name',
  descriptionPrefix: 'Ciudad:',
})
```

### Ejemplo 2: Roles de Usuario

```typescript
updateIconMaps(roleIconMap, roleDescriptionMap, rolesData, 'bi bi-person-badge', {
  dataKey: 'name',
  descriptionPrefix: 'Rol:',
})
```

### Ejemplo 3: Estados del Sistema

```typescript
updateIconMaps(statusIconMap, statusDescriptionMap, statusData, 'bi bi-circle-fill', {
  dataKey: 'status',
  descriptionPrefix: 'Estado:',
})
```

### Ejemplo 4: Datos con Estructura Diferente

```typescript
// Si los datos usan 'nombre' en lugar de 'name'
updateIconMaps(categoryIconMap, categoryDescriptionMap, categoriesData, 'bi bi-tag', {
  dataKey: 'nombre', // <- Usar 'nombre' en lugar de 'name'
  descriptionPrefix: 'Categoría:',
})
```

## 🎨 Funciones Especializadas

### `createLocationMaps()`

Función preconfigurada para ubicaciones (estados y ciudades).

```typescript
const { stateIconMap, stateDescriptionMap, cityIconMap, cityDescriptionMap } = createLocationMaps(
  statesData,
  citiesData
)
```

### `createCustomMaps()`

Para casos con iconos diferentes por elemento.

```typescript
const iconMapping = {
  Administrador: 'bi bi-shield-check',
  Editor: 'bi bi-pencil-square',
  Viewer: 'bi bi-eye',
}

const { iconMap, descriptionMap } = createCustomMaps(rolesData, iconMapping, {
  descriptionPrefix: 'Rol:',
})
```

## 🔄 Integración con MultiselectCustom

```vue
<template>
  <MultiselectCustom
    v-model="selectedItem"
    :options="items"
    placeholder="Seleccionar opción"
    helper-type="custom"
    variant="primary"
    :custom-icon-map="customIconMap"
    :custom-description-map="customDescriptionMap"
  />
</template>

<script setup lang="ts">
import { useMultiselectIcons } from '@/composables/useMultiselectIcons'

const { updateIconMaps } = useMultiselectIcons()
const customIconMap = ref<Record<string, string>>({})
const customDescriptionMap = ref<Record<string, string>>({})

const loadItems = async () => {
  const response = await getItemsFromAPI()
  items.value = response.data

  updateIconMaps(customIconMap, customDescriptionMap, response.data, 'bi bi-circle', {
    descriptionPrefix: 'Item:',
  })
}
</script>
```

## 🛠️ Casos de Uso Avanzados

### Limpiar mapas al cambiar de contexto

```typescript
// Cuando cambia el estado seleccionado
watch(selectedState, (newValue) => {
  if (!newValue) {
    clearIconMaps(cityIconMap, cityDescriptionMap)
    cities.value = []
  }
})
```

### Múltiples tipos de datos en un mismo componente

```typescript
// Estados
const { updateIconMaps } = useMultiselectIcons()

// Roles
const roleIconMap = ref<Record<string, string>>({})
const roleDescriptionMap = ref<Record<string, string>>({})

// Categorías
const categoryIconMap = ref<Record<string, string>>({})
const categoryDescriptionMap = ref<Record<string, string>>({})

// Cargar cada tipo con su configuración específica
updateIconMaps(roleIconMap, roleDescriptionMap, roles, 'bi bi-person', {
  descriptionPrefix: 'Rol:',
})
updateIconMaps(categoryIconMap, categoryDescriptionMap, categories, 'bi bi-tag', {
  descriptionPrefix: 'Categoría:',
})
```

## ✅ Ventajas

- ✅ **Reutilizable**: Usarlo en cualquier componente con multiselects
- ✅ **Flexible**: Adaptable a cualquier estructura de datos
- ✅ **Centralizado**: Lógica unificada para manejo de iconos
- ✅ **TypeScript**: Totalmente tipado
- ✅ **Reactivo**: Actualizaciones automáticas en la UI
- ✅ **Configurable**: Opciones para diferentes casos de uso

## 🔧 Tips y Buenas Prácticas

1. **Usar constantes de iconos**: Define tus iconos en archivos constantes
2. **Ser consistente con dataKey**: Usa la misma propiedad para datos similares
3. **Limpiar mapas**: Usa `clearIconMaps()` cuando cambie el contexto
4. **Descripciones claras**: Usa prefijos descriptivos ('Estado:', 'Rol:', etc.)

## 📝 Ejemplo Completo

```typescript
// constants/iconConstants.ts
export const ICONS = {
  STATE: 'bi bi-map',
  CITY: 'bi bi-building',
  ROLE: 'bi bi-person-badge',
  STATUS: 'bi bi-circle-fill',
}

// En tu componente
import { useMultiselectIcons } from '@/composables/useMultiselectIcons'
import { ICONS } from '@/constants/iconConstants'

const { updateIconMaps, clearIconMaps } = useMultiselectIcons()

const loadStates = async () => {
  const response = await api.getStates()
  states.value = response.data

  updateIconMaps(stateIconMap, stateDescriptionMap, response.data, ICONS.STATE, {
    dataKey: 'name',
    descriptionPrefix: 'Estado:',
  })
}
```

¡Listo! Ahora tienes un sistema robusto y flexible para manejar iconos dinámicos en todos tus multiselects.
