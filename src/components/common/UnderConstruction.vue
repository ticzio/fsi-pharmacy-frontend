<template>
  <div class="under-construction-card text-center py-5 px-3">
    <div class="mb-3">
      <i :class="icon" class="display-4 text-warning"></i>
    </div>
    <h2 class="h4 fw-semibold mb-2">
      {{ title }}
    </h2>
    <p class="text-muted mb-4">
      {{ description }}
    </p>
    <slot name="extra"></slot>
    <button
      v-if="showBack"
      type="button"
      class="btn btn-outline-secondary border-radius-left border-radius-right px-4 mt-2"
      @click="goBack"
    >
      <i class="bi bi-arrow-left me-1"></i>
      Volver
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  description?: string
  icon?: string
  showBack?: boolean
}>()

const router = useRouter()

const icon = props.icon || 'bi bi-tools'
const title = props.title || 'Sección en desarrollo'
const description =
  props.description ||
  'Estamos trabajando en esta funcionalidad. Pronto estará disponible para su uso.'

const showBack = props.showBack ?? false

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.under-construction-card {
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px dashed rgba(0, 0, 0, 0.06);
}
</style>
