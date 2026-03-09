import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLogger } from '@/composables/useLogger'

export const useDayScheduleModel = () => {
  const store = useStore()
  const route = useRoute()
  const swalToast = useSwalToast()
  const logger = useLogger()

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const concessionaireSchedule = ref<Record<string, { close_time: string; open_time: string }>>({})
  const scheduleIds = ref<Record<string, number | null>>({})
  const scheduleErrors = ref<string[]>([])

  // Initialize schedules
  days.forEach((day) => {
    concessionaireSchedule.value[day] = { close_time: '', open_time: '' }
    scheduleIds.value[day] = null
  })

  const hasSchedules = computed(() => {
    for (const day of days) {
      const daySchedule = concessionaireSchedule.value[day]
      if (daySchedule && daySchedule.open_time && daySchedule.close_time) {
        return true
      }
    }
    return false
  })

  const getDaySchedules = async (concessionaireId?: string) => {
    const id = concessionaireId || route.params.id_concessionaire
    const params = {
      id_concessionaire: id,
    }

    try {
      const response = await store.dispatch('getData', {
        url: URLS.daySchedule.getAll,
        params,
      })

      if (response.code === 200 && response.data) {
        logger.logRequest(URLS.daySchedule.getAll, params, response)

        // Reset schedules
        days.forEach((day) => {
          concessionaireSchedule.value[day] = { close_time: '', open_time: '' }
          scheduleIds.value[day] = null
        })

        // Map existing schedules
        response.data.forEach((schedule: any) => {
          const day = schedule.day
          if (days.includes(day)) {
            concessionaireSchedule.value[day] = {
              open_time: schedule.start_time || schedule.open_time || '',
              close_time: schedule.end_time || schedule.close_time || '',
            }
            scheduleIds.value[day] = schedule.id || null
          }
        })
      }
    } catch (error: any) {
      logger.logRequest(URLS.daySchedule.getAll, params, error)
      throw error
    }
  }

  const formatSchedulesForApi = (
    scheduleObject: Record<string, { close_time: string | null; open_time: string | null }>,
    concessionaireId: string,
  ) => {
    return Object.entries(scheduleObject).reduce((accumulator: any[], [day, times]) => {
      const { open_time, close_time } = times
      if (open_time && close_time) {
        accumulator.push({
          id: scheduleIds.value[day],
          id_concessionaire: concessionaireId,
          day,
          start_time: open_time,
          end_time: close_time,
        })
      }
      return accumulator
    }, [])
  }

  const updateDaySchedule = async (concessionaireId?: string) => {
    const id = (concessionaireId || route.params.id_concessionaire) as string
    scheduleErrors.value = []

    if (!hasSchedules.value) {
      scheduleErrors.value.push(
        'Debes registrar al menos un horario completo para el concesionario',
      )
      swalToast.showFormErrors(scheduleErrors.value)
      return 400
    }

    try {
      const schedulePayload = formatSchedulesForApi(concessionaireSchedule.value, id)

      const response = await store.dispatch('updateData', {
        url: URLS.daySchedule.update,
        data: schedulePayload,
      })

      logger.logRequest(URLS.daySchedule.update, schedulePayload, response)

      if (response.code === 200 || response.code === 201) {
        swalToast.showSuccess('Horarios actualizados correctamente')
        return response.code
      }
      swalToast.showError(
        `${ERROR.errorUpdate || ERROR.errorCreate} para los horarios del concesionario`,
      )
      return response.code
    } catch (error: any) {
      logger.logRequest(URLS.daySchedule.update, '', error)
      swalToast.showError(
        `${ERROR.errorUpdate || ERROR.errorCreate} para los horarios del concesionario`,
      )
      return error.code || 500
    }
  }

  return {
    days,
    concessionaireSchedule,
    scheduleIds,
    hasSchedules,
    getDaySchedules,
    updateDaySchedule,
  }
}
