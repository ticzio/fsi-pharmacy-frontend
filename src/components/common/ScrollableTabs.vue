<script setup lang="ts">
// ScrollableTabs.vue - Componente reutilizable de tabs con scroll horizontal y centrado automático
// Rediseñado con estética premium y animación de slider tipo AnalyticsTabs.vue
import {
  ref,
  nextTick,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
  type ComponentPublicInstance,
} from 'vue'

const props = defineProps<{
  tabs: { label: string; path: string }[]
  activeTab: number
  isLoading?: boolean
  skeletonCount?: number
}>()
const emit = defineEmits<{
  (e: 'tab-change', index: number): void
}>()

const tabRefs = ref<(HTMLElement | null)[]>([])
const tabListRef = ref<HTMLElement | null>(null)

// Slider state
const sliderStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
  opacity: 0,
})

function setTabRef(el: Element | ComponentPublicInstance | null, index: number) {
  tabRefs.value[index] = el instanceof Element ? (el as HTMLElement) : null
}

function updateSlider() {
  nextTick(() => {
    const activeElement = tabRefs.value[props.activeTab]
    if (!activeElement || !tabListRef.value) return

    const { offsetLeft, offsetWidth } = activeElement
    sliderStyle.value = {
      width: `${offsetWidth}px`,
      transform: `translateX(${offsetLeft}px)`,
      opacity: 1,
    }
  })
}

function scrollToActiveTab() {
  nextTick(() => {
    const activeElement = tabRefs.value[props.activeTab]
    const container = tabListRef.value
    if (!activeElement || !container) return

    const containerRect = container.getBoundingClientRect()
    const activeElementRect = activeElement.getBoundingClientRect()
    const offset =
      activeElementRect.left -
      containerRect.left -
      containerRect.width / 2 +
      activeElementRect.width / 2
    container.scrollBy({ left: offset, behavior: 'smooth' })

    updateSlider()
  })
}

watch(
  () => props.activeTab,
  () => {
    scrollToActiveTab()
  },
  { immediate: true },
)

watch(
  () => props.tabs,
  () => {
    scrollToActiveTab()
  },
  { deep: true },
)

watch(
  () => props.isLoading,
  (newVal) => {
    if (!newVal) {
      setTimeout(() => {
        scrollToActiveTab()
      }, 100)
    }
  }
)

// Re-calculate slider on window resize
onMounted(() => {
  // Inicializar en el montaje
  scrollToActiveTab()
  // Forzar un update un momento después para asegurar que los anchos sean correctos tras renderizar
  setTimeout(updateSlider, 100)
  window.addEventListener('resize', updateSlider)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlider)
})
</script>

<template>
  <div
    class="tabs-container bg-white p-1 rounded-pill shadow-sm border mb-3 position-relative overflow-hidden"
  >
    <ul
      class="nav nav-pills flex-nowrap overflow-auto position-relative"
      role="tablist"
      ref="tabListRef"
      id="tabs-scroll"
      style="white-space: nowrap"
    >
      <!-- Active Tab Slider (Indicador animado) -->
      <div class="nav-slider-bg" :style="sliderStyle"></div>

      <!-- Skeleton de carga -->
      <template v-if="isLoading">
        <li
          class="nav-item placeholder-glow position-relative"
          v-for="n in skeletonCount || 4"
          :key="'skeleton-' + n"
          style="display: inline-block; z-index: 2"
        >
          <span
            class="placeholder rounded-pill bg-secondary d-inline-block mx-2"
            style="width: 150px; height: 38px"
          ></span>
        </li>
      </template>

      <!-- Tabs reales -->
      <template v-else>
        <li
          class="nav-item position-relative"
          v-for="(tab, index) in tabs"
          :key="tab.path"
          role="presentation"
          :ref="(el) => setTabRef(el, index)"
          style="display: inline-block; z-index: 2"
        >
          <button
            class="nav-link rounded-pill py-2 px-4 fw-bold border-0 bg-transparent w-100 fs-6 transition-all"
            :class="activeTab === index ? 'active text-white' : 'text-secondary'"
            @click="$emit('tab-change', index)"
            type="button"
            role="tab"
          >
            {{ tab.label }}
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.tabs-container {
  max-width: 100%;
}

.nav-pills .nav-link {
  color: #6c757d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: none !important;
}

.nav-pills .nav-link.active {
  background: transparent !important;
}

.nav-pills .nav-link:not(.active):hover {
  color: #0d6efd;
}

/* Slider Background */
.nav-slider-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #0d6efd;
  border-radius: 50rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
  z-index: 1;
}

#tabs-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

#tabs-scroll::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
