<template>
  <div
    :class="[
      'w-100 d-flex flex-column align-items-center',
      { rounded: props.round },
      { 'paste-active': isActive },
    ]"
    ref="rootEl"
    tabindex="0"
    @focus="onFocus"
    @blur="onBlur"
    @click.stop="setActivePasteTarget"
  >
    <div
      :class="[{ 'image-upload': props.round }, { 'rectangular-upload': !props.round }]"
      v-if="!props.inputDisabled"
      @click="triggerFileInput"
      style="position: relative; cursor: pointer"
    >
      <input
        :id="'fileInput' + uniqueId"
        type="file"
        :ref="'fileInput' + uniqueId"
        style="display: none"
        @change="onFileSelected"
        :accept="props.acceptedFormats"
        :disabled="props.inputDisabled"
        tabindex="-1"
      />

      <i
        v-if="!imageUrl"
        :class="[
          'text-black text-opacity-50 bi-file-earmark-arrow-up w-100 h-100 d-flex align-items-center justify-content-center rounded-4',
          { border: !props.round },
        ]"
        style="font-size: 3rem"
      ></i>
      <div v-else class="image-upload-preview w-100 h-100">
        <div v-if="props.round" class="w-100 h-100">
          <img
            :src="imageUrl"
            alt="Selected Image"
            class="circular-image"
            @error="imageError = true"
            v-show="!imageError"
          />
          <div
            v-if="imageError"
            class="circular-image d-flex align-items-center justify-content-center bg-light border"
          >
            <i class="bi bi-image text-secondary" style="font-size: 2rem"></i>
          </div>
        </div>
        <div v-else class="rectangular-image-container flex-column pb-2 w-100 h-100">
          <img
            :src="imageUrl"
            alt="Selected Image"
            class="rectangular-image"
            v-if="!isDisabled"
            @error="imageError = true"
            v-show="!imageError"
          />
          <div
            v-if="imageError"
            class="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-black text-opacity-50"
          >
            <i class="bi bi-image" style="font-size: 3rem"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Cuando está deshabilitado, mostramos solo la vista previa -->
    <div v-else class="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
      <div v-if="imageUrl" class="image-upload-preview w-100 h-100">
        <div v-if="props.round" class="w-100 h-100">
          <img
            :src="imageUrl"
            alt="Selected Image"
            class="circular-image"
            @error="imageError = true"
            v-show="!imageError"
          />
          <div
            v-if="imageError"
            class="circular-image d-flex align-items-center justify-content-center bg-transparent"
          >
            <i class="bi bi-image text-secondary" style="font-size: 2rem"></i>
          </div>
        </div>
        <div
          v-else
          class="rectangular-image-container pb-2 h-100 d-flex flex-column align-items-center justify-content-center"
        >
          <img
            :src="imageUrl"
            alt="Selected Image"
            class="rectangular-image"
            @error="imageError = true"
            v-show="!imageError"
          />
          <div
            v-if="imageError"
            class="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-black text-opacity-50"
          >
            <i class="bi bi-image" style="font-size: 4rem; opacity: 0.5"></i>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center text-black text-opacity-50 d-flex flex-column align-items-center justify-content-center w-100 h-100"
        style="font-size: 0.8rem"
      >
        <i class="bi bi-image" style="font-size: 4rem; opacity: 0.5; margin-bottom: 0.5rem"></i>
      </div>
    </div>

    <button
      @click="clearImage"
      class="btn text-black border-0 text-center text-opacity-50 pt-0 mt-1"
      v-if="imageUrl && selectedImage && !props.inputDisabled"
    >
      <i class="fs-5 bi-x-circle"> </i>
    </button>

    <div
      v-else-if="!props.inputDisabled || !imageUrl || imageError"
      class="text-center text-black text-opacity-50"
      style="font-size: 0.8rem; margin-top: 0.2rem"
    >
      <p class="mb-0">
        {{
          (!imageUrl || imageError) && props.inputDisabled
            ? props.placeholder
            : !props.inputDisabled
              ? props.placeholder
              : ''
        }}
      </p>
    </div>

    <div
      v-if="errorMsg"
      class="alert alert-danger w-100 mt-2 p-2 text-center"
      style="font-size: 0.9rem"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useSwal } from '@/composables/useSwal'

// Control compartido entre instancias para 'global-active'
let activePasteId: string | null = null

