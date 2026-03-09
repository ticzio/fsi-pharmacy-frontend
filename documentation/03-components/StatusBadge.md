# StatusBadge

Componente para centralizar la visualización de estados **activo/inactivo** en las tablas (`List.vue`) usando las constantes definidas en `CELLS_STYLES.cellActive`.

## Importación

```ts
import StatusBadge from '@/components/common/StatusBadge.vue'
```

## Uso básico en un `List.vue`

Ejemplo dentro de un `CustomTable` usando slots de celda:

```vue
<template #cell(active)="{ value }">
  <StatusBadge :value="value" />
</template>
```

El componente se encarga de:

- Elegir las clases `active` / `inactive` + `base` desde `CELLS_STYLES.cellActive`.
- Mostrar el texto `textActive` o `textInactive` según el valor.

## Props

```ts
interface Props {
  value: boolean | number | null | undefined
  extraClass?: string | string[]
  activeText?: string
  inactiveText?: string
}
```

- **value**: valor que indica si está activo o no.
  - `true` / `1` → activo.
  - `false` / `0` → inactivo.
  - Otros valores se castean a boolean.
- **extraClass**: clases CSS adicionales a agregar al `<span>`.
  - Útil para ajustar ancho o layout según el contexto (ej. `w-100` en mobile).
- **activeText** _(opcional)_: texto a mostrar cuando el estado es activo. Si no se define, se usa `CELLS_STYLES.cellActive.textActive`.
- **inactiveText** _(opcional)_: texto a mostrar cuando el estado es inactivo. Si no se define, se usa `CELLS_STYLES.cellActive.textInactive`.

## Ejemplos

### 1. Uso booleano simple

```vue
<template #cell(active)="{ value }">
  <StatusBadge :value="value" />
</template>
```

### 2. Uso con valores numéricos (0/1)

```vue
<template #cell(active)="{ value }">
  <StatusBadge :value="value" />
</template>
```

> Internamente, el componente interpreta `1` como activo y `0` como inactivo.

### 3. Ancho completo en mobile

```vue
<template #cell(active)="{ value }">
  <StatusBadge :value="value === 1" :extra-class="isMobile ? 'w-100' : 'w-50'" />
</template>
```

En este caso:

- Se normaliza el valor a booleano (`value === 1`).
- Se añaden clases extra condicionales para responsive.

### 4. Textos personalizados (por ejemplo, pendiente/bloqueado)

```vue
<template #cell(status)="{ value }">
  <!-- value: true = pendiente, false = bloqueado -->
  <StatusBadge :value="value" active-text="Pendiente" inactive-text="Bloqueado" />
</template>
```

En este escenario:

- Se reutilizan las mismas clases definidas en `CELLS_STYLES.cellActive`.
- Solo cambian los textos visibles según el valor recibido.

## Buenas prácticas

- Usa siempre `StatusBadge` en los `List.vue` para evitar duplicar la lógica de clases y textos.
- Mantén las definiciones de estilos y textos en `CELLS_STYLES.cellActive` para asegurar un estilo consistente en todo el proyecto.
