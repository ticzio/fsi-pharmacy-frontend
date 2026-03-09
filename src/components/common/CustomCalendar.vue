<template>
  <div class="calendar-container">
    <!-- Encabezado del Calendario -->
    <div class="calendar-header rounded-top-4">
      <div
        class="d-flex align-items-center gap-2"
        :class="{ 'd-flex justify-content-between w-100': isMobile }"
      >
        <button @click="prevPeriod" class="btn btn-outline-light btn-circle">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button @click="nextPeriod" class="btn btn-outline-light btn-circle">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
      <h2 class="text-uppercase fs-5 fw-medium" :class="{ 'fs-6': isMobile }">{{ headerTitle }}</h2>

      <div class="btn-group d-none d-md-block">
        <button
          class="btn"
          :class="viewMode === 'month' ? 'btn-light' : 'btn-outline-light'"
          @click="viewMode = 'month'"
        >
          Mes
        </button>
        <button
          class="btn"
          :class="viewMode === 'week' ? 'btn-light' : 'btn-outline-light'"
          @click="viewMode = 'week'"
        >
          Semana
        </button>
        <button
          class="btn"
          :class="viewMode === 'day' ? 'btn-light' : 'btn-outline-light'"
          @click="viewMode = 'day'"
        >
          Día
        </button>
      </div>
    </div>

    <!-- Contenido: Calendario + Sidebar -->
    <div class="calendar-body">
      <!-- Sidebar / Navbar (en mobile se renderiza arriba) -->
      <SideBar
        :display-type="displayType"
        :view-mode="viewMode"
        :is-mobile="isMobile"
        @display-type-change="displayType = $event"
        @view-mode-change="viewMode = $event"
        @create-event="handleCreateEvent"
        @refresh-calendar="refreshCalendar"
      />

      <!-- Área de Contenido Principal -->
      <div class="calendar-content position-relative">
        <div
          v-if="loading"
          class="loading-overlay d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75"
        >
          <div class="spinner-border text-primary mb-2" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <span class="text-primary fw-medium small">Recargando agenda...</span>
        </div>

        <Grid
          :events="events"
          :view-mode="viewMode"
          :display-type="displayType"
          :current-date="currentDate"
          :week-days="weekDays"
          :month-grid="monthGrid"
          :week-grid="weekGrid"
          :get-events-for-day="getEventsForDay"
          :get-days-duration="getDaysDuration"
          :format-date="formatDate"
          @select-activity-atendee="selectActivityAtendee"
          @show-day-events="showDayEventsModal"
        />
        <ListCalendar
          :display-type="displayType"
          :view-mode="viewMode"
          :events="events"
          :events-for-current-week="eventsForCurrentWeek"
          :current-page="currentPage"
          :total-pages="totalPages"
          :current-week-range="currentListRange"
          @select-activity-atendee="selectActivityAtendee"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>
    </div>
  </div>

  <ModalList
    ref="modalListRef"
    :events="events"
    :selected-day="selectedDayForModal"
    @edit-event="selectActivityAtendee($event)"
    @delete-event="emit('delete-event', $event)"
  />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import store from '@/store'
import type { IAppointment } from '@/interfaces/calendar'
import ModalList from '@/components/common/Calendar/ModalList.vue'
import SideBar from '@/components/common/Calendar/SideBar.vue'
import Grid from '@/components/common/Calendar/Grid.vue'
import ListCalendar from '@/components/common/Calendar/ListCalendar.vue'

// --- PROPS & EMITS ---
const props = defineProps<{ events: IAppointment[]; initialDate?: Date; loading?: boolean }>()

const emit = defineEmits<{
  (e: 'edit-event', event: IAppointment): void
  (e: 'delete-event', event: IAppointment): void
  (
    e: 'date-range-change',
    payload: { start_date: string; end_date: string; viewMode: string },
  ): void
  (e: 'refresh-calendar'): void
  (e: 'create-event'): void
}>()

// --- HELPERS ---
const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// --- STATE ---
const modalListRef = ref<InstanceType<typeof ModalList> | null>(null)
const currentDate = ref(props.initialDate || new Date())

watch(
  () => props.initialDate,
  (val) => {
    if (val) currentDate.value = new Date(val)
  },
)
const viewMode = ref<'month' | 'week' | 'day'>('month')
const displayType = ref<'grid' | 'list'>('grid')
const isMobile = ref(false)
const selectedDayForModal = ref<string | null>(null)
const currentPage = ref(1)
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// --- COMPUTED PROPERTIES ---
const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