const props = withDefaults(
  defineProps<{
    modelValue?: File | null
    round?: boolean
    initialImageUrl?: string | null
    inputDisabled?: boolean
    // Controla cómo se maneja el pegado cuando hay múltiples instancias
    // 'global-active': solo procesa la instancia clickeada más reciente
    // 'container': procesa si el evento ocurre dentro del contenedor del componente
    // 'disabled': desactiva el pegado para esta instancia
    pasteBehavior?: 'global-active' | 'container' | 'disabled'
    // Formatos de archivo aceptados (por defecto solo imágenes)
    acceptedFormats?: string
    // Tamaño máximo en MB (por defecto 3MB)
    maxSizeMB?: number
    // Texto placeholder
    placeholder?: string
  }>(),
  {
    pasteBehavior: 'global-active',
    acceptedFormats: 'image/png, image/jpeg, image/jpg',
    maxSizeMB: 3,
    placeholder: 'Haz click para subir una imagen',
  },
)
const emit = defineEmits<(e: 'update:modelValue', value: File | null) => void>()

const store = useStore()
const swal = useSwal()

const selectedImage = ref<File | null>(props.modelValue || null)
const imageUrl = ref<string | null>(props.initialImageUrl || null)
const uniqueId = ref<string>(generateUniqueId())
const instanceId = ref<string>(generateUniqueId())
const errorMsg = ref<string | null>(null)
const imageError = ref<boolean>(false)

watch(
  () => imageUrl.value,
  () => {
    imageError.value = false
  },
)

const loading = computed(() => store.state.request?.loading)
const isDisabled = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const isActive = ref(false)

function setActivePasteTarget() {
  if (props.pasteBehavior === 'global-active') {
    activePasteId = instanceId.value
    broadcastActive(instanceId.value)
  }
  isActive.value = true
  // Llevar el foco al contenedor para accesibilidad
  rootEl.value?.focus()
}

function triggerFileInput() {
  const input = document.getElementById('fileInput' + uniqueId.value) as HTMLInputElement | null
  if (input && !props.inputDisabled) {
    input.click()
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    selectedImage.value = newVal || null
    if (newVal && isImage((newVal as any).name)) {
      readFile(newVal as any)
    } else if (!newVal) {
      imageUrl.value = props.initialImageUrl || null
    }
  },
)

watch(
  () => props.initialImageUrl,
  () => {
    setImageFromProps()
  },
)

onMounted(() => {
  setImageFromProps()
  // Registrar listener según el modo
  if (props.pasteBehavior === 'container') {
    rootEl.value?.addEventListener('paste', handlePaste as any)
  } else if (props.pasteBehavior === 'global-active') {
    document.addEventListener('paste', handlePaste)
  }
  window.addEventListener('quic-image-uploader-active', handleActiveBroadcast as any)
})

onUnmounted(() => {
  if (props.pasteBehavior === 'container') {
    rootEl.value?.removeEventListener('paste', handlePaste as any)
  } else if (props.pasteBehavior === 'global-active') {
    document.removeEventListener('paste', handlePaste)
  }
  window.removeEventListener('quic-image-uploader-active', handleActiveBroadcast as any)
})

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  // Limitar tamaño de archivo
  const maxSize = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    swal.showError(`El archivo es demasiado grande. Máximo ${props.maxSizeMB}MB.`)
    clearImage()
    return
  }
  selectedImage.value = file
  try {
    readFile(file)
  } catch (e) {
    console.error('Error leyendo la imagen:', e)
    clearImage()
    return
  }
  emit('update:modelValue', file)
  // Quitar el foco del input para evitar scroll automático
  setTimeout(() => {
    try {
      ;(target as HTMLInputElement).blur()
    } catch (e) {}
  }, 50)
}

