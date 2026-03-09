// Detect domain to conditionally include ID columns in table headers
const URL_DOMAIN = window.location.host
const VITE_DOMAIN_DEVELOP = import.meta.env.VITE_DOMAIN_DEVELOP
const IS_DEV_DOMAIN =
  URL_DOMAIN.includes('localhost:517') ||
  URL_DOMAIN.includes('localhost:417') ||
  (!!VITE_DOMAIN_DEVELOP && URL_DOMAIN.includes(VITE_DOMAIN_DEVELOP))

function maybeId(key: string = 'id') {
  return IS_DEV_DOMAIN ? [{ key, label: 'ID' }] : []
}

export const TITLE_SECTION_COMPONENT = {
  pharmacy: {
    title: 'Farmacia',
    description: 'Lista de farmacias',
    details: 'Detalles de la farmacia',
    new: 'Nueva farmacia',
    newDescription: 'Aquí puedes crear una nueva farmacia con toda la información necesaria.',
  },
  coupons: {
    title: 'Cupones',
    description: 'Lista de cupones',
    details: 'Detalles del cupón',
    new: 'Nuevo cupón',
    newDescription: 'Aquí puedes crear un nuevo cupón con toda la información necesaria.',
  },
  news: {
    title: 'Noticias',
    description: 'Lista de noticias',
    details: 'Detalles de la noticia',
    new: 'Nueva noticia',
    newDescription: 'Aquí puedes crear una nueva noticia con toda la información necesaria.',
  },
  notifications: {
    title: 'Notificaciones',
    description: 'Lista de notificaciones',
    details: 'Detalles de la notificación',
    new: 'Nueva notificación',
    newDescription: 'Aquí puedes crear una nueva notificación con toda la información necesaria.',
  },
  users: {
    title: 'Usuarios',
    description: 'Lista de usuarios',
    details: 'Detalles del usuario',
    new: 'Nuevo usuario',
    newDescription: 'Aquí puedes crear un nuevo usuario con toda la información necesaria.',
  },
  operators: {
    title: 'Operadores',
    description: 'Lista de operadores',
    details: 'Detalles del operador',
    new: 'Nuevo operador',
    newDescription: 'Aquí puedes crear un nuevo operador con toda la información necesaria.',
  },
  administrators: {
    title: 'Administradores',
    description: 'Lista de administradores',
    details: 'Detalles del administrador',
    new: 'Nuevo administrador',
    newDescription: 'Aquí puedes crear un nuevo administrador con toda la información necesaria.',
  },
  missions: {
    title: 'Misiones',
    description: 'Lista de misiones',
    details: 'Detalles de la misión',
    new: 'Nueva misión',
    newDescription: 'Aquí puedes crear una nueva misión con toda la información necesaria.',
  },
  levels: {
    title: 'Niveles',
    description: 'Lista de niveles',
    details: 'Detalles del nivel',
    new: 'Nuevo nivel',
    newDescription: 'Aquí puedes crear un nuevo nivel con toda la información necesaria.',
  },
  banners: {
    title: 'Banners Publicitarios',
    description: 'Lista de banners',
    details: 'Detalles del banner',
    new: 'Nuevo banner',
    newDescription: 'Aquí puedes crear un nuevo banner con toda la información necesaria.',
  },
  cities: {
    title: 'Ciudades',
    description: 'Lista de ciudades',
    details: 'Detalles de la ciudad',
    new: 'Nueva ciudad',
    newDescription: 'Aquí puedes crear una nueva ciudad con toda la información necesaria.',
  },
  template_pharmacies: {
    title: 'Plantillas de Farmacias',
    description: 'Lista de plantillas de farmacias',
    details: 'Detalles de la plantilla',
    new: 'Nueva plantilla',
    newDescription: 'Aquí puedes crear una nueva plantilla con toda la información necesaria.',
  },
}

export type TitleSectionKey = keyof typeof TITLE_SECTION_COMPONENT

