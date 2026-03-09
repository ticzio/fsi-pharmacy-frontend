# Módulos Vuex

Módulos del store de Vuex para gestión de estado global.

## Ubicación

```
src/store/modules/
```

## Índice

| Archivo                          | Descripción                    |
| -------------------------------- | ------------------------------ |
| [pagination.md](./pagination.md) | Módulo de paginación del store |

## Estructura del Store

```
src/store/
├── index.ts          # Store principal
└── modules/
    └── pagination.ts # Módulo de paginación
```

## Principios

- Cada módulo maneja un dominio específico del estado.
- Usar `namespaced: true` para evitar colisiones.
- Documentar state, getters, mutations y actions.
