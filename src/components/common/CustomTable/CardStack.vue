<template>
  <div class="card-stack-container pb-3">
    <!-- Estado vacío -->
    <div
      v-if="data.length === 0 && !isTableLoading"
      class="text-center py-5 bg-white rounded-3 shadow-sm border"
    >
      <div
        class="d-flex flex-column align-items-center justify-content-center text-muted"
        style="min-height: 250px"
      >
        <i class="bi bi-inbox text-secondary opacity-50 mb-3" style="font-size: 3rem"></i>
        <h5 class="fw-semibold text-secondary mb-1">No hay datos para mostrar</h5>
        <p class="mb-0 small opacity-75">Intenta ajustar tu búsqueda o agregar nuevos registros.</p>
      </div>
    </div>

    <!-- Lista de tarjetas en formato accordion -->
    <div v-else class="accordion custom-mobile-accordion" id="cardStackAccordion">
      <div
        v-for="item in data"
        :key="item.id"
        class="accordion-item mb-3 border-0 shadow-sm rounded-4 overflow-hidden"
      >
        <h2 class="accordion-header" :id="'heading-' + item.id">
          <div
            class="accordion-button bg-white text-dark fw-semibold"
            :class="{ collapsed: expandedItemId !== item.id }"
            @click="toggleAccordion(item)"
            style="cursor: pointer"
          >
            <!-- Mostrar el primer y segundo header en el boton del accordion -->
            <div class="d-flex w-100 align-items-center gap-2 pe-1" v-if="displayableHeaders.length > 0">
              <div class="d-flex flex-column align-items-start overflow-hidden" style="flex: 1; min-width: 0;">
                <span class="text-secondary small mb-1 text-truncate w-100 text-start" style="font-size: 0.75rem">{{
                  displayableHeaders[0].label
                }}</span>
                <div class="text-truncate fw-bold w-100 text-start">
                  <slot
                    :name="`cell(${displayableHeaders[0].key})`"
                    :item="item"
                    :value="getNestedValue(item, displayableHeaders[0].key)"
                  >
                    {{ getNestedValue(item, displayableHeaders[0].key) }}
                  </slot>
                </div>
              </div>
              <div
                class="d-flex flex-column align-items-start overflow-hidden"
                style="flex: 1; min-width: 0;"
                v-if="displayableHeaders.length > 1 && !isFirstColumnTooLong(item)"
              >
                <span class="text-secondary small mb-1 text-truncate w-100 text-start" style="font-size: 0.75rem">{{
                  displayableHeaders[1].label
                }}</span>
                <div class="text-truncate w-100 text-start">
                  <slot
                    :name="`cell(${displayableHeaders[1].key})`"
                    :item="item"
                    :value="getNestedValue(item, displayableHeaders[1].key)"
                  >
                    {{ getNestedValue(item, displayableHeaders[1].key) }}
                  </slot>
                </div>
              </div>
              <!-- Acciones se han movido a la burbuja flotante para mejor UX en móvil -->
              <div
                v-if="hasActions && getActionsForItem(item).length > 0"
                class="d-flex justify-content-end flex-shrink-0 ms-1 align-items-center"
              >
                <!-- Acciones directas desde los tres puntos -->
                <button
                  type="button"
                  class="btn btn-sm btn-light rounded-circle border-0 d-flex align-items-center justify-content-center"
                  style="width: 32px; height: 32px; background: #f1f5f9"
                  @click.stop="openActions(item)"
                  title="Opciones"
                >
                  <i class="bi bi-three-dots-vertical text-primary"></i>
                </button>
              </div>
            </div>
            <div v-else class="w-100 pe-3 text-start">Item #{{ item.id }}</div>
          </div>
        </h2>

        <transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
          <div
            v-show="expandedItemId === item.id"
            :id="'collapse-' + item.id"
            class="accordion-collapse"
          >
            <div class="accordion-body p-0">
              <div class="d-flex flex-column h-100">
                <div class="flex-grow-1 p-0 m-0">
                  <template v-for="(header, index) in displayableHeaders" :key="header.key">
                    <div class="d-flex justify-content-between align-items-center border-bottom p-3 text-center">
                      <span class="fw-bold text-secondary small w-50 flex-shrink-0 pe-2">{{
                        header.label
                      }}</span>
                      <div class="text-break w-50 d-flex justify-content-center align-items-center">
                        <slot
                          :name="`cell(${header.key})`"
                          :item="item"
                          :value="getNestedValue(item, header.key)"
                        >
                          <span class="d-block w-100 text-end">{{
                            getNestedValue(item, header.key)
                          }}</span>
                        </slot>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modal de Acciones -->
    <Modal id="actionsModal" ref="actionsModalRef" title="Acciones disponibles" size="md">
      <div v-if="activeItem" class="d-flex flex-column gap-3">
        <div class="d-flex flex-column gap-2">
          <button
            v-for="action in getActionsForItem(activeItem)"
            :key="`action-modal-${action.name}-${expandedItemId}`"
            @click="handleActionClick(action.name)"
            class="btn btn-light border-0 d-flex align-items-center gap-3 p-3 rounded-4 shadow-sm text-start action-btn-hover"
          >
            <div
              :class="[
                action.class,
                'action-icon-wrap d-flex align-items-center justify-content-center',
              ]"
            >
              <i :class="[action.icon, 'fs-4']"></i>
            </div>
            <div class="d-flex flex-column">
              <span class="fw-bold text-dark">{{ action.tooltip || action.name }}</span>
              <span class="text-muted extra-small" v-if="action.tooltip"
                >Realizar esta operación</span
              >
            </div>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'

