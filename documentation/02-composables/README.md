# Composables

Funciones reutilizables de Vue 3 Composition API. Pueden depender de constantes y de otros composables.

## Ubicación

```
src/composables/
```

## Índice

| Archivo                                            | Descripción                      | Dependencias              |
| -------------------------------------------------- | -------------------------------- | ------------------------- |
| [useAuth.md](./useAuth.md)                         | Gestión de roles y autenticación | Ninguna                   |
| [useCookies.md](./useCookies.md)                   | Manejo de cookies                | Ninguna                   |
| [useSwal.md](./useSwal.md)                         | Modales SweetAlert2              | Ninguna                   |
| [useSwalToast.md](./useSwalToast.md)               | Toasts SweetAlert2               | Ninguna                   |
| [useTableActions.md](./useTableActions.md)         | Acciones de tabla con permisos   | `useAuth`                 |
| [useLocationInfo.md](./useLocationInfo.md)         | Modal de ubicación               | `useSwal`, `useSwalToast` |
| [useMultiselectIcons.md](./useMultiselectIcons.md) | Iconos en multiselect            | `multiselectConst`        |

## Orden de Dependencias

```
Sin dependencias:
├── useAuth
├── useCookies
├── useSwal
└── useSwalToast

Con dependencias de composables:
├── useTableActions      → useAuth
└── useLocationInfo      → useSwal, useSwalToast

Con dependencias de constantes:
└── useMultiselectIcons  → multiselectConst
```

## Principios

- Los composables encapsulan lógica reutilizable.
- Usan el patrón `use` + `NombreDescriptivo`.
- Retornan funciones y/o refs reactivos.
- Pueden ser singletons (estado global) o instanciados por componente.
