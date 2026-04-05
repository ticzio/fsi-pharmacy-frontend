<template>
  <div class="location-extractor-container mt-2">
    <label v-if="label" :for="inputId" class="form-label">{{ label }}</label>
    <div class="input-group border-radius-right border-radius-left">
      <input
        :id="inputId"
        type="text"
        class="form-control border-radius-right border-radius-left"
        :class="{
          'is-valid': hasValidCoords && internalErrors.length === 0,
          'is-invalid':
            (isDirty && modelValue && !hasValidCoords) || errorMessage || internalErrors.length > 0,
        }"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        aria-describedby="error-feedback"
        @blur="handleBlur"
      />
      <button
        class="btn btn-outline-secondary"
        :class="{
          'border-radius-right ': !embedCode,
          '': !!embedCode,
        }"
        type="button"
        @click="openLocation"
        :disabled="disabled || !modelValue || !!errorMessage"
      >
        <i class="bi bi-box-arrow-up-right"></i>
        <span class="d-none d-sm-inline ms-2">Abrir</span>
      </button>
      <button
        v-if="embedCode"
        class="btn btn-outline-secondary border-radius-right"
        type="button"
        @click="togglePreview"
      >
        {{ showPreview ? 'Ocultar' : 'Mostrar' }} vista previa
      </button>
    </div>
    <div v-if="errorMessage" id="error-feedback" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
    <transition name="fade">
      <div v-if="internalErrors.length > 0 && !errorMessage" class="errors-wrapper">
        <div class="errors-wrapper-inner">
          <transition-group
            name="list"
            tag="div"
            class="invalid-feedback d-block mt-1 errors-container"
          >
            <div v-for="error in internalErrors" :key="error" class="error-item">• {{ error }}</div>
          </transition-group>
        </div>
      </div>
    </transition>
    <!-- Sección para generar y copiar el código embed (reactiva) -->
    <div v-if="embedCode" class="embed-section mt-2">
      <!-- <label class="form-label mb-1">Código embed</label>
      <div class="d-flex gap-2 align-items-start">
        <textarea
          class="form-control embed-textarea"
          :value="embedCode"
          readonly
          rows="3"
        ></textarea>
        <div class="d-flex flex-column gap-2">
          <button class="btn btn-outline-secondary btn-sm" type="button" @click="copyEmbed">
            Copiar
          </button>
        </div>
      </div> -->

      <div v-if="showPreview" class="mt-2 d-flex justify-content-center embed-preview-wrapper">
        <iframe
          :src="embedSrc"
          class="w-100 border rounded-4 shadow-sm"
          height="300"
          style="border: 0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// --- DEFINICIÓN DE PROPS Y EMITS ---
const props = withDefaults(
  defineProps<{
    modelValue: string // v-model: La URL de Google Maps
    label?: string // Etiqueta opcional para el input
    placeholder?: string // Placeholder para el input
    disabled?: boolean // Para deshabilitar el componente
    rules?: Array<(val: any) => string | boolean>
  }>(),
  {
    label: 'Ubicación de Google Maps',
    placeholder: 'Pega el enlace de Google Maps aquí...',
    disabled: false,
    rules: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'coordinates-extracted', coords: { latitude: string; longitude: string } | null): void
}>()

// --- ESTADO INTERNO DEL COMPONENTE ---
const errorMessage = ref<string | null>(null)
const isDirty = ref<boolean>(false)
const hasValidCoords = ref<boolean>(false)
// Mantener las últimas coordenadas extraídas internamente para generar el embed
const lastCoords = ref<{ latitude: string; longitude: string } | null>(null)
const showPreview = ref<boolean>(false)
const inputId = `location-input-${Math.random().toString(36).substring(2, 9)}`
const internalErrors = ref<string[]>([])

const validate = (value: any) => {
  if (!props.rules || props.rules.length === 0) {
    internalErrors.value = []
    return true
  }

  const errors: string[] = []
  for (const rule of props.rules) {
    const result = rule(value)
    if (typeof result === 'string') {
      errors.push(result)
    } else if (result === false) {
      errors.push('Campo inválido')
    }
  }
  internalErrors.value = errors
  return errors.length === 0
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  validate(target.value)
}

// --- MANEJADORES DE EVENTOS Y LÓGICA ---

