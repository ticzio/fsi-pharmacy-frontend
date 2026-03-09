# Componentes de Sección en Desarrollo

Este documento describe dos componentes reutilizables para indicar que una sección del sistema está **en desarrollo**:

- `UnderConstruction` (componente visual reutilizable)
- `UnderConstructionPage` (página genérica para usar directamente en rutas)

---

## 1. `UnderConstruction.vue`

**Ruta:** `src/components/common/UnderConstruction.vue`

Componente de presentación para mostrar un mensaje estándar de "Sección en desarrollo" dentro de cualquier vista.

### Props

- `title?: string`

  - Título principal del mensaje.
  - **Default:** `"Sección en desarrollo"`.

- `description?: string`

  - Texto explicativo corto.
  - **Default:** `"Estamos trabajando en esta funcionalidad. Pronto estará disponible para su uso."`.

- `icon?: string`

  - Clase de icono de [Bootstrap Icons](https://icons.getbootstrap.com/) (por ejemplo: `"bi bi-tools"`, `"bi bi-calendar2-week"`).
  - **Default:** `"bi bi-tools"`.

- `showBack?: boolean`
  - Si es `true`, muestra un botón **Volver** que hace `router.back()`.
  - **Default:** `false`.

### Slots

- `extra`
  - Slot opcional para contenido adicional debajo de la descripción.
  - Útil para enlaces de ayuda, mensajes extra o botones personalizados.

### Estilos

El componente incluye un contenedor con clases y estilos pensados para integrarse con el diseño existente:

- Bordes redondeados (`border-radius` grande).
- `box-shadow` suave.
- Borde punteado sutil.

El ancho y disposición se controlan desde la vista que lo usa (ejemplo: `col-12 col-lg-8`).

### Ejemplo de uso dentro de una vista con `DashboardLayout`

```vue
<script setup lang="ts">
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import UnderConstruction from '@/components/common/UnderConstruction.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid py-3">
      <titleSection
        :title="TITLE_SECTION_COMPONENT.reservations?.title || 'Reservas del concesionario'"
        :description="
          TITLE_SECTION_COMPONENT.reservations?.description ||
          'Gestionar reservas del concesionario'
        "
      />

      <div class="row justify-content-center mt-4">
        <div class="col-12 col-lg-8">
          <UnderConstruction
            title="Reservas del concesionario"
            description="Estamos construyendo el módulo de reservas. Próximamente podrás ver y gestionar las reservas desde aquí."
            icon="bi bi-calendar2-week"
            :showBack="true"
          >
            <template #extra>
              <p class="text-muted small mb-0">
                Si necesitas gestionar reservas ahora mismo, por favor contacta al soporte.
              </p>
            </template>
          </UnderConstruction>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
```

### Ejemplo simple en cualquier vista

```vue
<template>
  <div class="container py-4">
    <UnderConstruction
      title="Módulo en desarrollo"
      description="Estamos trabajando en esta sección para ofrecerte nuevas funcionalidades."
    />
  </div>
</template>

<script setup lang="ts">
import UnderConstruction from '@/components/common/UnderConstruction.vue'
</script>
```

---

## 2. `UnderConstructionPage.vue`

**Ruta:** `src/views/UnderConstructorPage/UnderConstructionPage.vue`

Página genérica pensada para ser utilizada directamente desde el **router**, cuando una sección aún no tiene su vista final pero la ruta ya debe existir.

Esta página:

- Usa `DashboardLayout`.
- Usa `titleSection` para el encabezado.
- Usa internamente el componente `UnderConstruction`.

### Dependencias

- `DashboardLayout` → `@/components/DashboardLayout.vue`
- `titleSection` → `@/components/common/titleSection.vue`
- `UnderConstruction` → `@/components/common/UnderConstruction.vue`
- `TITLE_SECTION_COMPONENT` → `@/const/tableConst`
- `vue-router` → para leer `meta` de la ruta (`useRoute`).

### Comportamiento

La página lee los siguientes campos de `route.meta` (todos opcionales) para construir el **encabezado** (`titleSection`):

- `meta.title: string`
- `meta.description: string`
- `meta.sectionKey: string` → clave para `TITLE_SECTION_COMPONENT[sectionKey]`.

Prioridad para definir título y descripción del encabezado (`titleSection`):

1. Si `meta.title` existe → se usa como título.
2. Si no, y `meta.sectionKey` existe en `TITLE_SECTION_COMPONENT` →
   - Título: `TITLE_SECTION_COMPONENT[sectionKey].title`
   - Descripción: `TITLE_SECTION_COMPONENT[sectionKey].description`
3. Si nada de lo anterior existe →
   - Título: `"Sección en desarrollo"`
   - Descripción: `"Estamos trabajando en esta sección para ofrecerte más funcionalidades."`

Actualmente, el comportamiento es:

- El `titleSection` usa el título y descripción **dinámicos** según las reglas anteriores.
- La card `UnderConstruction` interna muestra siempre textos **fijos**:
  - Título: `"Sección en desarrollo"`
  - Descripción: `"Estamos trabajando en esta sección para ofrecerte más funcionalidades."`

### Uso en rutas

#### 2.1. Ruta con `meta.title` y `meta.description`

Ejemplo (en `router/routes/concessionaire.ts` u otro archivo de rutas):

```ts
{
  path: 'reservations-concessionaire',
  name: 'ReservasConcessionaire',
  component: () => import('@/views/UnderConstructorPage/UnderConstructionPage.vue'),
  meta: {
    requiresAuth: true,
    title: 'Reservas del concesionario',
    description: 'Estamos trabajando en el módulo de gestión de reservas.',
  },
}
```

#### 2.2. Ruta usando `TITLE_SECTION_COMPONENT`

Si tienes una entrada en `TITLE_SECTION_COMPONENT`, por ejemplo:

```ts
// En src/const/tableConst.ts
export const TITLE_SECTION_COMPONENT = {
  // ...
  reservations: {
    title: 'Reservas del concesionario',
    description: 'Gestionar reservas del concesionario',
  },
}
```

Puedes configurar la ruta así:

```ts
{
  path: 'reservations-concessionaire',
  name: 'ReservasConcessionaire',
  component: () => import('@/views/UnderConstructorPage/UnderConstructionPage.vue'),
  meta: {
    requiresAuth: true,
    sectionKey: 'reservations',
  },
}
```

En este caso:

- `UnderConstructionPage` tomará el título y descripción desde `TITLE_SECTION_COMPONENT.reservations`.
- No necesitas repetir textos en las rutas.

---

## 3. ¿Cuándo usar cada uno?

### `UnderConstruction`

Usa el componente común cuando:

- Ya tienes una vista concreta (ejemplo: `reservations/List.vue`).
- Quieres mostrar **algo parcial** (como `CustomCalendar`) pero avisar que la sección no está completa.

Ejemplo combinando mensaje + calendario:

```vue
<template>
  <div class="container-fluid py-3">
    <div class="row justify-content-center mb-4">
      <div class="col-12 col-lg-8">
        <UnderConstruction
          title="Reservas del concesionario"
          description="Estamos implementando el módulo de reservas. De momento puedes visualizar el calendario, pero aún no está completamente funcional."
          icon="bi bi-calendar2-week"
        />
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-lg-12">
        <CustomCalendar :events="[]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnderConstruction from '@/components/common/UnderConstruction.vue'
import CustomCalendar from '@/components/common/CustomCalendar.vue'
</script>
```

### `UnderConstructionPage`

Usa la página genérica cuando:

- El módulo todavía **no tiene vista propia**.
- Pero necesitas que la **ruta exista** y sea accesible (para menú, navegación, etc.).

Solo apuntas la ruta a `UnderConstructionPage.vue` con la `meta` adecuada y listo.

---

## 4. Resumen rápido de integración

- Importar componente común:

  ```ts
  import UnderConstruction from '@/components/common/UnderConstruction.vue'
  ```

- Usar página genérica en rutas:

  ```ts
  import UnderConstructionPage from '@/views/UnderConstructorPage/UnderConstructionPage.vue'
  ```

  o lazy-load:

  ```ts
  component: () => import('@/views/UnderConstructorPage/UnderConstructionPage.vue')
  ```

Con esto tienes una forma estándar y reutilizable de marcar secciones "en desarrollo" en todo el proyecto, alineada con tu estructura actual (DashboardLayout, titleSection, constantes y Bootstrap 5).