export const TABLE_HEADERS = {
  administrator: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Foto' },
    { key: 'role.name', label: 'Rol' },
    { key: 'full_name', label: 'Nombre y apellido' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'active', label: 'Estatus' },
  ],
  pharmacy: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Logo' },
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'ubication', label: 'Ubicación' },
    { key: 'id_type_city', label: 'ID Ciudad' },
    { key: 'description', label: 'Descripción' },
    { key: 'lat', label: 'Latitud' },
    { key: 'lon', label: 'Longitud' },
    { key: 'opening_week', label: 'Apertura (Lun-Vie)' },
    { key: 'close_week', label: 'Cierre (Lun-Vie)' },
    { key: 'opening_saturday', label: 'Apertura (Sáb)' },
    { key: 'close_saturday', label: 'Cierre (Sáb)' },
    { key: 'opening_sunday', label: 'Apertura (Dom)' },
    { key: 'close_sunday', label: 'Cierre (Dom)' },
    { key: 'url_whatsapp', label: 'WhatsApp' },
    { key: 'url_instagram', label: 'Instagram' },
    { key: 'url_google_map', label: 'Google Maps' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'timestamp', label: 'Fecha de creación' },
    { key: 'active', label: 'Estatus' },
  ],
  coupons: [
    ...maybeId('id'),
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'id_level', label: 'ID Nivel' },
    { key: 'url_img', label: 'Imagen' },
    { key: 'start_date', label: 'Fecha de inicio' },
    { key: 'finish_date', label: 'Fecha de fin' },
    { key: 'timestamp', label: 'Fecha de creación' },
    { key: 'active', label: 'Estatus' },
  ],
  user: [
    ...maybeId('id_user'),
    { key: 'user.url_image', label: 'Foto' },
    { key: 'user.full_name', label: 'Nombre y apellido' },
    { key: 'user.email', label: 'Correo' },
    { key: 'user.phone', label: 'Teléfono' },
    { key: 'role.name', label: 'Rol' },
    { key: 'active', label: 'Estatus' },
  ],

  notifications: [
    ...maybeId('id'),
    { key: 'title', label: 'Titulo' },
    { key: 'description', label: 'Descripción' },
    { key: 'scheduled_date', label: 'Fecha programada' },
    { key: 'active', label: 'Estatus' },
  ],

  news: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Foto' },
    { key: 'title', label: 'Titulo' },
    { key: 'body_only_text', label: 'Descripción' },
    { key: 'creator.full_name', label: 'Nombre del creador' },
    { key: 'active', label: 'Estatus' },
  ],
  cities: [
    ...maybeId('id'),
    { key: 'state.name', label: 'Estado' },
    { key: 'name', label: 'Nombre' },
    { key: 'active', label: 'Estatus' },
  ],

  // Nuevas secciones de settings
  missions: [
    ...maybeId('id'),
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'active', label: 'Estatus' },
  ],
  levels: [
    ...maybeId('id'),
    { key: 'name', label: 'Nombre' },
    { key: 'required_points', label: 'Puntos Requeridos' },
    { key: 'active', label: 'Estatus' },
  ],
  banners: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Imagen' },
    { key: 'title', label: 'Título' },
    { key: 'active', label: 'Estatus' },
  ],
  benefitsBanners: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Imagen' },
    { key: 'title', label: 'Título' },
    { key: 'active', label: 'Estatus' },
  ],
  couponsBanners: [
    ...maybeId('id'),
    { key: 'url_image', label: 'Imagen' },
    { key: 'title', label: 'Título' },
    { key: 'active', label: 'Estatus' },
  ],
  template_pharmacies: [
    ...maybeId('id'),
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descripción' },
    { key: 'active', label: 'Estatus' },
  ],
}

export const TABLE_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  limit: 10,
}

export const TABLE_ACTIONS = {
  new: {
    name: 'new',
    icon: 'bi-plus fs-5',
    class: 'border-radius-left border-radius-right btn btn-primary fw-medium text-light',
    tooltip: 'Nuevo',
  },
  edit: {
    name: 'edit',
    icon: 'bi-list fs-5',
    class: 'border-radius-left border-radius-right btn btn-light fw-medium',
    tooltip: 'Ver detalles',
  },
  delete: {
    name: 'delete',
    icon: 'bi bi-trash3-fill fs-5 text-white',
    class: 'border-radius-left border-radius-right btn btn-danger fw-medium text-light',
    tooltip: 'Eliminar',
  },
  deactivate: {
    name: 'deactivate',
    icon: 'bi bi-check-circle-fill fs-5',
    class: 'border-radius-left border-radius-right fw-medium text-white',
    tooltip: 'Desactivar',
  },
}
