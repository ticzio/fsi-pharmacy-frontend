<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import MultiselectCustom from '@/components/common/MultiselectCustom.vue'
import { useBanners } from '@/composables/Models/useBanners'

interface BannerData {
  id?: number | string
  name: string
  url_link: string
  url_image?: string
  id_type_app_ubications: any
  active: boolean
}

const props = defineProps({
  initialData: {
    type: Object as () => Record<string, any> | null,
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const { appUbication, loading, getAppUbication } = useBanners()

const formData = ref<BannerData>({
  name: '',
  url_link: '',
  id_type_app_ubications: null,
  active: true,
  url_image: '',
})

const imageFile = ref<File | null>(null)

const initForm = () => {
  if (props.initialData) {
    // El backend puede enviar id_type_app_ubication o id_app_ubication
    const rawUbication =
      props.initialData.id_type_app_ubication || props.initialData.id_app_ubication

    // Si viene como array, tomamos el primero (ya que ahora es selección única)
    const ubication = Array.isArray(rawUbication) ? rawUbication[0] : rawUbication

    // Mapear ID a objeto si es necesario
    const mappedUbication =
      typeof ubication === 'object' && ubication !== null
        ? ubication
        : appUbication.value.find((opt: any) => opt.id === ubication) || ubication

    formData.value = {
      id: props.initialData.id,
      name: props.initialData.name || '',
      url_link: props.initialData.url_link || '',
      id_type_app_ubications: mappedUbication || null,
      active: props.initialData.active !== undefined ? props.initialData.active : true,
      url_image: props.initialData.url_image || '',
    }
  } else {
    formData.value = {
      name: '',
      url_link: '',
      id_type_app_ubications: null,
      active: true,
      url_image: '',
    }
    imageFile.value = null
  }
}

onMounted(() => {
  getAppUbication()
  initForm()
})

watch(
  () => props.initialData,
  () => {
    initForm()
  },
)

watch(
  () => appUbication.value,
  (newVal) => {
    if (newVal && newVal.length > 0 && props.initialData) {
      initForm()
    }
  },
)

const isCreationMode = computed(() => !props.initialData || !props.initialData.id)

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    imageFile: imageFile.value,
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div class="banner-form-container pb-2">
    <div class="row g-4">
      <!-- Columna Izquierda: Imagen -->
      <div class="col-12 col-md-5 d-flex flex-column pe-md-3 border-md-end">
        <h6 class="fw-bold text-primary mb-3 text-uppercase small-title">Visualización</h6>

        <div class="mb-4 d-flex flex-column flex-grow-1">
          <label class="form-label fw-bold mb-2">Imagen del Banner</label>
          <div
            class="image-wrapper bg-light rounded-4 border d-flex align-items-center justify-content-center overflow-hidden p-2"
          >
            <ImageUploader
              v-model="imageFile"
              :round="false"
              :initialImageUrl="formData.url_image"
              class="w-100 h-100"
              placeholder="Subir imagen"
              :inputDisabled="readOnly"
            />
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Detalles -->
      <div class="col-12 col-md-7 ps-md-4">
        <h6 class="fw-bold text-primary mb-3 text-uppercase small-title">Detalles del Banner</h6>

        <div class="mb-3">
          <BaseInput
            id="bannerName"
            v-model="formData.name"
            label="Nombre del Banner"
            placeholder="Ej: Promo Verano"
            :disabled="readOnly"
          />
        </div>

        <div class="mb-3">
          <BaseInput
            id="bannerLink"
            v-model="formData.url_link"
            label="Enlace (URL)"
            placeholder="https://ejemplo.com"
            :disabled="readOnly"
          />
        </div>

        <div class="mb-3">
          <MultiselectCustom
            v-model="formData.id_type_app_ubications"
            :options="appUbication"
            label="Ubicación en la App"
            placeholder="Seleccionar ubicación"
            :disabled="readOnly"
            label-key="name"
            track-by="id"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.small-title {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

@media (min-width: 768px) {
  .border-md-end {
    border-right: 1px solid #e5e7eb !important;
  }
}

.image-wrapper {
  min-height: 200px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}
</style>
