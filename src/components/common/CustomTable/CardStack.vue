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
            <div class="d-flex w-100 align-items-center pe-2" v-if="headers.length > 0">
              <div class="d-flex flex-column align-items-start me-3" style="min-width: 60px">
                <span class="text-secondary small mb-1" style="font-size: 0.75rem">{{
                  headers[0].label
                }}</span>
                <div class="text-truncate fw-bold">
                  <slot
                    :name="`cell(${headers[0].key})`"
                    :item="item"
                    :value="getNestedValue(item, headers[0].key)"
                  >
                    {{ getNestedValue(item, headers[0].key) }}
                  </slot>
                </div>
              </div>
              <div
                class="d-flex flex-column flex-grow-1 text-center overflow-hidden me-2"
                v-if="headers.length > 1"
              >
                <span class="text-secondary small mb-1" style="font-size: 0.75rem">{{
                  headers[1].label
                }}</span>
                <div class="text-truncate">
                  <slot
                    :name="`cell(${headers[1].key})`"
                    :item="item"
                    :value="getNestedValue(item, headers[1].key)"
                  >
                    {{ getNestedValue(item, headers[1].key) }}
                  </slot>
                </div>
              </div>
              <!-- Acciones -->
              <div
                v-if="hasActions && getActionsForItem(item).length > 0"
                class="d-flex justify-content-end gap-1 ms-auto"
              >
                <button
                  v-for="action in getActionsForItem(item)"
                  :key="`action-header-${action.name}-${item.id}`"
                  :class="[
                    action.class,
                    'btn btn-sm d-flex align-items-center justify-content-center',
                  ]"
                  style="border-radius: 0.5rem; width: 32px; height: 32px; padding: 0"
                  @click.stop="$emit('action-click', { actionName: action.name, item })"
                  :title="action.tooltip"
                >
                  <i :class="action.icon"></i>
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
                  <template v-for="(header, index) in headers" :key="header.key">
                    <div
                      v-if="index > 1"
                      class="d-flex justify-content-between align-items-center border-bottom p-3 text-center"
                    >
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

defineProps<{
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
</style>
