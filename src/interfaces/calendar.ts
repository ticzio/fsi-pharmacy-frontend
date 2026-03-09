export interface IConcessionaire {
  id: number
  id_city: number
  code: string
  business_name: string
  trade_name: string
  rif: string
  address: string
  description_services: string
  latitude: string | null
  longitude: string | null
  phone: string
  email: string
  url_logo: string
  active: number
  created_at: string
  updated_at: string
}

export interface IClient {
  id: number
  id_city: number
  code: string
  first_name: string
  last_name: string
  full_name: string
  birthday: string | null
  dni: string | null
  email: string
  phone: string
  url_image: string | null
  profile_completed: number
  active: number
  last_login: string | null
  count_login: number
  failed_attempts: number
  blocked_at: string | null
  login_attempts: number
  created_at: string
  updated_at: string
}

export interface IClientVehicle {
  id: number
  id_client: number
  id_vehicle_model: number
  code?: string
  plate: string
  year: number
  color: string
  vin: string | null
  active: number
  created_at: string
  updated_at: string
  vehicle_model?: {
    id: number
    name: string
    brand?: {
      id: number
      name: string
    }
  }
  // Propiedades expandidas
  vehicle?: {
    id: number
    license_plate: string
    type_fuel: string
    vin: string
    vehicle_model?: {
      name: string
      type_vehicle?: {
        name: string
      }
      brand?: {
        name: string
      }
    }
    type_transmission?: {
      name: string
    }
    type_engine?: {
      name: string
    }
    type_brake?: {
      name: string
    }
  }
  company?: {
    id: number
    business_name: string
    rif: string
    phone?: string
    email?: string
    address?: string
  }
}

export interface IServiceConcessionaire {
  id: number
  code: string
  id_concessionaire: number
  id_service_type: number
  is_available: number
  value_points: string
  active: number
  created_at: string
  updated_at: string
  service_type?: {
    id: number
    name: string
    description?: string
    duration?: number
  }
}

export interface IAppointmentStatus {
  id: number
  name: string
  active: number
  created_at: string
  updated_at: string
}

export interface IAppointment {
  id: number
  id_client: number
  id_client_vehicle: number
  id_concessionaire: number
  id_service_concessionaire: number
  id_appointment_status: number
  appointment_date: string
  notes: string
  date: string
  active: number
  created_at: string
  updated_at: string
  concessionaire?: IConcessionaire
  client_vehicle?: IClientVehicle | null
  client?: IClient
  service_concessionaire?: IServiceConcessionaire
  appointment_status?: IAppointmentStatus
  // Campos adicionales para UI del calendario
  title?: string
  time?: string
  color?: string
  info?: string
  type?: string
  date_end?: string
  attendees_count?: number
  id_activity_block?: number
  id_promotion?: number
}
