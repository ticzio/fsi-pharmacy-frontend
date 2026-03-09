<template>
  <div class="calendar-wrapper border-top bg-white rounded-bottom-4 overflow-hidden">
    <div v-if="displayType === 'grid'" class="grid-content">
      <div v-if="viewMode === 'month' || viewMode === 'week'" :class="`${viewMode}-container`">
        <div class="calendar-main-grid border-start border-top">
          <template v-if="viewMode === 'month'">
            <div v-for="day in weekDays" :key="day" class="grid-header border-end border-bottom">
              {{ day }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="day in weekGrid"
              :key="day.fullDateStr"
              class="grid-header border-end border-bottom"
              :class="{ 'today-text': day.isToday }"
            >
              {{ day.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }) }}
            </div>
          </template>

          <div
            v-for="(day, index) in viewMode === 'month' ? monthGrid : weekGrid"
            :key="index"
            class="grid-cell d-flex flex-column border-end border-bottom"
            :class="{
              'is-today': day.isToday,
              'is-other-month': day.isOtherMonth /* Esta clase ahora aplica el desenfoque */,
              'cell-month': viewMode === 'month',
              'cell-week': viewMode === 'week',
            }"
          >
            <div class="p-2 d-flex justify-content-start">
              <span class="day-label d-flex align-items-center justify-content-center fw-bold">{{
                day.date.getDate()
              }}</span>
            </div>

            <div class="events-scroll px-1 flex-grow-1">
              <div
                v-for="event in getEventsForDay(day.fullDateStr).slice(0, 3)"
                :key="event.id ?? index"
                class="event-pill d-flex align-items-center justify-content-between mb-1 transition-all"
                :class="[`event-${event.color || 'primary'}`]"
                @click="selectActivityAtendee(event)"
              >
                <div class="text-truncate ps-1 d-flex align-items-center gap-1">
                  <span class="time-chip" v-format-time="event.time"></span>
                  <span class="event-title-text text-truncate" :title="event.title">
                    {{ event.title }}
                  </span>
                </div>
                <span v-if="event.attendees_count" class="attendee-count me-1">
                  {{ event.attendees_count }}
                </span>
              </div>
              <!-- Badge "+X más" cuando hay más de 3 eventos -->
              <div
                v-if="getEventsForDay(day.fullDateStr).length > 3"
                class="more-events-badge"
                @click="showDayEvents(day.fullDateStr)"
              >
                +{{ getEventsForDay(day.fullDateStr).length - 3 }} más
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'day'" class="p-4 min-vh-50 d-flex flex-column">
        <div
          v-if="getEventsForDay(formatDate(currentDate)).length > 0"
          class="d-flex flex-column gap-3"
        >
          <div
            v-for="(event, idx) in getEventsForDay(formatDate(currentDate))"
            :key="event.id || idx"
            class="event-pill day-event-pill w-100 d-flex align-items-center justify-content-between px-3 py-2 transition-all"
            :class="[`event-${event.color || 'primary'}`]"
            @click="selectActivityAtendee(event)"
          >
            <div class="text-truncate ps-1 d-flex align-items-center gap-2">
              <span class="time-chip" v-format-time="event.time"></span>
              <span
                class="event-title-text text-truncate fw-bold text-white fs-6"
                :title="event.title"
              >
                {{ event.title }}
              </span>
            </div>
            <span v-if="event.attendees_count" class="attendee-count me-1">
              {{ event.attendees_count }}
            </span>
          </div>
        </div>

        <div
          v-else
          class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted py-5"
        >
          <div class="empty-state-icon mb-3">
            <i class="bi bi-calendar2-x-fill display-3 opacity-25"></i>
          </div>
          <h5 class="fw-bold mb-1">No hay actividades disponibles</h5>
          <p class="small">No se encontraron actividades programadas para este día.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IAppointment } from '@/interfaces/calendar'

// Props
const props = defineProps<{
  events: IAppointment[]
  viewMode: 'month' | 'week' | 'day'
  displayType: 'grid' | 'list'
  currentDate: Date
  weekDays: string[]
  monthGrid: any[]
  weekGrid: any[]
  getEventsForDay: (dateStr: string | null) => IAppointment[]
  getDaysDuration: (event: IAppointment) => number
  formatDate: (date: Date) => string
}>()

