# useQRCode

Composable para generar códigos QR utilizando la librería `qrcode`. Proporciona métodos para generar QR en diferentes formatos: Data URL, Canvas y String.

## Descripción general

- Envuelve la librería `qrcode` con manejo de errores consistente.
- Soporta todas las opciones de configuración de la librería `qrcode`.
- Proporciona tres métodos principales para generar códigos QR en diferentes formatos.
- Todas las funciones son asíncronas y manejan errores de forma centralizada.

## API

### `useQRCode()`

Devuelve un objeto con:

- `generateDataURL(text: string, options?: QRCodeOptions): Promise<string>`  
  Genera un Data URL (base64) del código QR. Útil para mostrar en etiquetas `<img>`.

- `generateCanvas(text: string, canvas: HTMLCanvasElement, options?: QRCodeOptions): Promise<void>`  
  Renderiza el código QR directamente en un elemento `<canvas>`.

- `generateString(text: string, options?: QRCodeOptions): Promise<string>`  
  Genera una representación en string del código QR (por ejemplo, SVG).

### `QRCodeOptions`

Interface de opciones de configuración:

```ts
interface QRCodeOptions {
  version?: number // Versión del QR (1-40)
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' // Nivel de corrección de errores
  maskPattern?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 // Patrón de máscara
  margin?: number // Margen alrededor del QR (en módulos)
  scale?: number // Escala del QR
  width?: number // Ancho del QR en píxeles
  color?: {
    dark?: string // Color de los módulos oscuros (hex)
    light?: string // Color de fondo (hex)
  }
}
```

## Ejemplos de uso

### Generar Data URL para imagen

```ts
import { useQRCode } from '@/composables/useQRCode'
import { ref } from 'vue'

const { generateDataURL } = useQRCode()
const qrCodeUrl = ref<string>('')

try {
  qrCodeUrl.value = await generateDataURL('https://ejemplo.com', {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  })
} catch (error) {
  console.error('Error al generar QR:', error)
}
```

```vue
<template>
  <img :src="qrCodeUrl" alt="Código QR" />
</template>
```

### Renderizar en Canvas

```vue
<template>
  <canvas ref="qrCanvas"></canvas>
</template>

<script setup lang="ts">
import { useQRCode } from '@/composables/useQRCode'
import { ref, onMounted } from 'vue'

const { generateCanvas } = useQRCode()
const qrCanvas = ref<HTMLCanvasElement>()

onMounted(async () => {
  if (qrCanvas.value) {
    try {
      await generateCanvas('https://ejemplo.com', qrCanvas.value, {
        width: 300,
        errorCorrectionLevel: 'H',
      })
    } catch (error) {
      console.error('Error al generar QR en canvas:', error)
    }
  }
})
</script>
```

### Generar string SVG

```ts
import { useQRCode } from '@/composables/useQRCode'

const { generateString } = useQRCode()

try {
  const svgString = await generateString('https://ejemplo.com', {
    type: 'svg',
    width: 300,
  })
  // Usar svgString directamente en el DOM o guardarlo
} catch (error) {
  console.error('Error al generar SVG:', error)
}
```

## Niveles de corrección de errores

- `L` (Low): ~7% de corrección
- `M` (Medium): ~15% de corrección (predeterminado)
- `Q` (Quartile): ~25% de corrección
- `H` (High): ~30% de corrección

## Notas

- Todos los métodos son asíncronos y deben usarse con `await` o `.then()`.
- Los errores se registran en consola y se propagan para manejo personalizado.
- Para más información sobre las opciones disponibles, consulta la [documentación de qrcode](https://github.com/soldair/node-qrcode).
