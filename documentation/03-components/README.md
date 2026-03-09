# Componentes

Componentes Vue 3 reutilizables. Pueden depender de composables y constantes.

## Ubicación

```
src/components/
```

## Índice

| Archivo                                          | Descripción                       | Dependencias          |
| ------------------------------------------------ | --------------------------------- | --------------------- |
| [StatusBadge.md](./StatusBadge.md)               | Badge de estado activo/inactivo   | Constantes locales    |
| [ImageUploader.md](./ImageUploader.md)           | Subida de archivos/imágenes       | Ninguna               |
| [README-multiselect.md](./README-multiselect.md) | Componente Multiselect            | `useMultiselectIcons` |
| [ComponentsDev.md](./ComponentsDev.md)           | Guía de desarrollo de componentes | -                     |

## Estructura de Componentes

```
src/components/
├── common/           # Componentes genéricos reutilizables
│   ├── StatusBadge.vue
│   ├── ImageUploader.vue
│   └── ...
├── layout/           # Componentes de layout
└── ...
```

## Principios

- Los componentes deben ser **reutilizables** y **desacoplados**.
- Usar `defineProps` y `defineEmits` para tipado.
- Preferir slots para contenido flexible.
- Documentar props, eventos y slots en el archivo `.md` correspondiente.
