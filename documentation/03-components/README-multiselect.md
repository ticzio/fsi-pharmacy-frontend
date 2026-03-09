# Sistema de Multiselect Reutilizable

Este sistema te permite usar `vue-multiselect` con estilos consistentes y funcionalidades avanzadas en todo tu proyecto.

## 📁 Archivos creados

- `src/composables/useMultiselect.ts` - Composable con configuraciones y helpers
- `src/assets/styles/multiselect-custom.css` - Estilos CSS reutilizables
- `src/components/common/MultiselectCustom.vue` - Componente wrapper (opcional)

## 🚀 Uso básico

### 1. Importar el composable

```ts
import { useMultiselectDefaults, useRoleHelpers } from '@/composables/useMultiselect'

// En tu componente
const { defaultProps, defaultClasses } = useMultiselectDefaults()
const { getRoleIcon, getRoleDescription } = useRoleHelpers()
```

### 2. Importar estilos CSS

```vue
<style scoped>
@import '@/assets/styles/multiselect-custom.css';
</style>
```

### 3. Usar en el template

```vue
<Multiselect
  v-model="form.id_role"
  :options="roles"
  placeholder="Seleccionar rol"
  :track-by="defaultProps.trackBy"
  :label="defaultProps.label"
  :class="defaultClasses.container"
  :close-on-select="defaultProps.closeOnSelect"
  :clear-on-select="defaultProps.clearOnSelect"
  :searchable="defaultProps.searchable"
  :allow-empty="defaultProps.allowEmpty"
>
  <!-- Opciones con iconos -->
  <template #option="{ option }">
    <div class="d-flex align-items-center py-1">
      <div class="me-3">
        <i :class="getRoleIcon(option.name)" class="fs-5 text-primary"></i>
      </div>
      <div class="flex-grow-1">
        <div class="fw-medium text-dark">{{ option.name }}</div>
        <small class="text-muted">{{ getRoleDescription(option.name) }}</small>
      </div>
    </div>
  </template>

  <!-- Label seleccionado -->
  <template #singleLabel="{ option }">
    <div class="d-flex align-items-center">
      <i :class="getRoleIcon(option.name)" class="me-2 text-primary"></i>
      <span class="fw-medium">{{ option.name }}</span>
    </div>
  </template>
</Multiselect>
```

## 🎨 Variantes de color

Puedes usar diferentes variantes añadiendo clases:

```vue
<!-- Azul (por defecto) -->
<Multiselect :class="defaultClasses.container" />

<!-- Verde -->
<Multiselect :class="[defaultClasses.container, 'multiselect-success']" />

<!-- Amarillo -->
<Multiselect :class="[defaultClasses.container, 'multiselect-warning']" />

<!-- Rojo -->
<Multiselect :class="[defaultClasses.container, 'multiselect-danger']" />
```

## 🔧 Helpers personalizados

Para otros tipos de opciones (no roles), puedes crear helpers personalizados:

```ts
import { useCustomHelpers } from '@/composables/useMultiselect'

// Mapas personalizados
const statusIcons = {
  Activo: 'bi bi-check-circle-fill',
  Inactivo: 'bi bi-x-circle-fill',
  Pendiente: 'bi bi-clock-fill',
}

const statusDescriptions = {
  Activo: 'Estado operativo normal',
  Inactivo: 'Temporalmente deshabilitado',
  Pendiente: 'En proceso de activación',
}

// Usar helpers personalizados
const { getIcon, getDescription } = useCustomHelpers(
  statusIcons,
  statusDescriptions,
  'bi bi-circle', // icono por defecto
  'Estado del sistema' // descripción por defecto
)
```

## 🎯 Componente wrapper (alternativa)

Si prefieres un componente más simple, puedes usar `MultiselectCustom.vue`:

```vue
<MultiselectCustom
  v-model="form.status"
  :options="statusOptions"
  placeholder="Seleccionar estado"
  helper-type="custom"
  :custom-icon-map="statusIcons"
  :custom-description-map="statusDescriptions"
  variant="success"
/>
```

## 📋 Props disponibles en el composable

### `useMultiselectDefaults()`

- `trackBy`: 'id'
- `label`: 'name'
- `closeOnSelect`: true
- `clearOnSelect`: false
- `multiple`: false
- `searchable`: true
- `allowEmpty`: false

### `defaultClasses`

- `container`: 'w-100 multiselect-custom'
- `option`: 'd-flex align-items-center py-1'
- `iconContainer`: 'me-3'
- `icon`: 'fs-5 text-primary'
- `content`: 'flex-grow-1'
- `title`: 'fw-medium text-dark'
- `description`: 'text-muted'

## 🎨 Clases Bootstrap 5 utilizadas

- `d-flex align-items-center` - Flexbox horizontal
- `py-1` - Padding vertical
- `me-2`, `me-3` - Margin end (derecha)
- `flex-grow-1` - Expansión flexible
- `fw-medium` - Font weight medio
- `fs-5` - Font size 5
- `text-primary`, `text-dark`, `text-muted` - Colores de texto
- `w-100` - Width 100%

## ✨ Características incluidas

- ✅ Estilos modernos con gradientes
- ✅ Efectos hover suaves
- ✅ Iconos dinámicos por opción
- ✅ Descripciones en dos líneas
- ✅ Checkmark automático en seleccionados
- ✅ Variantes de color (success, warning, danger)
- ✅ Transiciones CSS suaves
- ✅ Compatible con Bootstrap 5
- ✅ Totalmente reutilizable
- ✅ TypeScript support

## 🔄 Migración de código existente

Para migrar un Multiselect existente:

1. Importa el composable y estilos
2. Reemplaza props hardcodeadas con `defaultProps`
3. Añade los slots para iconos (opcional)
4. Reemplaza clases CSS con `defaultClasses`

¡Listo! Ahora tienes un sistema consistente y reutilizable para todos tus Multiselect.
