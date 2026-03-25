<script setup lang="ts">
import { computed, toRefs, ref } from 'vue'
import CustomCard from './CustomCard.vue'
import TablePagination from './CustomTable/TablePagination.vue'

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

const props = withDefaults(
  defineProps<{
    data: EntityItem[]
    isLoading?: boolean
    currentPage?: number
    totalPages?: number
    limit?: number
    hidePagination?: boolean
    // Card Mapping
    titleKey?: string
    descriptionKey?: string
    imageKey?: string
    startDateKey?: string
    finishDateKey?: string
    statusKey?: string
    actions?: Action[] | ((item: EntityItem) => Action[]) | ((item: EntityItem) => Promise<Action[]>)
  }>(),
  {
    data: () => [],
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hidePagination: false,
  },
)

const emit = defineEmits<{
  (e: 'change-page', page: number): void
  (e: 'action-click', payload: { actionName: string; item: EntityItem }): void
  (e: 'card-click', item: EntityItem): void
}>()

const getActionsForItem = (item: EntityItem): Action[] => {
  if (typeof props.actions === 'function') {
    // For now, handling sync functions. Async handled in CustomTable is more complex
    // with local state. If needed, we can replicate that logic here.
    const result = props.actions(item)
    return (result instanceof Promise ? [] : result) || []
  }
  return props.actions || []
}

const { currentPage, totalPages } = toRefs(props)
const maxPagesToShow = ref(5)

const pagesToShow = computed(() => {
  const pages: number[] = []
  const half = Math.floor(maxPagesToShow.value / 2)
  let startPage = Math.max(1, currentPage.value - half)
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow.value - 1)

  if (endPage - startPage < maxPagesToShow.value - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow.value + 1)
  }

  const firstToShow = totalPages.value > maxPagesToShow.value ? Math.max(2, startPage) : startPage
  const lastToShow =
    totalPages.value > maxPagesToShow.value ? Math.min(totalPages.value - 1, endPage) : endPage

  for (let i = firstToShow; i <= lastToShow; i++) {
    pages.push(i)
  }
  return pages
})

const showFirstPage = computed(() => totalPages.value > maxPagesToShow.value)
const showLastPage = computed(() => totalPages.value > maxPagesToShow.value)

const showLeftEllipsis = computed(() => {
  return showFirstPage.value && pagesToShow.value.length > 0 && pagesToShow.value[0] > 2
})

const showRightEllipsis = computed(() => {
  return (
    showLastPage.value &&
    pagesToShow.value.length > 0 &&
    pagesToShow.value[pagesToShow.value.length - 1] < totalPages.value - 1
  )
})

const handlePageChange = (page: number) => {
  emit('change-page', page)
}
</script>

<template>
  <div class="custom-card-grid-container d-flex flex-column h-100">
    <div class="flex-grow-1 position-relative">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center w-100 h-100"
        style="z-index: 5; background: rgba(255, 255, 255, 0.7)"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="data.length === 0 && !isLoading" class="text-center py-5 d-flex flex-column align-items-center justify-content-center h-100">
        <i class="bi bi-inbox text-muted opacity-50 mb-3" style="font-size: 3rem"></i>
        <h5 class="text-muted">No se encontraron resultados</h5>
      </div>

      <!-- Grid -->
      <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 p-3">
        <div v-for="item in data" :key="item.id" class="col">
          <slot name="card" :item="item" :actions="getActionsForItem(item)">
            <CustomCard
              :item="item"
              :title-key="titleKey"
              :description-key="descriptionKey"
              :image-key="imageKey"
              :start-date-key="startDateKey"
              :finish-date-key="finishDateKey"
              :status-key="statusKey"
              :actions="getActionsForItem(item)"
              @action-click="(payload) => $emit('action-click', payload)"
              @card-click="(item) => $emit('card-click', item)"
            />
          </slot>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!hidePagination && totalPages > 1" class="mt-auto border-top bg-white p-3">
      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :pages-to-show="pagesToShow"
        :show-left-ellipsis="showLeftEllipsis"
        :show-right-ellipsis="showRightEllipsis"
        :show-first-page="showFirstPage"
        :show-last-page="showLastPage"
        :hide-pagination="hidePagination"
        @change-page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-card-grid-container {
  min-height: 400px;
}

/* Ensure consistent card heights in the same row */
.row > .col {
  display: flex;
}

:deep(.custom-card) {
  width: 100%;
}
</style>