const isImage = (value: any): boolean => {
  if (typeof value !== 'string' || !value) return false

  const lower = value.toLowerCase()
  // Data URIs y Blobs son siempre imágenes
  if (lower.startsWith('data:image/') || lower.startsWith('blob:')) return true

  // Extensiones de imagen comunes
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)(\?.*)?$/i
  if (!imageExtensions.test(value)) return false

  // Para distinguir de "códigos" o "nombres" que podrían terminar en una extensión,
  // verificamos si parece una URL o una ruta (contiene barras o empieza con http)
  // o si es una cadena que representa un recurso (un nombre de archivo simple
  // pero que ha pasado el test de extensión)
  const isUrlOrPath = /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(value) || value.includes('/')

  return isUrlOrPath
}

interface Header {
  key: string
  label: string
}

interface Action {
  name: string
  icon: string
  class: string
  tooltip?: string
}

interface EntityItem {
  id: string | number
  [key: string]: any
}

const props = defineProps<{
  data: EntityItem[]
  headers: Header[]
  hasActions: boolean
  isTableLoading: boolean
  getActionsForItem: (item: EntityItem) => Action[]
  getNestedValue: (obj: any, key: string) => any
}>()

const emit = defineEmits<{
  (e: 'row-click', item: EntityItem): void
  (e: 'action-click', payload: { actionName: string; item: EntityItem }): void
}>()

const expandedItemId = ref<string | number | null>(null)
const actionsModalRef = ref<InstanceType<typeof Modal> | null>(null)

const activeItem = computed(() => {
  if (expandedItemId.value === null || expandedItemId.value === undefined) return null
  return props.data.find((item: EntityItem) => item.id === expandedItemId.value) || null
})

const displayableHeaders = computed(() => props.headers.filter((h) => h.key !== 'id'))

const isFirstColumnTooLong = (item: EntityItem): boolean => {
  if (displayableHeaders.value.length === 0) return false
  const val = props.getNestedValue(item, displayableHeaders.value[0].key)
  if (val === null || val === undefined) return false
  return String(val).length > 20
}

const openActions = (item: EntityItem) => {
  expandedItemId.value = item.id
  actionsModalRef.value?.openModal()
  emit('row-click', item)
}

const handleActionClick = (actionName: string) => {
  if (expandedItemId.value !== null && expandedItemId.value !== undefined) {
    const item = props.data.find((i) => i.id === expandedItemId.value)
    if (item) {
      emit('action-click', { actionName, item })
    }
  }
  actionsModalRef.value?.closeModal()
}

// Animación del accordion
const onEnter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
  htmlEl.style.overflow = 'hidden'
  htmlEl.offsetHeight // force reflow
  htmlEl.style.transition = 'height 0.5s ease, opacity 0.5s ease'
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.opacity = '1'
}

const onAfterEnter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = 'auto'
  htmlEl.style.overflow = 'visible'
}

const onLeave = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.overflow = 'hidden'
  htmlEl.style.opacity = '1'
  htmlEl.offsetHeight // force reflow
  htmlEl.style.transition = 'height 0.5s ease, opacity 0.5s ease'
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
}

const toggleAccordion = (item: EntityItem) => {
  if (expandedItemId.value === item.id) {
    expandedItemId.value = null
  } else {
    expandedItemId.value = item.id
  }
  emit('row-click', item)
}
</script>

<style scoped>
.custom-mobile-accordion {
  width: 100%;
}

.accordion-item {
  border-radius: 0.75rem !important;
}

.accordion-button {
  border-radius: 0.75rem !important;
  box-shadow: none !important;
}

.accordion-button:not(.collapsed) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background-color: white !important;
  color: inherit !important;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125) !important;
}

:deep(.accordion-button .text-truncate) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.accordion-button .text-truncate *) {
  margin-bottom: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Modal Actions Styles ── */
.action-btn-hover {
  transition: all 0.2s ease;
  background: white !important;
}

.action-btn-hover:active {
  transform: scale(0.98);
  background: #f8fafc !important;
}

.action-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.extra-small {
  font-size: 0.7rem;
}
</style>
