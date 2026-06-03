<template>
  <teleport to="body">
    <transition name="lightbox">
      <div
        v-if="show"
        class="lightbox-overlay"
        @click="close"
      >
        <button
          class="lightbox-close"
          @click="close"
          type="button"
        >
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="lightbox-content" @click.stop>
          <img
            :src="imageUrl"
            alt="Preview"
            class="lightbox-image"
            @error="handleError"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  url: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const show = computed(() => props.url !== null)
const imageUrl = computed(() => props.url || '')

const close = () => {
  emit('close')
}

const handleError = () => {
  console.error('Error loading image:', props.url)
  close()
}

const handleEscape = (event: KeyboardEvent) => {
  if ((event.key === 'Escape' || event.code === 'Escape') && show.value) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: background 0.2s;
  z-index: 10000;
}

.lightbox-close:hover {
  background: #f0f0f0;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