// Emits
const emit = defineEmits<{
  (e: 'select-activity-atendee', event: IAppointment): void
  (e: 'show-day-events', dateStr: string): void
}>()

// Methods
const selectActivityAtendee = (event: IAppointment) => {
  emit('select-activity-atendee', event)
}

const showDayEvents = (dateStr: string) => {
  emit('show-day-events', dateStr)
}
</script>

<style scoped>
/* Variables de Tema */
.calendar-wrapper {
  --cal-border: var(--bs-border-color);
  --cal-primary: var(--bs-primary);
  --cal-text: var(--bs-body-color);
}

/* Grilla Principal */
.calendar-main-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-color: var(--cal-border);
}

.grid-header {
  background: var(--bs-body-bg);
  padding: 0.75rem 0;
  text-align: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--cal-primary);
  border-color: var(--cal-border);
}

.cell-month {
  min-height: 140px;
}
.cell-week {
  min-height: 250px;
}

/* Celda base */
.grid-cell {
  background: var(--bs-body-bg);
  transition: all 0.3s ease; /* Suavizamos la transición */
  border-color: var(--cal-border);
  position: relative;
  overflow: hidden;
}

.grid-cell:hover {
  background-color: var(--bs-tertiary-bg);
}

/* Efecto para días fuera del mes actual */
.is-other-month {
  background-color: var(--bs-light); /* Fondo ligeramente más gris */
  opacity: 0.5; /* Transparencia para hundir visualmente el elemento */
  filter: grayscale(0.4) blur(0.4px); /* Desfoque sutil y desaturación */
  pointer-events: none; /* Opcional: deshabilita clics en días de otros meses */
}

/* Opcional: si quieres que al pasar el mouse se "aclaren" un poco */
.is-other-month:hover {
  opacity: 0.8;
  filter: grayscale(0.4) blur(0px);
}

/* Asegurar que el número de día también se vea atenuado */
.is-other-month .day-label {
  color: var(--bs-secondary-color);
  font-weight: normal;
}

/* Las píldoras de eventos en días fuera de mes también se atenúan */
.is-other-month .event-pill {
  filter: saturate(0.5);
  opacity: 0.7;
}
/* Indicadores de Día */
.day-label {
  font-size: 0.85rem;
  width: 28px;
  height: 28px;
  color: var(--cal-text);
}

.today-text,
.is-today .day-label {
  color: var(--cal-primary);
}

.is-today .day-label {
  background-color: var(--cal-primary);
  color: var(--bs-white);
  border-radius: 50%;
}

/* Píldoras de Evento (Estilo Cuadrícula) */
.event-pill {
  font-size: 0.78rem;
  padding: 3px 6px;
  border-radius: 6px;
  border-left: 3px solid transparent !important;
  cursor: pointer;
  line-height: 1.15;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.time-chip {
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  color: white;
  font-weight: 700;
  flex: 0 0 auto;
}

.event-title-text {
  font-weight: 600;
  color: white;
}

.event-pill:hover {
  filter: brightness(1.1);
  transform: translateX(2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Sistema de Colores dinámicos (Gradients from ModalList.vue) */
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

/* Vista Día */
.day-activity-card {
  border-left: 5px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.day-activity-card:hover {
  transform: translateY(-3px);
}

.time-tag {
  background: var(--bs-secondary-bg);
  font-size: 0.8rem;
  min-width: 100px;
  text-align: center;
}

/* Vista Día usando estilo de píldora (más grande que month/week) */
.day-event-pill {
  font-size: 0.95rem;
  border-radius: 12px;
  min-height: 52px;
  border-left: 5px solid transparent !important;
}

.day-event-pill .time-chip {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
}

.day-event-pill .attendee-count {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Scrollbars limpios */
.events-scroll {
  overflow-y: auto;
  scrollbar-width: none;
}
.events-scroll::-webkit-scrollbar {
  display: none;
}

.attendee-count {
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Badge "+X más" */
.more-events-badge {
  font-size: 0.7rem;
  color: var(--cal-primary);
  background: var(--bs-primary-bg-subtle);
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s ease;
}

.more-events-badge:hover {
  background: var(--cal-primary);
  color: var(--bs-white);
}

@media (max-width: 768px) {
  .grid-cell {
    min-height: 80px;
  }
  .small {
    font-size: 0.65rem;
  }
}
</style>
