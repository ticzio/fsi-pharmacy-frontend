import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useLogger } from '@/composables/useLogger'
import { useSwalToast } from '@/composables/useSwalToast'
import { URLS } from '@/const/api'
import type { IAppointment } from '@/interfaces/calendar'

export function useCustomCalendarModel() {
  const store = useStore()
  const logger = useLogger()
  const swalToast = useSwalToast()

  const appointments = ref<IAppointment[]>([])
  const isLoading = ref(false)
  const initialCalendarDate = ref(new Date())

  const mapStatusToColor = (statusId: number | string) => {
    const id = Number(statusId)
    switch (id) {
      case 1:
        return 'primary' // Pendiente (Azul)
      case 2:
        return 'danger' // Rechazada (Rojo)
      case 3:
        return 'success' // Confirmada (Verde)
      default:
        return 'primary'
    }
  }

  const getAppointments = async (idConcessionaire: string, manageLoading = true) => {
    const params = {
      id_concessionaire: idConcessionaire,
    }

    try {
      if (manageLoading) isLoading.value = true
      // 1. Fetch Appointments
      const response = await store.dispatch('getData', {
        url: URLS.appointment.getAll,
        params,
      })

      if (response.code === 200) {
        logger.logRequest(URLS.appointment.getAll, params, response)
        const rawData = response.data.data || response.data

        if (Array.isArray(rawData)) {
          // 2. Process each appointment and fetch additional details
          const processedAppointments: IAppointment[] = []

          // Filter allowed statuses: 1, 2, 3
          const allowedStatuses = [1, 2, 3]
          const filteredData = rawData.filter((item: any) =>
            allowedStatuses.includes(Number(item.id_appointment_status)),
          )

          for (const item of filteredData) {
            // Basic mapping
            const dateTime = item.appointment_date || ''
            const [datePart, timePart] = dateTime.split(' ')

            const appointment: IAppointment = {
              ...item,
              title: `${item.client?.full_name || 'Cliente'}`,
              time: timePart || '00:00:00',
              color: mapStatusToColor(item.id_appointment_status),
              info: item.concessionaire?.trade_name || item.concessionaire?.business_name || '',
              type: 'appointment',
              date: datePart || '',
            }

            processedAppointments.push(appointment)
          }

          appointments.value = processedAppointments

          // Set initial date
          if (appointments.value.length > 0) {
            const firstDateStr = appointments.value[0].date
            if (firstDateStr) {
              initialCalendarDate.value = new Date(firstDateStr + 'T00:00:00')
            }
          }
        }
      }
    } catch (error) {
      logger.logRequest(URLS.appointment.getAll, params, error)
      swalToast.showError('Error al cargar las citas')
    } finally {
      isLoading.value = false
    }
  }

  const getAppointmentById = async (id: string | number, manageLoading = true) => {
    try {
      if (manageLoading) isLoading.value = true
      const response = await store.dispatch('getData', {
        url: `${URLS.appointment.prefix}/${id}`,
      })

      if (response.code === 200) {
        logger.logRequest(URLS.appointment.prefix, { id }, response)
        const item = response.data

        // Process single appointment similar to getAppointments
        const dateTime = item.appointment_date || ''
        const [datePart, timePart] = dateTime.split(' ')

        const appointment: IAppointment = {
          ...item,
          title: `${
            item.service_concessionaire?.service_type?.name || item.notes || 'Cita de servicio'
          } - ${item.client?.full_name || 'Cliente'}`,
          time: timePart || '00:00:00',
          color: mapStatusToColor(item.id_appointment_status),
          info: item.concessionaire?.trade_name || item.concessionaire?.business_name || '',
          type: 'appointment',
          date: datePart || '',
        }

        return appointment
      }
      return null
    } catch (error) {
      logger.logRequest(URLS.appointment.prefix, { id }, error)
      swalToast.showError('Error al cargar la cita')
      return null
    } finally {
      if (manageLoading) isLoading.value = false
    }
  }

  const getAppointmentDetails = async (appointment: IAppointment, manageLoading = true) => {
    if (!appointment) return

    try {
      if (manageLoading) isLoading.value = true

      // A. Client Vehicle Details (includes Company and Vehicle info)
      if (appointment.id_client_vehicle) {
        const vehicleResponse = await store.dispatch('getData', {
          url: `${URLS.clientVehicle.prefix}/${appointment.id_client_vehicle}`,
        })
        if (vehicleResponse.code === 200 && vehicleResponse.data) {
          const clientVehicle = vehicleResponse.data
          appointment.client_vehicle = clientVehicle

          // A.1 Fetch deeper vehicle details if vehicle exists
          if (clientVehicle.vehicle) {
            const vehicle = clientVehicle.vehicle
            const requests = []

            // Prepare promises for parallel execution
            const fetchModel = vehicle.id_vehicle_model
              ? store.dispatch('getData', {
                  url: `${URLS.vehicleModel.prefix}/${vehicle.id_vehicle_model}`,
                })
              : Promise.resolve(null)

            const fetchTransmission = vehicle.id_type_transmission
              ? store.dispatch('getData', {
                  url: `${URLS.typeTransmission.prefix}/${vehicle.id_type_transmission}`,
                })
              : Promise.resolve(null)

            const fetchEngine = vehicle.id_type_engine
              ? store.dispatch('getData', {
                  url: `${URLS.typeEngine.prefix}/${vehicle.id_type_engine}`,
                })
              : Promise.resolve(null)

            const fetchBrake = vehicle.id_type_brake
              ? store.dispatch('getData', {
                  url: `${URLS.typeBrake.prefix}/${vehicle.id_type_brake}`,
                })
              : Promise.resolve(null)

            // Execute all fetching
            const [modelRes, transRes, engineRes, brakeRes] = await Promise.all([
              fetchModel,
              fetchTransmission,
              fetchEngine,
              fetchBrake,
            ])

            // Assign results if valid
            if (modelRes?.code === 200) vehicle.vehicle_model = modelRes.data
            if (transRes?.code === 200) vehicle.type_transmission = transRes.data
            if (engineRes?.code === 200) vehicle.type_engine = engineRes.data
            if (brakeRes?.code === 200) vehicle.type_brake = brakeRes.data
          }
        }
      }

      // B. Service Details
      // appointment.service_concessionaire.id_service_type
      if (appointment.service_concessionaire?.id_service_type) {
        const serviceResponse = await store.dispatch('getData', {
          url: `${URLS.typeService.prefix}/${appointment.service_concessionaire.id_service_type}`,
        })
        if (serviceResponse.code === 200 && serviceResponse.data) {
          if (!appointment.service_concessionaire) {
            appointment.service_concessionaire = {} as any
          }
          appointment.service_concessionaire!.service_type = serviceResponse.data
        }
      }
    } catch (error) {
      console.error('Error fetching details for appointment', appointment.id, error)
      swalToast.showError('Error al cargar los detalles de la cita')
    } finally {
      if (manageLoading) isLoading.value = false
    }
  }

  return {
    appointments,
    isLoading,
    initialCalendarDate,
    getAppointments,
    getAppointmentById,
    getAppointmentDetails,
    mapStatusToColor,
  }
}
