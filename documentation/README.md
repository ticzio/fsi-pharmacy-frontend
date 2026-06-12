# Documentación del Proyecto FSI Admin

## Mapa de Dependencias

```
Constantes (base)
    └── Composables
            └── Componentes
                    └── Views
```

## Estructura de Carpetas

```
documentation/
├── README.md                    # Este archivo
├── 01-constants/                # Base: sin dependencias externas
├── 02-composables/              # Dependen de constantes y otros composables
├── 03-components/               # Dependen de composables y constantes
├── 04-modules_vuex/             # Store global (Vuex)
└── 05-scripts/                  # Scripts de automatización y CI/CD
```

---

## Índice

### 1. Constantes (`01-constants/`)

| Archivo                                                   | Descripción                           | Usado por           |
| --------------------------------------------------------- | ------------------------------------- | ------------------- |
| [api.md](./01-constants/api.md)                           | Endpoints de la API                   | Composables, Views  |
| [buttonConst.md](./01-constants/buttonConst.md)           | Configuración de botones              | Components, Views   |
| [errorConst.md](./01-constants/errorConst.md)             | Mensajes de error estándar            | Composables, Views  |
| [multiselectConst.md](./01-constants/multiselectConst.md) | Iconos para multiselect               | useMultiselectIcons |
| [tableConst.md](./01-constants/tableConst.md)             | Headers, títulos y acciones de tablas | Views, CustomTable  |

### 2. Composables (`02-composables/`)

| Archivo                                                           | Descripción                      | Dependencias          |
| ----------------------------------------------------------------- | -------------------------------- | --------------------- |
| [useAuth.md](./02-composables/useAuth.md)                         | Gestión de roles y autenticación | Ninguna               |
| [useCookies.md](./02-composables/useCookies.md)                   | Manejo de cookies                | Ninguna               |
| [useSwal.md](./02-composables/useSwal.md)                         | Modales SweetAlert2              | Ninguna               |
| [useSwalToast.md](./02-composables/useSwalToast.md)               | Toasts SweetAlert2               | Ninguna               |
| [useTableActions.md](./02-composables/useTableActions.md)         | Acciones de tabla con permisos   | useAuth               |
| [useLocationInfo.md](./02-composables/useLocationInfo.md)         | Modal de ubicación               | useSwal, useSwalToast |
| [useMultiselectIcons.md](./02-composables/useMultiselectIcons.md) | Iconos en multiselect            | multiselectConst      |

### 3. Componentes (`03-components/`)

| Archivo                                                        | Descripción                     | Dependencias        |
| -------------------------------------------------------------- | ------------------------------- | ------------------- |
| [StatusBadge.md](./03-components/StatusBadge.md)               | Badge de estado activo/inactivo | Constantes locales  |
| [ImageUploader.md](./03-components/ImageUploader.md)           | Subida de archivos/imágenes     | Ninguna             |
| [README-multiselect.md](./03-components/README-multiselect.md) | Componente Multiselect          | useMultiselectIcons |

### 4. Módulos Vuex (`04-modules_vuex/`)

| Archivo                                          | Descripción                    |
| ------------------------------------------------ | ------------------------------ |
| [pagination.md](./04-modules_vuex/pagination.md) | Módulo de paginación del store |

### 5. Scripts (`05-scripts/`)

| Archivo                                         | Descripción                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| [version-push.md](./05-scripts/version-push.md) | Documentación sobre el script de versionamiento automatizado |

---

## Convenciones de Documentación

### Estructura de cada archivo `.md`

```markdown
# NombreDelElemento

## Ubicación

`src/path/to/file.ts`

## Descripción

Breve descripción de qué hace.

## Dependencias

- **Constantes**: lista o "Ninguna"
- **Composables**: lista o "Ninguna"

## API / Exports

Tabla o lista de lo que exporta.

## Ejemplos de uso

Código de ejemplo.

## Usado por

Lista de archivos que lo importan.
```

---

## Cómo Contribuir

1. Al crear un nuevo **composable**, documéntalo en `02-composables/`.
2. Al crear un nuevo **componente**, documéntalo en `03-components/`.
3. Al agregar **constantes**, documéntalas en `01-constants/`.
4. Al agregar **scripts automáticos**, documéntalos en `05-scripts/`.
5. Siempre incluye la sección **Dependencias** y **Usado por**.