const headerTitle = computed(() => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  if (viewMode.value === 'month') return currentDate.value.toLocaleString('es-ES', options)
  if (viewMode.value === 'week') {
    const start = new Date(currentDate.value)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }
  return currentDate.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const monthGrid = computed(() => {
  const grid = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const firstDayOfMonth = new Date(year.value, month.value, 1)
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const startDayOfWeek = firstDayOfMonth.getDay()
  const prevMonthLastDay = new Date(year.value, month.value, 0).getDate()

  for (let i = startDayOfWeek; i > 0; i--) {
    const date = new Date(year.value, month.value - 1, prevMonthLastDay - i + 1)
    grid.push({ date, fullDateStr: formatDate(date), isToday: false, isOtherMonth: true })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year.value, month.value, i)
    grid.push({
      date,
      fullDateStr: formatDate(date),
      isToday: date.getTime() === today.getTime(),
      isOtherMonth: false,
    })
  }
  const gridEndFiller = 42 - grid.length
  for (let i = 1; i <= gridEndFiller; i++) {
    const date = new Date(year.value, month.value + 1, i)
    grid.push({ date, fullDateStr: formatDate(date), isToday: false, isOtherMonth: true })
  }
  return grid
})

const weekGrid = computed(() => {
  const grid = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    grid.push({ date, fullDateStr: formatDate(date), isToday: date.getTime() === today.getTime() })
  }
  return grid
})

const listableDays = computed(() => {
  let daysInRange =
    viewMode.value === 'month'
      ? monthGrid.value.filter((d) => !d.isOtherMonth)
      : viewMode.value === 'week'
        ? weekGrid.value
        : [
            {
              date: currentDate.value,
              fullDateStr: formatDate(currentDate.value),
              isToday: formatDate(currentDate.value) === formatDate(new Date()),
            },
          ]

  return daysInRange
    .map((day) => ({ ...day, events: getEventsForDay(day.fullDateStr) }))
    .filter((day) => day.events.length > 0 || viewMode.value === 'day')
})

const flatListOfEventsForList = computed(() => {
  if (displayType.value !== 'list') return []
  return listableDays.value.flatMap((day) =>
    day.events.map((event) => ({ ...event, isToday: day.isToday })),
  )
})

// Calcular las 4 semanas del mes con sus rangos de fechas
const monthWeeks = computed(() => {
  const firstDay = new Date(year.value, month.value, 1)
  const lastDay = new Date(year.value, month.value + 1, 0)
  const weeks: { start: Date; end: Date; startStr: string; endStr: string }[] = []

  // Semana 1: día 1 al 7
  weeks.push({
    start: new Date(year.value, month.value, 1),
    end: new Date(year.value, month.value, 7),
    startStr: formatDate(new Date(year.value, month.value, 1)),
    endStr: formatDate(new Date(year.value, month.value, 7)),
  })

  // Semana 2: día 8 al 14
  weeks.push({
    start: new Date(year.value, month.value, 8),
    end: new Date(year.value, month.value, 14),
    startStr: formatDate(new Date(year.value, month.value, 8)),
    endStr: formatDate(new Date(year.value, month.value, 14)),
  })

  // Semana 3: día 15 al 21
  weeks.push({
    start: new Date(year.value, month.value, 15),
    end: new Date(year.value, month.value, 21),
    startStr: formatDate(new Date(year.value, month.value, 15)),
    endStr: formatDate(new Date(year.value, month.value, 21)),
  })

  // Semana 4: día 22 al último día del mes
  weeks.push({
    start: new Date(year.value, month.value, 22),
    end: lastDay,
    startStr: formatDate(new Date(year.value, month.value, 22)),
    endStr: formatDate(lastDay),
  })

  return weeks
})

// Eventos filtrados por la semana actual
const eventsForCurrentWeek = computed(() => {
  if (displayType.value !== 'list') return []

  if (viewMode.value === 'month') {
    const week = monthWeeks.value[currentPage.value - 1]
    if (!week) return []
    return flatListOfEventsForList.value.filter((event) => {
      return event.date >= week.startStr && event.date <= week.endStr
    })
  }

  if (viewMode.value === 'week') {
    const start = new Date(currentDate.value)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const startStr = formatDate(start)
    const endStr = formatDate(end)
    return flatListOfEventsForList.value.filter((event) => {
      return event.date >= startStr && event.date <= endStr
    })
  }

  // viewMode === 'day'
  const dayStr = formatDate(currentDate.value)
  return flatListOfEventsForList.value.filter((event) => event.date === dayStr)
})

// Paginación: month usa 4 semanas, week/day no paginan
const totalPages = computed(() => (viewMode.value === 'month' ? 4 : 1))

// Rango actual para header en ListCalendar
const currentListRange = computed(() => {
  if (viewMode.value === 'month') return monthWeeks.value[currentPage.value - 1]

  if (viewMode.value === 'week') {
    const start = new Date(currentDate.value)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return {
      start,
      end,
      startStr: formatDate(start),
      endStr: formatDate(end),
    }
  }

  const day = new Date(currentDate.value)
  day.setHours(0, 0, 0, 0)
  const dayStr = formatDate(day)
  return {
    start: day,
    end: day,
    startStr: dayStr,
    endStr: dayStr,
  }
})