// Intenta extraer coordenadas desde distintos formatos de URL de Google Maps
const extractCoordinates = (url: string): { latitude: number; longitude: number } | null => {
  try {
    // Normalizar
    const cleanedUrl = url.trim()

    // 1) Buscar coordenadas específicas al final de la URL (formato !3m3!8m2!3d10.0158333!4d-69.2187778)
    const finalCoordinatesMatch = cleanedUrl.match(
      /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)[^!3d]*(?:$|\?|&)/,
    )
    if (finalCoordinatesMatch) {
      return {
        latitude: parseFloat(finalCoordinatesMatch[1]),
        longitude: parseFloat(finalCoordinatesMatch[2]),
      }
    }

    // 2) Buscar coordenadas en formato DMS dentro de la parte place/ (ej: 10°00'57.0"N 69°13'07.6"W)
    const dmsMatch = cleanedUrl.match(/place\/([^@]+)/)
    if (dmsMatch) {
      const dmsText = decodeURIComponent(dmsMatch[1])
      const latMatch = dmsText.match(/(\d+)°(\d+)'([\d.]+)"?([NS])/) // lat
      const lngMatch = dmsText.match(/(\d+)°(\d+)'([\d.]+)"?([EW])/) // lng
      if (latMatch && lngMatch) {
        let lat =
          parseFloat(latMatch[1]) + parseFloat(latMatch[2]) / 60 + parseFloat(latMatch[3]) / 3600
        if (latMatch[4] === 'S') lat = -lat

        let lng =
          parseFloat(lngMatch[1]) + parseFloat(lngMatch[2]) / 60 + parseFloat(lngMatch[3]) / 3600
        if (lngMatch[4] === 'W') lng = -lng

        return { latitude: lat, longitude: lng }
      }
    }

    // 3) Extraer coordenadas entre !3d y !4d
    const exactCoordinatesMatch = cleanedUrl.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
    if (exactCoordinatesMatch) {
      return {
        latitude: parseFloat(exactCoordinatesMatch[1]),
        longitude: parseFloat(exactCoordinatesMatch[2]),
      }
    }

    // 4) Manejar formatos con @lat,lng (por ejemplo: /@19.3028607,-99.1531026,17z)
    const atMatch = cleanedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (atMatch) {
      return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) }
    }

    // 5) maps?q=lat,lng
    if (cleanedUrl.includes('maps?q=')) {
      const part = cleanedUrl.split('maps?q=')[1]
      const coords = part.split(/[,&]/)[0].split(',')
      if (coords.length >= 2) {
        return { latitude: parseFloat(coords[0]), longitude: parseFloat(coords[1]) }
      }
    }

    // 8) search/?api=1&query=lat,lng  (ej: https://www.google.com/maps/search/?api=1&query=10.06726250,-69.33635940)
    if (cleanedUrl.includes('/search') && cleanedUrl.includes('query=')) {
      const queryMatch = cleanedUrl.match(/[?&]query=([^&]+)/)
      if (queryMatch && queryMatch[1]) {
        const decoded = decodeURIComponent(queryMatch[1])
        const parts = decoded.split(',')
        if (parts.length >= 2) {
          return { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) }
        }
      }
    }

    // 6) maps/@lat,lng,...
    if (cleanedUrl.includes('maps/@')) {
      const part = cleanedUrl.split('maps/@')[1]
      const coords = part.split(',')
      if (coords.length >= 2) {
        return { latitude: parseFloat(coords[0]), longitude: parseFloat(coords[1]) }
      }
    }

    // 7) ll=lat,lng
    if (cleanedUrl.includes('ll=')) {
      const part = cleanedUrl.split('ll=')[1]
      const coords = part.split(',')
      if (coords.length >= 2) {
        return { latitude: parseFloat(coords[0]), longitude: parseFloat(coords[1]) }
      }
    }

    // Si nada coincide, devolver null
    return null
  } catch (error) {
    console.error('Error al extraer coordenadas:', error)
    return null
  }
}

// Valor local vinculado al input para soportar pegado por teclado correctamente
const inputValueRef = ref<string>(props.modelValue || '')
const inputValue = computed<string>({
  get() {
    return inputValueRef.value
  },
  set(val: string) {
    const safeVal = val ?? ''
    inputValueRef.value = safeVal
    isDirty.value = true
    emit('update:modelValue', safeVal)

    validate(safeVal)

    const cleaned = safeVal.trim()

    // Si el input queda vacío, limpiar también las coordenadas en el padre
    if (!cleaned) {
      errorMessage.value = null
      hasValidCoords.value = false
      lastCoords.value = null
      emit('coordinates-extracted', null)
      return
    }

    // Detecta y rechaza URLs cortas de Google Maps
    if (cleaned.includes('maps.app.goo.gl') || cleaned.includes('goo.gl/maps')) {
      errorMessage.value =
        'URL corta detectada. Abre el enlace y copia la URL completa del navegador.'
      hasValidCoords.value = false
      lastCoords.value = null
      emit('coordinates-extracted', null)
      return
    }

    const coords = extractCoordinates(cleaned)
    if (coords) {
      errorMessage.value = null
      hasValidCoords.value = true
      // Guardar internamente las coordenadas en formato string
      lastCoords.value = { latitude: String(coords.latitude), longitude: String(coords.longitude) }
      // Emitir como strings para mantener compatibilidad con los padres que esperan string
      emit('coordinates-extracted', {
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
      })
    } else {
      errorMessage.value =
        'No se pudieron encontrar las coordenadas en la URL. Verifica el formato.'
      hasValidCoords.value = false
      lastCoords.value = null
      emit('coordinates-extracted', null)
    }
  },
})

