import { ref } from 'vue'
import { useStore } from 'vuex'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLogger } from '@/composables/useLogger'

export interface IServiceHistoricalForm {
  id_client: number | null
  id_client_vehicle: number | null
  id_concessionaire: number | null
  id_appointment: number | null
  id_service_concessionaire: number | null
  service_date: string
  current_mileage: number | null
  notes: string
  invoice_number: string
  points_awarded: string
  review: string
}

const defaultForm = (): IServiceHistoricalForm => ({
  id_client: null,
  id_client_vehicle: null,
  id_concessionaire: null,
  id_appointment: null,
  id_service_concessionaire: null,
  service_date: '',
  current_mileage: null,
  notes: '',
  invoice_number: '',
  points_awarded: '',
  review: '',
})

export const useServiceHistoricalModel = () => {
  const store = useStore()
  const swalToast = useSwalToast()
  const logger = useLogger()

  const isLoading = ref(false)
  const formErrors = ref<string[]>([])
  const serviceHistoricalForm = ref<IServiceHistoricalForm>(defaultForm())

  const resetForm = () => {
    serviceHistoricalForm.value = defaultForm()
    formErrors.value = []
  }

  const validateForm = (): boolean => {
    formErrors.value = []

    if (!serviceHistoricalForm.value.id_client) {
      formErrors.value.push('El cliente es obligatorio')
    }
    if (!serviceHistoricalForm.value.id_client_vehicle) {
      formErrors.value.push('El vehículo del cliente es obligatorio')
    }
    if (!serviceHistoricalForm.value.id_concessionaire) {
      formErrors.value.push('El concesionario es obligatorio')
    }
    if (!serviceHistoricalForm.value.service_date) {
      formErrors.value.push('La fecha de servicio es obligatoria')
    }

    return formErrors.value.length === 0
  }

  const saveServiceHistorical = async (): Promise<number> => {
    if (!validateForm()) {
      swalToast.showFormErrors(formErrors.value)
      return 400
    }

    try {
      isLoading.value = true

      const response = await store.dispatch('createData', {
        url: URLS.serviceHistorical.save,
        data: serviceHistoricalForm.value,
      })

      logger.logRequest(URLS.serviceHistorical.save, serviceHistoricalForm.value, response)

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess('Historial de servicio guardado correctamente')
        return response.code
      }

      swalToast.showError(ERROR.errorCreate)
      return response.code
    } catch (error: any) {
      logger.logRequest(URLS.serviceHistorical.save, serviceHistoricalForm.value, error)
      swalToast.showError(ERROR.errorCreate)
      return error?.code || 500
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    formErrors,
    serviceHistoricalForm,
    resetForm,
    validateForm,
    saveServiceHistorical,
  }
}
