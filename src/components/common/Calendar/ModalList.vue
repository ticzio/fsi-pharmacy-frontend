<template>
  <div class="modal fade" id="dayEventsModal" tabindex="-1" ref="dayEventsModalRef">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-light-subtle border-bottom py-3">
          <div class="d-flex flex-column">
            <h5 class="modal-title mb-0 fw-bold text-dark">
              <i class="bi bi-calendar-event me-2 text-primary"></i>
              Citas del
              {{
                selectedDayForModal
                  ? new Date(selectedDayForModal + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : ''
              }}
            </h5>
            <small v-if="selectedDayForModal" class="text-muted fw-medium mt-1">
              <i class="bi bi-collection-fill me-1 opacity-50"></i>
              {{ getEventsForDay(selectedDayForModal).length }}
              {{ getEventsForDay(selectedDayForModal).length === 1 ? 'bloque' : 'bloques' }}
              programados
            </small>
          </div>

          <button
            type="button"
            class="btn-close shadow-none"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          ></button>
        </div>

        <div class="modal-body p-3 bg-light-subtle">
          <div
            v-if="getEventsForDay(selectedDayForModal).length === 0"
            class="text-center py-5 m-3 rounded-4 text-muted bg-white shadow-sm"
          >
            <i class="bi bi-calendar2-x-fill display-4 opacity-25 d-block mb-3"></i>
            <h5 class="fw-bold mb-1">No hay actividades para este día</h5>
            <p class="small mb-0">No se encontraron eventos programados en esta fecha.</p>
          </div>

          <div v-else class="list-container d-flex flex-column gap-2 p-1">
            <button
              v-for="(event, idx) in getEventsForDay(selectedDayForModal)"
              :key="event.id !== null ? event.id : `modal-event-${idx}`"
              type="button"
              class="list-event-card p-3 border-0 shadow-sm text-start transition-all"
              :class="`event-${event.color || 'primary'}`"
              @click="selectActivityAtendee(event)"
            >
              <div class="d-flex flex-column w-100">
                <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <div class="time-tag-sm px-2 py-1 rounded-2 fw-bold">
                    <i class="bi bi-clock-fill me-1 opacity-75"></i>
                    {{ formatTime(event.time || '') }}
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
                  <span class="small opacity-75 fw-bold text-white">Detalle:</span>
                  <p class="mb-0 small opacity-75 d-inline ms-1 text-white">
                    {{ event.info }}
                  </p>
                </div>

                <div v-if="event.attendees_count" class="mt-2 text-end">
                  <span class="attendee-count">
                    <i class="bi bi-people-fill me-1"></i>
                    {{ event.attendees_count }} asistentes
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.js'
import type { IAppointment } from '@/interfaces/calendar'

// Props
const props = defineProps<{
  events: IAppointment[]
  selectedDay: string | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'edit-event', event: IAppointment): void
  (e: 'delete-event', event: IAppointment): void
}>()

// Refs
const dayEventsModalRef = ref<HTMLElement | null>(null)
const selectedDayForModal = ref<string | null>(null)

let dayEventsModal: any = null

// Helper functions
const formatTime = (timeString: string) => {
  if (!timeString) return ''
  // Si el tiempo viene en formato HH:MM:SS, extraer solo HH:MM
  return timeString.substring(0, 5)
}

const getEventsForDay = (dateStr: string | null) => {
  if (!dateStr) return []

  return props.events
    .filter((event) => {
      if (!event.date) return false

      const eventDate = new Date(event.date + 'T00:00:00')
      const targetDate = new Date(dateStr + 'T00:00:00')

      // Reset hours to compare only dates
      eventDate.setHours(0, 0, 0, 0)
      targetDate.setHours(0, 0, 0, 0)

      // Handle multi-day events
      if (event.date_end) {
        const endDate = new Date(event.date_end + 'T00:00:00')
        endDate.setHours(0, 0, 0, 0)

        return eventDate <= targetDate && targetDate <= endDate
      }

      return eventDate.getTime() === targetDate.getTime()
    })
    .sort((a, b) => {
      // Sort by time first, then by title
      const timeA = a.time || '00:00:00'
      const timeB = b.time || '00:00:00'
      const timeComparison = timeA.localeCompare(timeB)

      if (timeComparison !== 0) return timeComparison
      return (a.title || '').localeCompare(b.title || '')
    })
}

const selectActivityAtendee = (eventInfo: any) => {
  // Buscar el evento considerando id + date (+ id_activity_block si existe)
  const clickedEvent =
    props.events.find(
      (event) =>
        event.id === eventInfo.id &&
        event.date === eventInfo.date &&
        (!event.id_activity_block || event.id_activity_block === eventInfo.id_activity_block),
    ) || eventInfo

  emit('edit-event', clickedEvent)
  hideModal()
}

// Methods
const showModal = (dateStr: string) => {
  selectedDayForModal.value = dateStr
  if (dayEventsModal) dayEventsModal.show()
}

const hideModal = () => {
  if (dayEventsModal) dayEventsModal.hide()
}

// Initialize modal
const initializeModal = () => {
  if (dayEventsModalRef.value) {
    dayEventsModal = new Modal(dayEventsModalRef.value)
  }
}

// Watch for selectedDay prop changes
watch(
  () => props.selectedDay,
  (newDay) => {
    if (newDay) {
      showModal(newDay)
    }
  },
)

// Expose methods
defineExpose({
  showModal,
  hideModal,
  initializeModal,
})
</script>

<style scoped>
.modal-content {
  border-radius: 1.25rem;
  overflow: hidden;
}

.modal-header {
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

.list-container {
  max-height: 60vh;
  overflow-y: auto;
}

/* Tarjeta de Evento (Consistent with ListCalendar.vue) */
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

.attendee-count {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
  color: white;
}

/* Colores Pastel (Consistent with ListCalendar.vue) */
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

/* Scrollbar styling */
.list-container::-webkit-scrollbar {
  width: 6px;
}
.list-container::-webkit-scrollbar-track {
  background: transparent;
}
.list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