function readFile(file: File) {
  errorMsg.value = null
  const maxSize = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    errorMsg.value = `El archivo es demasiado grande (máx ${props.maxSizeMB}MB)`
    imageUrl.value = null
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.onerror = () => {
    errorMsg.value = 'Error al leer la imagen'
    imageUrl.value = null
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  selectedImage.value = null
  imageUrl.value = props.initialImageUrl || null
  emit('update:modelValue', null)
}

function generateUniqueId() {
  return Math.random().toString(36).slice(2, 9)
}

function isImage(nameOrUrl: string) {
  if (!nameOrUrl) return false
  const lower = nameOrUrl.toLowerCase()
  return (
    lower.startsWith('data:image/') ||
    lower.startsWith('http') ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg')
  )
}

function setImageFromProps() {
  if (props.initialImageUrl && isImage(props.initialImageUrl)) {
    imageUrl.value = props.initialImageUrl
  }
}

function handlePaste(event: ClipboardEvent) {
  try {
    if (props.inputDisabled || props.pasteBehavior === 'disabled') return

    // Validar ámbito antes de procesar
    if (props.pasteBehavior === 'global-active') {
      if (activePasteId !== instanceId.value) return
    } else if (props.pasteBehavior === 'container') {
      const target = event.target as Node | null
      if (!target || !rootEl.value || !rootEl.value.contains(target)) return
    }

    const clipboardData = event.clipboardData || (window as any).clipboardData
    if (!clipboardData) return

    let file: File | null = null

    if (clipboardData.files && clipboardData.files.length) {
      const f = clipboardData.files[0]
      if (f && f.type && f.type.startsWith('image/')) file = f
    }

    if (!file && clipboardData.items && clipboardData.items.length) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i]
        if (item.type && item.type.indexOf('image') !== -1) {
          const f = item.getAsFile()
          if (f) {
            file = f
            break
          }
        }
      }
    }

    if (!file) return

    // Evitar efectos colaterales (pegar texto en inputs)
    event.preventDefault()

    const maxSize = props.maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      swal.showError(`El archivo es demasiado grande. Máximo ${props.maxSizeMB}MB.`)
      return
    }

    selectedImage.value = file
    try {
      readFile(file)
    } catch (e) {
      console.error('Error leyendo la imagen pegada:', e)
      clearImage()
      return
    }
    emit('update:modelValue', file)
  } catch (e) {
    console.error('Error en manejo de pegado:', e)
  }
}

function broadcastActive(id: string) {
  window.dispatchEvent(new CustomEvent('quic-image-uploader-active', { detail: { id } }))
}

function handleActiveBroadcast(e: Event) {
  try {
    const ev = e as CustomEvent<{ id: string }>
    isActive.value = ev.detail?.id === instanceId.value
  } catch {}
}

function onFocus() {
  setActivePasteTarget()
}

function onBlur() {
  // Al perder foco, quitar indicador visual si no está activa globalmente
  if (props.pasteBehavior !== 'global-active') {
    isActive.value = false
  }
}
</script>

<style scoped>
.image-upload {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  aspect-ratio: 1 / 1;
}

.rectangular-upload {
  overflow: hidden;
  width: 100%;
  height: 15rem;
  max-height: 18rem;
  border-radius: 16px;
  display: flex;
  justify-content: center;

  align-items: center;
  cursor: pointer;
}

.image-upload-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.circular-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}

.rectangular-image-container {
  width: 100%;
  height: 15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 1rem;
}

.rectangular-image {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  object-fit: contain;
  border-radius: 18px;
  filter: drop-shadow(0px 2px 4px #22222254);
}

.paste-active {
  outline: 3px dashed #e4e4e4;
  outline-offset: 4px;
  border-radius: 16px;
}
</style>

<!--
USO DEL COMPONENTE ImageUploader:

Props disponibles:
- modelValue: File | null (archivo seleccionado, opcional)
- round: boolean (si es true, imagen circular; si es false, rectangular)
- initialImageUrl: string | null (URL de imagen inicial, opcional)
- inputDisabled: boolean (si es true, solo vista previa, no permite subir)
- acceptedFormats: string (formatos aceptados, por defecto: 'image/png, image/jpeg, image/jpg')
- maxSizeMB: number (tamaño máximo en MB, por defecto: 3)

Eventos:
- @update:modelValue="(file: File | null) => void" // Se emite cuando el usuario selecciona o borra una imagen

Ejemplo de uso básico (solo imágenes):
<ImageUploader
  v-model="selectedFile"
  :round="false"
  :initialImageUrl="urlActual"
  :inputDisabled="false"
/>

Ejemplo con formatos personalizados (PDF, documentos):
<ImageUploader
  v-model="selectedFile"
  :round="false"
  accepted-formats="application/pdf, .doc, .docx"
  :max-size-m-b="10"
/>

Ejemplo aceptando imágenes y PDFs:
<ImageUploader
  v-model="selectedFile"
  accepted-formats="image/png, image/jpeg, image/jpg, application/pdf"
  :max-size-m-b="5"
/>

Donde:
- selectedFile es una variable ref<File | null>
- urlActual es una variable string con la URL de la imagen actual (opcional)

-->
