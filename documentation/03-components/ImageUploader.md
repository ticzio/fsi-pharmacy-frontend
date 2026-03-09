# ImageUploader

Componente Vue 3 para la subida de archivos con soporte para imágenes y otros formatos configurables.

## Ubicación

```
src/components/common/ImageUploader.vue
```

## Importación

```vue
<script setup lang="ts">
import ImageUploader from '@/components/common/ImageUploader.vue'
</script>
```

---

## Props

| Prop              | Tipo                                           | Default                              | Descripción                                                                |
| ----------------- | ---------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `modelValue`      | `File \| null`                                 | `null`                               | Archivo seleccionado (v-model)                                             |
| `round`           | `boolean`                                      | `false`                              | Si es `true`, muestra la vista previa circular; si es `false`, rectangular |
| `initialImageUrl` | `string \| null`                               | `null`                               | URL de imagen/archivo inicial para vista previa                            |
| `inputDisabled`   | `boolean`                                      | `false`                              | Si es `true`, solo muestra vista previa sin permitir subir                 |
| `pasteBehavior`   | `'global-active' \| 'container' \| 'disabled'` | `'global-active'`                    | Controla el comportamiento del pegado (Ctrl+V)                             |
| `acceptedFormats` | `string`                                       | `'image/png, image/jpeg, image/jpg'` | Formatos MIME aceptados                                                    |
| `maxSizeMB`       | `number`                                       | `3`                                  | Tamaño máximo del archivo en MB                                            |
| `placeholder`     | `string`                                       | `'Haz click para subir una imagen'`  | Texto placeholder del componente                                           |

---

## Eventos

| Evento              | Payload        | Descripción                                                |
| ------------------- | -------------- | ---------------------------------------------------------- |
| `update:modelValue` | `File \| null` | Se emite cuando el usuario selecciona o elimina un archivo |

---

## Ejemplos de Uso

### Uso básico (solo imágenes)

```vue
<template>
  <ImageUploader v-model="selectedFile" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from '@/components/common/ImageUploader.vue'

const selectedFile = ref<File | null>(null)
</script>
```

### Con imagen inicial

```vue
<ImageUploader v-model="selectedFile" :initial-image-url="currentImageUrl" />
```

### Imagen circular (avatar)

```vue
<ImageUploader v-model="avatar" :round="true" />
```

### Solo vista previa (deshabilitado)

```vue
<ImageUploader :initial-image-url="imageUrl" :input-disabled="true" />
```

### Aceptar PDFs

```vue
<ImageUploader v-model="pdfFile" accepted-formats="application/pdf" :max-size-m-b="10" />
```

### Aceptar documentos Word

```vue
<ImageUploader
  v-model="docFile"
  accepted-formats=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  :max-size-m-b="15"
/>
```

### Múltiples formatos (imágenes + PDF)

```vue
<ImageUploader
  v-model="file"
  accepted-formats="image/png, image/jpeg, image/jpg, application/pdf"
  :max-size-m-b="5"
/>
```

### Archivos Excel

```vue
<ImageUploader
  v-model="excelFile"
  accepted-formats=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  :max-size-m-b="20"
/>
```

---

## Formatos MIME Comunes

| Tipo de archivo | Formato MIME                                                              |
| --------------- | ------------------------------------------------------------------------- |
| PNG             | `image/png`                                                               |
| JPEG            | `image/jpeg, image/jpg`                                                   |
| GIF             | `image/gif`                                                               |
| WebP            | `image/webp`                                                              |
| SVG             | `image/svg+xml`                                                           |
| PDF             | `application/pdf`                                                         |
| Word (.doc)     | `application/msword`                                                      |
| Word (.docx)    | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Excel (.xls)    | `application/vnd.ms-excel`                                                |
| Excel (.xlsx)   | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`       |
| CSV             | `text/csv`                                                                |
| Texto plano     | `text/plain`                                                              |
| ZIP             | `application/zip`                                                         |

---

## Comportamiento de Pegado (pasteBehavior)

El componente soporta pegar archivos directamente con `Ctrl+V` / `Cmd+V`:

| Valor           | Descripción                                                           |
| --------------- | --------------------------------------------------------------------- |
| `global-active` | Solo la instancia clickeada más recientemente procesa el pegado       |
| `container`     | Procesa el pegado solo si ocurre dentro del contenedor del componente |
| `disabled`      | Desactiva completamente el pegado para esta instancia                 |

```vue
<!-- Desactivar pegado -->
<ImageUploader v-model="file" paste-behavior="disabled" />
```

---

## Validaciones

- **Tamaño máximo**: Configurable con `maxSizeMB`. Por defecto 3MB.
- **Formato**: Solo acepta los formatos especificados en `acceptedFormats`.
- **Mensajes de error**: Se muestran automáticamente si el archivo excede el tamaño o formato permitido.

---

## Notas

- El componente usa `v-model` para binding bidireccional del archivo.
- La vista previa funciona automáticamente para imágenes.
- Para archivos no-imagen (PDF, docs), se mostrará el ícono de subida pero no una vista previa del contenido.
- El componente emite el objeto `File` nativo de JavaScript, listo para ser enviado a un API.
