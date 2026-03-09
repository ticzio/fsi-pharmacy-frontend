# Constantes

Archivos de configuración base del proyecto. No tienen dependencias externas (solo librerías nativas).

## Ubicación

```
src/const/
```

## Índice

| Archivo                                      | Descripción                           |
| -------------------------------------------- | ------------------------------------- |
| [api.md](./api.md)                           | Endpoints de la API (URLS)            |
| [buttonConst.md](./buttonConst.md)           | Configuración de botones y tooltips   |
| [errorConst.md](./errorConst.md)             | Mensajes de error estándar            |
| [multiselectConst.md](./multiselectConst.md) | Iconos para componentes multiselect   |
| [tableConst.md](./tableConst.md)             | Headers, títulos y acciones de tablas |

## Principios

- Las constantes son **inmutables** y se definen una sola vez.
- Se usan para centralizar configuraciones que se repiten en múltiples lugares.
- Facilitan el mantenimiento: un cambio en la constante se refleja en toda la app.
