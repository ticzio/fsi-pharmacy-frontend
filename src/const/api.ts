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
  pharmacy: 'pharmacy',
  user: 'user',
  state: 'state',
  city: 'city',
  role: 'rol',
  notification: 'notifications',
  news: 'news',
  client: 'client',
  level: 'level',
  coupon: 'coupon',
  exchange: 'exchange',
  banner: 'banner',
  benefit: 'benefit',
  mission: 'mission',
  appUbication: 'app_ubication',
  template_message: 'message_template',
}

// 3. Genera el objeto URLS final de forma dinámica
export const URLS = Object.fromEntries(
  Object.entries(RESOURCES).map(([key, prefix]) => [key, CreateApiEndpoints(prefix)]),
)

// Nota: NO ejecutar InitializeConfig aquí. Solo debe llamarse desde main.ts
