<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import defaultProfileImage from '@/assets/images/default-profile.png'

interface Props {
  src?: string | null
  alt?: string
  type?: 'user' | 'entity'
  width?: string
  height?: string
  rootClass?: string
  rounded?: string // e.g., 'rounded-pill', 'rounded-circle', 'rounded-3', 'rounded'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'imagen',
  type: 'entity',
  width: '45px',
  height: '45px',
  rootClass: '',
  rounded: 'rounded-pill',
  objectFit: 'cover'
})

const hasError = ref(false)

const showIcon = computed(() => {
  return props.type === 'entity' && (hasError.value || !props.src || props.src === '-' || props.src === '')
})

const currentSrc = computed(() => {
  if (showIcon.value) return null
  if (hasError.value || !props.src || props.src === '-' || props.src === '') {
    return props.type === 'user' ? defaultProfileImage : null
  }
  return props.src
})

const handleError = () => {
  hasError.value = true
}

// Reset error if src changes
watch(
  () => props.src,
  () => {
    hasError.value = false
  }
)
</script>

<template>
  <div
    class="app-image-container d-inline-flex justify-content-center align-items-center overflow-hidden"
    :class="[rounded, rootClass]"
    :style="{ width, height }"
  >
    <div
      v-if="showIcon"
      class="d-flex align-items-center justify-content-center w-100 h-100 bg-light border"
    >
      <i class="bi bi-image text-secondary opacity-50 fs-4"></i>
    </div>
    <img
      v-else
      :src="currentSrc || ''"
      :alt="alt"
      class="img-fluid w-100 h-100"
      :class="[`object-fit-${objectFit}`]"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.app-image-container {
  flex-shrink: 0;
}
</style>
