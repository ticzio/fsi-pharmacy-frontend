<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal as BootstrapModal } from 'bootstrap/dist/js/bootstrap.esm.js'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg', 'xl'
  },
  background: {
    type: String,
    default: '', // e.g. 'bg-light', 'bg-dark', 'bg-primary'
  },
  scrollable: {
    type: Boolean,
    default: false,
  },
})

// Mapeo de tamaños de Bootstrap
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'modal-sm'
    case 'lg':
      return 'modal-lg'
    case 'xl':
      return 'modal-xl'
    default:
      return ''
  }
})

const modalRef = ref<HTMLElement | null>(null)
let modalInstance: BootstrapModal | null = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new BootstrapModal(modalRef.value)
  }
})

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.dispose()
  }
})

const openModal = () => {
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
}

defineExpose({ openModal, closeModal })
</script>

<template>
  <Teleport to="body">
    <div
      class="modal fade"
      :id="id"
      ref="modalRef"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      :aria-labelledby="`${id}Label`"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        :class="[sizeClass, { 'modal-dialog-scrollable': scrollable }]"
      >
        <div class="modal-content border-0 shadow-lg rounded-4" :class="background">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold fs-4" :id="`${id}Label`" v-if="title">
              {{ title }}
            </h5>
            <slot name="header"></slot>
            <button
              type="button"
              class="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-4 pt-3">
            <slot></slot>
          </div>
          <div class="modal-footer border-top-0 pt-0" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