// --- METHODS ---
const getEventsForDay = (dateStr: string | null) => {
  if (!dateStr) return []
  return props.events
    .filter((e) =>
      e.type === 'event'
        ? dateStr >= e.date && dateStr <= (e.date_end || e.date)
        : e.date === dateStr,
    )
    .map((e) => ({
      ...e,
      isMultiDay: e.type === 'event' && !!e.date_end && e.date_end !== e.date,
      rangePosition:
        e.type === 'event' && e.date_end
          ? dateStr === e.date
            ? 'start'
            : dateStr === e.date_end
              ? 'end'
              : 'middle'
          : 'single',
    }))
    .sort((a, b) => (a.time || '00:00:00').localeCompare(b.time || '00:00:00'))
}

const getDaysDuration = (event: any) => {
  if (!event.date_end || event.date_end === event.date) return 1
  const diff = Math.abs(new Date(event.date_end).getTime() - new Date(event.date).getTime())
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'month') d.setMonth(d.getMonth() - 1)
  else if (viewMode.value === 'week') d.setDate(d.getDate() - 7)
  else d.setDate(d.getDate() - 1)
  currentDate.value = d
}

const nextPeriod = () => {
  const d = new Date(currentDate.value)
  if (viewMode.value === 'month') d.setMonth(d.getMonth() + 1)
  else if (viewMode.value === 'week') d.setDate(d.getDate() + 7)
  else d.setDate(d.getDate() + 1)
  currentDate.value = d
}

const selectActivityAtendee = (eventInfo: any) => {
  const clickedEvent =
    props.events.find((e) => e.id == eventInfo.id && e.date === eventInfo.date) || eventInfo
  store.dispatch('calendar/setSelectedEvent', clickedEvent)
  if (clickedEvent.type === 'activity_block') {
    store.dispatch(
      clickedEvent.id_promotion
        ? 'calendar/setClickedPreviewPromotion'
        : 'calendar/setClickedPreviewActivity',
      true,
    )
  } else {
    store.dispatch('calendar/setClickedPreviewEvent', true)
  }

  emit('edit-event', clickedEvent)
}

const handleCreateEvent = () => {
  emit('create-event')
}
const showDayEventsModal = (dateStr: string) => {
  selectedDayForModal.value = dateStr
  modalListRef.value?.showModal(dateStr)
}
const refreshCalendar = () => {
  console.log('CustomCalendar: refresh-calendar event received form Sidebar, emitting to parent')
  emit('refresh-calendar')
}

const checkScreenSize = () => {
  if (window.innerWidth < 1024) {
    isMobile.value = true
    displayType.value = 'list'
    if (viewMode.value !== 'month') viewMode.value = 'month'
  } else {
    isMobile.value = false
    displayType.value = 'grid'
  }
}

onMounted(() => {
  if (modalListRef.value) modalListRef.value.initializeModal()
  window.addEventListener('resize', checkScreenSize)
  checkScreenSize()
})
onBeforeUnmount(() => window.removeEventListener('resize', checkScreenSize))

watch([viewMode, currentDate], () => {
  currentPage.value = 1
  let start: Date
  let end: Date

  if (viewMode.value === 'month') {
    start = new Date(year.value, month.value, 1)
    end = new Date(year.value, month.value + 1, 0)
  } else if (viewMode.value === 'week') {
    const weekStart = new Date(currentDate.value)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    start = weekStart
    end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
  } else {
    // Vista día: usar una copia de currentDate
    start = new Date(currentDate.value)
    end = new Date(currentDate.value)
  }

  emit('date-range-change', {
    start_date: formatDate(start),
    end_date: formatDate(end),
    viewMode: viewMode.value,
  })
})
</script>
<style scoped>
/* Estilos para el cuerpo del calendario */
.calendar-body {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

/* En mobile: apilamos de forma vertical para que el navbar vaya arriba */
@media (max-width: 1023px) {
  .calendar-body {
    flex-direction: column;
  }
}

/* Área de Contenido Principal */
.calendar-content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: white;
}

.calendar-header {
  background-color: var(--bs-primary);
  color: var(--bs-white);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.calendar-header h2 {
  margin: 0;
  font-weight: 600;
  font-size: 1.5rem;
  text-transform: capitalize;
  text-align: center;
  flex-grow: 1;
}

/* Badge de reservas */
.attendees-badge {
  font-size: 0.65rem;
  padding: 2px 5px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

/* Vista día: badge más grande */
.event-entry.fs-6 .attendees-badge {
  font-size: 0.75rem;
  border-radius: 0.25rem;
  min-width: auto;
  height: auto;
  padding: 3px 8px;
}

.range-indicator {
  font-size: 0.7rem;
  margin-right: 4px;
  opacity: 0.8;
}

.btn-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal-header {
  background-color: var(--bs-primary);
  color: var(--bs-dark);
}
.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.see-more-btn {
  font-size: 0.75rem;
  padding: 2px 6px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}
</style>
