# version-push.cjs

## Ubicación

`version-push.cjs` (Raíz del proyecto)

## Descripción

Script de automatización en Node.js para estandarizar el flujo de trabajo de Git del proyecto. Permite subir nuevas versiones semánticas (SemVer), crear commits y tags de forma segura, o hacer rollback a la última versión disponible en el repositorio remoto. Se ejecuta típicamente a través de hooks gestionados por **Husky** (ej: en el hook `pre-update` o similar).

## Dependencias

- **Constantes**: Ninguna
- **Composables**: Ninguna
- **Dependencias del Proyecto**: Requiere tener instalado y configurado **Husky** (`npm install husky --save-dev`) para que intercepte y controle el flujo de los hooks de Git.
- **Módulos Externos**: `fs`, `child_process`, `readline`

## Validaciones y Seguridad Integrada

El script realiza varias validaciones críticas antes de permitir cualquier operación de Git:

1. **Existencia de `package.json`**: Comprueba que el archivo se encuentre en la raíz.
2. **Identidad de Git**: Verifica que `user.name` y `user.email` estén configurados.
3. **Conexión Remota**: Confirma conectividad con el `origin` remoto mediante SSH/HTTPS (`git ls-remote`).
4. **Estado "Up-to-date"**: Verifica que la rama local no esté por detrás (`behind`) de la remota.
5. **Ramas Permitidas (Flujo 1)**: Las versiones de paso a producción (Tags/Pushes de versión) solo se pueden hacer desde `main`, `master` o `develop`.
6. **Área de Trabajo Sucia (Flujo 1)**: Si hay cambios sin confirmar (staged o un-staged), se pide explícitamente confirmación antes de forzarlos en el commit de la versión.

## Flujos de Trabajo (Menú Principal)

Al ejecutarse, el script analiza el estado actual del repositorio, busca el último tag existente como versión base, y presenta un menú con 5 opciones:

1. 🚀 **Subir Versión (Push/Tag)**: Modifica `package.json` incrementando versión (Major, Minor o Patch), crea el commit, crea el tag (`vX.Y.Z`) y realiza un push completo.
2. 📤 **Commit y Push**: Agrega cambios pendientes (`git add .`), pide un mensaje de commit, realiza el commit y hace un push del código sin alterar la versión.
3. 💾 **Solo Commit Local**: Igual que el flujo 2, pero sin realizar push al servidor remoto.
4. ⏮️ **Retroceder versión a último Tag remoto**: Intenta leer el último Tag creado en el remoto y revierte la versión en el `package.json` local a ese Tag, útil para corregir saltos de versión erróneos o colisiones.
5. 🚫 **Cancelar**: Aborta la ejecución de forma segura.

## Cómo Usar con Husky (Requisito)

Para que este script se ejecute automáticamente y valide el proceso antes de realizar cambios importantes, es necesario usar **Husky**.

1. Asegúrate de tener Husky configurado en tu proyecto.
2. Crea o edita el hook deseado (por ejemplo, `.husky/pre-push` o invocándolo mediante un script en el `package.json` definido para algún hook personalizado).
3. Asegúrate de que tu `package.json` tenga un script que invoque a `version-push.cjs`.

## Ejemplos de uso

```bash
# Mediante un script definido en package.json (donde Husky lo ejecutará)
npm run pre-update

# Ejecutar directamente con Node.js (con fines de prueba local)
node version-push.cjs
```

## Usado por

- `package.json` (usualmente definido en scripts como `pre-update`, `release`, etc.)
- Programadores para el manejo estandarizado de versiones antes de un despliegue.
