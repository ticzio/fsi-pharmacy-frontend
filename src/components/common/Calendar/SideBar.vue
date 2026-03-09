<template>
  <aside class="calendar-sidebar" :class="{ 'is-mobile-navbar': isMobile }">
    <!-- Vista label (solo desktop) -->
    <span v-if="!isMobile" class="sidebar-label">Vista</span>

    <!-- ===== MOBILE NAVBAR ===== -->
    <template v-if="isMobile">
      <!-- Mes -->
      <div
        class="sidebar-item"
        :class="{ active: viewMode === 'month' }"
        @click="handleViewModeChange('month')"
      >
        <i class="bi bi-calendar3"></i>
        <span class="navbar-item-label">Mes</span>
      </div>

      <!-- Semana -->
      <div
        class="sidebar-item"
        :class="{ active: viewMode === 'week' }"
        @click="handleViewModeChange('week')"
      >
        <i class="bi bi-calendar-week"></i>
        <span class="navbar-item-label">Semana</span>
      </div>

      <!-- Día -->
      <div
        class="sidebar-item"
        :class="{ active: viewMode === 'day' }"
        @click="handleViewModeChange('day')"
      >
        <i class="bi bi-calendar-day"></i>
        <span class="navbar-item-label">Día</span>
      </div>

      <div class="divider-horizontal" />

      <!-- Refrescar -->
      <div class="sidebar-item" @click="handleRefreshCalendar">
        <i class="bi bi-arrow-clockwise"></i>
        <span class="navbar-item-label">Refrescar</span>
      </div>
    </template>

    <!-- ===== DESKTOP SIDEBAR ===== -->
    <template v-else>
      <!-- Botón Grid -->
      <div
        class="sidebar-item"
        :class="{ active: displayType === 'grid' }"
        @click="handleDisplayTypeChange('grid')"
        @mouseenter="showTooltip($event, 'Formato Agenda')"
        @mouseleave="hideTooltip"
      >
        <i class="bi bi-calendar3"></i>
      </div>

      <!-- Botón Lista -->
      <div
        class="sidebar-item"
        :class="{ active: displayType === 'list' }"
        @click="handleDisplayTypeChange('list')"
        @mouseenter="showTooltip($event, 'Formato Lista')"
        @mouseleave="hideTooltip"
      >
        <i class="bi bi-list-ul"></i>
      </div>

      <hr style="width: 30px; margin: 10px 0" />

      <!-- Botón Refrescar -->
      <div
        class="sidebar-item"
        @click="handleRefreshCalendar"
        @mouseenter="showTooltip($event, 'Refrescar')"
        @mouseleave="hideTooltip"
      >
        <i class="bi bi-arrow-clockwise"></i>
      </div>

      <!-- Tooltip flotante -->
      <Teleport to="body">
        <div
          v-if="tooltip.visible"
          class="sidebar-tooltip"
          :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
        >
          {{ tooltip.text }}
        </div>
      </Teleport>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// Props
const props = defineProps<{
  displayType: 'grid' | 'list'
  viewMode?: 'month' | 'week' | 'day'
  isMobile?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'display-type-change', type: 'grid' | 'list'): void
  (e: 'view-mode-change', mode: 'month' | 'week' | 'day'): void
  (e: 'create-event'): void
  (e: 'refresh-calendar'): void
}>()

// Tooltip state
const tooltip = reactive({
  visible: false,
  text: '',
  x: 0,
  y: 0,
})

let tooltipTimeout: ReturnType<typeof setTimeout> | null = null

const showTooltip = (event: MouseEvent, text: string) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  tooltipTimeout = setTimeout(() => {
    tooltip.text = text
    tooltip.x = rect.left - 10
    tooltip.y = rect.top + rect.height / 2
    tooltip.visible = true
  }, 500)
}

const hideTooltip = () => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
    tooltipTimeout = null
  }
  tooltip.visible = false
}

// Methods
const handleDisplayTypeChange = (type: 'grid' | 'list') => {
  emit('display-type-change', type)
}

const handleViewModeChange = (mode: 'month' | 'week' | 'day') => {
  emit('view-mode-change', mode)
}

const handleCreateEvent = () => {
  emit('create-event')
}

const handleRefreshCalendar = () => {
  console.log('SideBar: Refresh button clicked, emitting refresh-calendar')
  emit('refresh-calendar')
}
</script>

<style scoped>
/* ============================================================
   DESKTOP SIDEBAR (default)
   ============================================================ */
.calendar-sidebar {
  width: 50px;
  background-color: var(--bs-body-bg);
  border-left: 1px solid var(--bs-border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.02);
  /* Ensure sidebar renders on the right in desktop */
  order: 2;
}

.sidebar-item {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--bs-secondary-color);
  font-size: 1.2rem;
  position: relative;
}

.sidebar-item:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-primary);
}

.sidebar-item.active {
  color: var(--bs-primary);
}

.sidebar-item.active::after {
  content: '';
  position: absolute;
  right: 1px;
  top: 20%;
  height: 50%;
  width: 3px;
  background-color: var(--bs-primary);
  border-radius: 3px 0 0 3px;
}

.sidebar-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  color: var(--bs-secondary-color);
}

.sidebar-divider {
  width: 30px;
  height: 1px;
  background-color: var(--bs-border-color);
  margin: 6px 0 10px;
}

/* Tooltip personalizado */
.sidebar-tooltip {
  position: fixed;
  transform: translateX(-100%) translateY(-50%);
  background-color: var(--bs-primary-bg-subtle);
  backdrop-filter: blur(10px);
  color: var(--bs-body-color);
  font-size: 14px;
  font-family: 'Lexend Deca', sans-serif;
  padding: 5px 20px;
  border: var(--bs-border-color) 1px solid;
  border-radius: var(--bs-border-radius-xl);
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
  z-index: 99999;
  white-space: nowrap;
  pointer-events: none;
}

/* ============================================================
   MOBILE NAVBAR
   ============================================================ */
.calendar-sidebar.is-mobile-navbar {
  order: -1; /* Aparece ANTES del contenido (navbar superior) */
  width: 100%;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: 4px;
  padding: 0 12px;
  border-left: none;
  border-bottom: 2px solid var(--bs-border-color);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  height: 60px;
  background-color: var(--bs-body-bg);
}

.calendar-sidebar.is-mobile-navbar .sidebar-item {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 72px;
  height: 100%;
  padding: 8px 20px;
  margin-bottom: 0;
  border-radius: 0;
  font-size: 1.15rem;
  gap: 4px;
  border-bottom: 3px solid transparent;
  transition: all 0.18s ease;
}

.calendar-sidebar.is-mobile-navbar .sidebar-item:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-primary);
  border-bottom-color: var(--bs-primary-bg-subtle);
}

.calendar-sidebar.is-mobile-navbar .sidebar-item.active {
  color: var(--bs-primary);
  background-color: transparent;
  border-bottom-color: var(--bs-primary);
}

/* Suprimir el indicador de barra lateral en mobile */
.calendar-sidebar.is-mobile-navbar .sidebar-item.active::after {
  content: none;
}

.navbar-item-label {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.divider-horizontal {
  width: 1px;
  align-self: center;
  height: 28px;
  background-color: var(--bs-border-color);
  margin: 0 6px;
  flex-shrink: 0;
}
</style>
