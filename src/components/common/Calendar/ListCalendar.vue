<template>
  <div
    v-if="displayType === 'list'"
    class="list-container bg-white rounded-bottom-4 shadow-sm overflow-hidden d-flex flex-column"
  >
    <div
      v-if="currentWeekRange && (viewMode === 'month' || viewMode === 'week')"
      class="week-range-header bg-light-subtle border-bottom px-3 py-2"
    >
      <span class="small fw-bold text-muted">
        <i class="bi bi-calendar-week me-1"></i>
        {{
          viewMode === 'month'
            ? `Semana ${currentPage}: ${formatWeekRange(
                currentWeekRange.startStr,
              )} - ${formatWeekRange(currentWeekRange.endStr)}`
            : `${formatWeekRange(currentWeekRange.startStr)} - ${formatWeekRange(
                currentWeekRange.endStr,
              )}`
        }}
      </span>
    </div>

    <div
      v-else-if="currentWeekRange && viewMode === 'day'"
      class="week-range-header bg-light-subtle border-bottom px-3 py-2"
    >
      <span class="small fw-bold text-muted text-capitalize">
        <i class="bi bi-calendar-event me-1"></i>
        {{
          new Date(currentWeekRange.startStr + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        }}
      </span>
    </div>

    <div v-if="eventsForCurrentWeek.length > 0" class="p-3 list-events-scroll">
      <div
        v-for="(event, index) in eventsForCurrentWeek"
        :key="event.id + '-' + event.date"
        class="mb-1"
      >
        <div
          v-if="index === 0 || event.date !== eventsForCurrentWeek[index - 1].date"
          class="list-date-header border-bottom mb-3"
          :class="{ 'is-today-text': isToday(event.date) }"
        >
          <span class="date-text text-capitalize fw-bold">
            {{
              new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            }}
          </span>
        </div>

        <div
          class="list-event-card mb-2 p-3 border-0 shadow-sm transition-all"
          :class="`event-${event.color || 'primary'}`"
          @click="selectActivityAtendee(event)"
        >
          <div class="d-flex flex-column w-100">
            <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
              <div class="time-tag-sm px-2 py-1 rounded-2 fw-bold">
                <i class="bi bi-clock-fill me-1 opacity-75"></i>
                <span v-format-time="event.time"></span>
              </div>
              <span class="opacity-25 text-white">|</span>
              <span class="small text-uppercase fw-bold text-white opacity-75">
                {{
                  event.type === 'activity_block'
                    ? 'Actividad'
                    : event.type === 'appointment'
                      ? 'Cita'
                      : 'Evento'
                }}:
              </span>
              <span class="fw-bold text-white fs-6">{{ event.title }}</span>
            </div>

            <div v-if="event.info" class="mt-1 ps-1">
              <span class="small opacity-75 fw-bold text-white">Locación:</span>
              <p class="mb-0 small opacity-75 d-inline ms-1 text-white">
                {{ event.info || 'Locación no especificada.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!eventsForCurrentWeek.length" class="text-center py-5 m-3 rounded-4 text-muted">
      <i class="bi bi-calendar2-x-fill display-4 opacity-25 d-block mb-3"></i>
      <h5 class="fw-bold mb-1">No hay citas disponibles</h5>
      <p class="small mb-0">No se encontraron citas programadas para esta semana.</p>
    </div>

    <div
      v-if="totalPages > 1 && viewMode === 'month'"
      class="pagination-footer border-top d-flex justify-content-between align-items-center p-3 bg-light-subtle"
    >
      <button
        class="btn btn-sm btn-outline-secondary px-3 fw-bold"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        <i class="bi bi-chevron-left"></i> Anterior
      </button>
      <span class="text-muted small fw-bold">Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        class="btn btn-sm btn-outline-secondary px-3 fw-bold"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        Siguiente <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAppointment } from '@/interfaces/calendar'

// Interfaz para el rango de semana
interface WeekRange {
  start: Date
  end: Date
  startStr: string
  endStr: string
}

// Props
const props = defineProps<{
  displayType: 'grid' | 'list'
  viewMode: 'month' | 'week' | 'day'
  events: IAppointment[]
  eventsForCurrentWeek: IAppointment[]
  currentPage: number
  totalPages: number
  currentWeekRange?: WeekRange
}>()

// Emits
const emit = defineEmits<{
  (e: 'select-activity-atendee', event: IAppointment): void
  (e: 'prev-page'): void
  (e: 'next-page'): void
}>()

// Methods
const formatWeekRange = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const isToday = (dateString: string) => {
  const today = new Date()
  const date = new Date(dateString + 'T00:00:00')
  return today.toDateString() === date.toDateString()
}

const selectActivityAtendee = (event: IAppointment) => {
  emit('select-activity-atendee', event)
}

const prevPage = () => {
  emit('prev-page')
}

const nextPage = () => {
  emit('next-page')
}
</script>

<style scoped>
.list-container {
  --cal-primary: var(--bs-primary);
  --cal-border: var(--bs-border-color);
  max-height: 70vh;
}

.list-events-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Encabezados */
.list-date-header {
  padding: 1.25rem 0.5rem 0.5rem;
  font-size: 0.95rem;
  color: var(--bs-white);
  border-color: var(--cal-border);
}

.is-today-text {
  color: var(--bs-white);
}

/* Tarjeta de Lista */
.list-event-card {
  border-radius: 12px;
  cursor: pointer;
  border-left: 5px solid transparent !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.list-event-card:hover {
  transform: translateX(6px);
  filter: brightness(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.time-tag-sm {
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  color: white;
  backdrop-filter: blur(4px);
}

/* Colores Pastel (Consistencia Total con ModalList.vue) */
.event-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #3498db 100%);
  border-left-color: #2980b9 !important;
}
.event-success {
  background: linear-gradient(135deg, var(--bs-success) 0%, #2ecc71 100%);
  border-left-color: #27ae60 !important;
}
.event-warning {
  background: linear-gradient(135deg, var(--bs-warning) 0%, #f1c40f 100%);
  border-left-color: #f39c12 !important;
}
.event-danger {
  background: linear-gradient(135deg, var(--bs-danger) 0%, #e74c3c 100%);
  border-left-color: #c0392b !important;
}
.event-info {
  background: linear-gradient(135deg, var(--bs-info) 0%, #00d2ff 100%);
  border-left-color: #0099cc !important;
}

/* Helpers */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.btn-outline-secondary {
  border-color: var(--bs-border-color);
  color: var(--bs-secondary-color);
  font-size: 0.75rem;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: var(--bs-body-bg);
  border-color: var(--cal-primary);
  color: var(--cal-primary);
}

.pagination-footer {
  background-color: var(--bs-tertiary-bg);
}
</style>