const openLocation = () => {
  const url = (props.modelValue || '').trim()
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Genera la URL embed y el HTML del iframe reactivo a partir de lastCoords
const embedSrc = computed(() => {
  if (!lastCoords.value) return ''
  const lat = lastCoords.value.latitude
  const lng = lastCoords.value.longitude
  // Usamos maps?q=...&output=embed para un embed sencillo
  return `https://maps.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(
    lng,
  )}&hl=es&z=15&output=embed`
})

const embedCode = computed(() => {
  if (!lastCoords.value) return ''
  return `<iframe src="${embedSrc.value}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
})

// const copyEmbed = async () => {
//   const code = embedCode.value
//   if (!code) return
//   try {
//     await navigator.clipboard.writeText(code)
//   } catch (err) {
//     // Fallback: crear textarea temporal
//     const ta = document.createElement('textarea')
//     ta.value = code
//     document.body.appendChild(ta)
//     ta.select()
//     try {
//       document.execCommand('copy')
//     } finally {
//       document.body.removeChild(ta)
//     }
//   }
// }

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// Si el `modelValue` llega desde el backend o cambia externamente, intentar extraer coords
watch(
  () => props.modelValue,
  (val) => {
    // Mantener el valor del input sincronizado con la prop para evitar que pegados se reviertan
    inputValueRef.value = val || ''
    const cleaned = (val || '').trim()

    if (internalErrors.value.length > 0) {
      validate(val)
    }

    if (!cleaned) {
      errorMessage.value = null
      hasValidCoords.value = false
      lastCoords.value = null
      return
    }

    // Rechazar URLs cortas
    if (cleaned.includes('maps.app.goo.gl') || cleaned.includes('goo.gl/maps')) {
      errorMessage.value =
        'URL corta detectada. Abre el enlace y copia la URL completa del navegador.'
      hasValidCoords.value = false
      lastCoords.value = null
      return
    }

    const coords = extractCoordinates(cleaned)
    if (coords) {
      // Guardar coordenadas internamente y notificar al padre, pero no abrir la vista previa automáticamente
      lastCoords.value = { latitude: String(coords.latitude), longitude: String(coords.longitude) }
      hasValidCoords.value = true
      errorMessage.value = null
      emit('coordinates-extracted', {
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
      })
    } else {
      errorMessage.value =
        'No se pudieron encontrar las coordenadas en la URL. Verifica el formato.'
      hasValidCoords.value = false
      lastCoords.value = null
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.location-extractor-container {
  margin-bottom: 1rem;
}

.errors-wrapper {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
}

.errors-wrapper-inner {
  min-height: 0;
  overflow: hidden;
}

.errors-container {
  max-height: 3.2em; /* Muestra hasta 2 errores cómodamente */
  overflow-y: scroll; /* Fuerza la barra de scroll a estar visible si se excede el alto */
  /* Fallback para Firefox */
  scrollbar-width: thin;
  scrollbar-color: #fca5a5 #f9fafb;
  padding-right: 4px;
}

/* Forzar Webkit (Chrome/Safari/Edge/MacOS) a mostrar el scroll siempre */
.errors-container::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
}
.errors-container::-webkit-scrollbar-track {
  background: #f9fafb; /* Fondo muy gris claro para que el track exista visualmente */
  border-radius: 4px;
}
.errors-container::-webkit-scrollbar-thumb {
  background-color: #fca5a5; /* Color del scrollbar rojo tenue */
  border-radius: 4px;
  border: 1px solid #f9fafb; /* Pequeño borde para separarlo del track */
}

.error-item {
  line-height: 1.4em;
  margin-bottom: 4px;
  word-break: break-word; /* Rompe palabras extra largas que no tienen espacios */
  overflow-wrap: break-word; /* Asegura el salto de línea al llegar al borde */
  white-space: normal; /* Asegura que el texto respete los bordes de la caja */
  overflow: hidden;
  max-height: 5em;
}
.error-item:last-child {
  margin-bottom: 0;
}

/* Transición del bloque de errores completo */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  grid-template-rows: 0fr;
}

/* Transición individual de los errores al agregarse o quitarse */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  max-height: 0;
  margin-bottom: 0;
}
</style>
