<script setup lang="ts">
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps<{
  form: any
}>()

const scheduleSections = [
  {
    id: 'week',
    title: 'Lunes a Viernes',
    subtitle: 'Días hábiles regulares',
    icon: 'bi-calendar4-week',
    colorClass: 'bg-primary-subtle',
    openModel: 'opening_week',
    closeModel: 'close_week',
  },
  {
    id: 'saturday',
    title: 'Sábados',
    subtitle: 'Fin de semana',
    icon: 'bi-calendar4-event',
    colorClass: 'bg-success-subtle',
    openModel: 'opening_saturday',
    closeModel: 'close_saturday',
  },
  {
    id: 'sunday',
    title: 'Domingos',
    subtitle: 'Día de descanso',
    icon: 'bi-calendar4',
    colorClass: 'bg-danger-subtle',
    openModel: 'opening_sunday',
    closeModel: 'close_sunday',
  },
]
</script>

<template>
  <div>
    <div
      v-for="section in scheduleSections"
      :key="section.id"
      class="schedule-card bg-white rounded-3 border shadow-sm"
    >
      <div class="row align-items-center g-2 g-md-3">
        <div class="col-12 col-md-4 d-flex align-items-center gap-3">
          <div
            class="icon-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white"
            :class="section.colorClass"
            style="width: 44px; height: 44px"
          >
            <i :class="['bi', section.icon, 'fs-5']"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.95rem">{{ section.title }}</h6>
            <small class="text-muted d-block" style="font-size: 0.8rem">{{
              section.subtitle
            }}</small>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <BaseInput
            :id="`opening_${section.id}`"
            type="time"
            v-model="form[section.openModel]"
            label="Hora de Apertura"
          />
        </div>
        <div class="col-6 col-md-4">
          <BaseInput
            :id="`close_${section.id}`"
            type="time"
            v-model="form[section.closeModel]"
            label="Hora de Cierre"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-card {
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-color: #f3f4f6 !important;
}

.schedule-card:last-child {
  margin-bottom: 0;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05) !important;
  border-color: #e5e7eb !important;
}

.icon-box {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.schedule-card:hover .icon-box {
  transform: scale(1.1) rotate(-5deg);
}

/* Reducimos el margen que BaseInput trae por defecto porque estamos dentro de una row que ya tiene gap (g-3) */
:deep(.form-group-custom) {
  margin-bottom: 0 !important;
}
</style>
