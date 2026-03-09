<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSwalToast } from '@/composables/useSwalToast'

import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import GeneralInfoStep from '@/components/Pharmacies/GeneralInfoStep.vue'
import ScheduleStep from '@/components/Pharmacies/ScheduleStep.vue'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'

const router = useRouter()
const swalToast = useSwalToast()
const store = useStore()

const loading = ref(false)
const currentStep = ref(1)
const transitionName = ref('slide-left')

watch(currentStep, (newValue, oldValue) => {
  transitionName.value = newValue > oldValue ? 'slide-left' : 'slide-right'
})

const currentStepText = computed(() => {
  return currentStep.value === 1 ? 'Información General' : 'Horarios de Atención de la Farmacia'
})

// Simulación de opciones para el Multiselect de Ciudades (idealmente cargar desde API/Store)
const cityOptions = ref([
  { id: 1, name: 'Caracas' },
  { id: 2, name: 'Maracaibo' },
  { id: 3, name: 'Valencia' },
  { id: 4, name: 'Barquisimeto' },
])

const form = reactive({
  name: '',
  code: '',
  description: '',
  id_type_city: null as any,
  ubication: '',
  url_google_map: '',
  lat: '',
  lon: '',
  url_image: null as File | null,
  url_instagram: '',
  url_whatsapp: '',
  phone: '',
  opening_week: '',
  close_week: '',
  opening_saturday: '',
  close_saturday: '',
  opening_sunday: '',
  close_sunday: '',
})

// Validation error messages
const phoneError = ref('')

const calculateProgress = computed(() => {
  const fields = [
    form.name,
    form.code,
    form.description,
    form.id_type_city,
    form.ubication,
    form.url_google_map,
    form.phone,
    form.url_instagram,
    form.url_whatsapp,
    form.opening_week,
    form.close_week,
    form.opening_saturday,
    form.close_saturday,
    form.opening_sunday,
    form.close_sunday,
  ]
  const filledFields = fields.filter((f) => {
    if (f === null || f === undefined) return false
    if (typeof f === 'string' && f.trim() === '') return false
    return true
  })
  return Math.round((filledFields.length / fields.length) * 100)
})

const handlePhoneError = (error: string) => {
  phoneError.value = error
}

const savePharmacy = async () => {
  // Validate basic requirements before sending
  if (!form.name || !form.code || phoneError.value) {
    swalToast.showError('Por favor, completa los campos obligatorios correctamente.')
    return
  }

  loading.value = true
  try {
    // Aquí iría el dispatch al action de Vuex o llamada API
    // await store.dispatch('pharmacies/createFarmacia', form)
    console.log('Guardando formulario:', form)

    swalToast.showSuccess('Farmacia creada exitosamente')
    router.push('/pharmacy')
  } catch (error) {
    console.error('Error al guardar:', error)
    swalToast.showError('Ocurrió un error al intentar guardar la farmacia.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100 gap-4">
      <div class="d-flex justify-content-between align-items-center">
        <titleSection
          :title="TITLE_SECTION_COMPONENT.pharmacy.new"
          :description="TITLE_SECTION_COMPONENT.pharmacy.newDescription"
          :show-logo="true"
        />
      </div>
      <div class="mb-1 mx-3">
        <ProgressBar
          :progress="calculateProgress"
          label="Progreso de registro:"
          :text="currentStepText"
        />
      </div>
      <div class="card border border-light shadow-sm rounded-4 p-4 flex-grow-1 overflow-auto">
        <form id="pharmacyForm" @submit.prevent="savePharmacy" class="d-flex flex-column gap-4">
          <transition :name="transitionName" mode="out-in">
            <GeneralInfoStep
              v-if="currentStep === 1"
              :form="form"
              :cityOptions="cityOptions"
              @update:phoneError="handlePhoneError"
            />
            <ScheduleStep v-else-if="currentStep === 2" :form="form" />
          </transition>
        </form>
      </div>
      <!-- BOTONES DE ACCIÓN -->
      <div class="d-flex justify-content-end gap-3 mt-4">
        <transition name="fade">
          <button
            v-if="currentStep === 2"
            type="button"
            class="btn btn-outline-secondary px-4 fw-medium"
            @click="currentStep = 1"
            :disabled="loading"
          >
            Atrás
          </button>
        </transition>

        <button
          type="submit"
          form="pharmacyForm"
          class="btn btn-primary px-4 fw-medium d-flex align-items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-save"></i>
          Guardar
        </button>

        <transition name="fade">
          <button
            v-if="currentStep === 1"
            type="button"
            class="btn btn-primary px-4 fw-medium d-flex align-items-center gap-2"
            @click="currentStep = 2"
          >
            Continuar
            <i class="bi bi-arrow-right"></i>
          </button>
        </transition>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* Transición hacia adelante (slide-left) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Transición hacia atrás (slide-right) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Transición para los botones (fade) */
.fade-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-leave-active {
  /* Oculta inmediatamente el botón anterior para evitar saltos en el flexbox */
  transition: all 0s;
  position: absolute;
  opacity: 0;
  visibility: hidden;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-leave-to {
  opacity: 0;
}
</style>
