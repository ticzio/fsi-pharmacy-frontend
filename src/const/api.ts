// 1. La función constructora de endpoints
function CreateApiEndpoints(prefix: string) {
  return {
    prefix: prefix,
    save: `${prefix}/save`,
    update: `${prefix}/update`,
    changeStatus: `${prefix}/change_status`,
    getAll: `${prefix}/all`,
  }
}

// 2. Un mapa más simple con tus recursos y sus prefijos
const RESOURCES = {
  concessionaire: 'concessionaire',
  daySchedule: 'day_schedule',
  administrator: 'admin',
  user: 'user',
  userConcessionaire: 'user_concessionaire',
  state: 'state',
  city: 'city',
  role: 'role',
  typeEnvironment: 'type_environment',
  typeFuel: 'type_fuel',
  notification: 'notification',
  typeTransmission: 'type_transmission',
  typeEngine: 'type_engine',
  typeColor: 'type_color',
  typeBrake: 'type_brake',
  typeVehicle: 'type_vehicle',
  typePurchase: 'type_purchase',
  typeService: 'type_service',
  vehicleModel: 'vehicle_model',
  typeNotification: 'type_notification',
  vehicleModelImage: 'vehicle_model_image',
  vehicleModelColor: 'vehicle_model_color',
  exhibition: 'exhibition',
  news: 'new',
  company: 'company',
  client: 'client',
  clientVehicle: 'client_vehicle',
  concessionaireService: 'concessionaire_service',
  appointment: 'appointment',
  serviceHistorical: 'service_historical',
  exhibitionMedia: 'exhibition_media',
  point: 'point',
}

// 3. Genera el objeto URLS final de forma dinámica
export const URLS = Object.fromEntries(
  Object.entries(RESOURCES).map(([key, prefix]) => [key, CreateApiEndpoints(prefix)]),
)

// Nota: NO ejecutar InitializeConfig aquí. Solo debe llamarse desde main.ts
