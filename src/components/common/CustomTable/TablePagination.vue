<template>
  <div v-if="totalPages >= 1 && !hidePagination" class="pagination-wrapper">
    <!-- Info: Página X de Y -->
    <span class="pagination-info d-none d-md-block">
      Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
    </span>

    <nav aria-label="Navegación de páginas">
      <ul class="pagination-list">
        <!-- ← Primera página -->
        <li v-if="showFirstPage">
          <button
            class="page-btn page-btn--nav"
            :class="{ disabled: currentPage === 1 }"
            :disabled="currentPage === 1"
            aria-label="Primera página"
            @click="$emit('change-page', 1)"
          >
            <i class="bi bi-chevron-double-left"></i>
          </button>
        </li>

        <!-- ← Anterior -->
        <li>
          <button
            class="page-btn page-btn--nav"
            :class="{ disabled: currentPage === 1 }"
            :disabled="currentPage === 1"
            aria-label="Página anterior"
            @click="$emit('change-page', currentPage - 1)"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>

        <!-- Página 1 fija (cuando hay elipsis izquierda) -->
        <li v-if="showFirstPage">
          <button
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === 1 }"
            @click="$emit('change-page', 1)"
          >
            1
          </button>
        </li>

        <!-- Elipsis izquierda -->
        <li v-if="showLeftEllipsis" class="page-ellipsis" aria-hidden="true">
          <span>…</span>
        </li>

        <!-- Ventana de páginas centrales -->
        <li v-for="page in pagesToShow" :key="page">
          <button
            class="page-btn"
            :class="{ 'page-btn--active': page === currentPage }"
            :aria-current="page === currentPage ? 'page' : undefined"
            @click="$emit('change-page', page)"
          >
            {{ page }}
          </button>
        </li>

        <!-- Elipsis derecha -->
        <li v-if="showRightEllipsis" class="page-ellipsis" aria-hidden="true">
          <span>…</span>
        </li>

        <!-- Última página fija -->
        <li v-if="showLastPage">
          <button
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === totalPages }"
            @click="$emit('change-page', totalPages)"
          >
            {{ totalPages }}
          </button>
        </li>

        <!-- → Siguiente -->
        <li>
          <button
            class="page-btn page-btn--nav"
            :class="{ disabled: currentPage === totalPages }"
            :disabled="currentPage === totalPages"
            aria-label="Página siguiente"
            @click="$emit('change-page', currentPage + 1)"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>

        <!-- → Última página -->
        <li v-if="showLastPage">
          <button
            class="page-btn page-btn--nav"
            :class="{ disabled: currentPage === totalPages }"
            :disabled="currentPage === totalPages"
            aria-label="Última página"
            @click="$emit('change-page', totalPages)"
          >
            <i class="bi bi-chevron-double-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  pagesToShow: number[]
  showLeftEllipsis: boolean
  showRightEllipsis: boolean
  showFirstPage: boolean
  showLastPage: boolean
  hidePagination: boolean
}>()

defineEmits<{
  (e: 'change-page', page: number): void
}>()
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  flex-wrap: wrap;
}

.pagination-info {
  font-size: 0.8rem;
  color: #6c757d;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.pagination-info strong {
  color: #212529;
}

/* Lista de botones */
.pagination-list {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Botón base */
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #fff;
  color: #495057;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
  user-select: none;
  line-height: 1;
}

.page-btn:hover:not(.disabled):not(.page-btn--active) {
  background: #f1f3f5;
  border-color: #adb5bd;
  color: #212529;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.page-btn:active:not(.disabled) {
  transform: translateY(0);
  box-shadow: none;
}

/* Página activa */
.page-btn--active {
  background: #212529;
  border-color: #212529;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(33, 37, 41, 0.25);
  cursor: default;
  pointer-events: none;
}

/* Botones de navegación (prev/next/first/last) */
.page-btn--nav {
  color: #6c757d;
  font-size: 0.75rem;
}

.page-btn--nav:hover:not(.disabled) {
  color: #212529;
}

/* Estado deshabilitado */
.page-btn.disabled,
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
  transform: none;
  box-shadow: none;
}

/* Elipsis */
.page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-ellipsis span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  color: #adb5bd;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  user-select: none;
}
</style>
