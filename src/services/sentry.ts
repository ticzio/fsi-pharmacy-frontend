import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

export function initializeSentry(app: App, dashboardName?: string) {
  const urlDomain = window.location.host
  const isDevelopment =
    urlDomain.includes('localhost') ||
    urlDomain.includes('127.0.0.1') ||
    urlDomain.includes('192.168.') ||
    urlDomain.includes('.local') ||
    urlDomain.includes(':517') ||
    urlDomain.includes(':417') ||
    import.meta.env.DEV

  let dsn = ''

  if (isDevelopment) {
    dsn = import.meta.env.VITE_SENTRY_DSN_DEVELOP
  } else if (
    urlDomain.includes('farmatest.redfsi.net') ||
    urlDomain.includes(import.meta.env.VITE_DOMAIN_DEVELOP)
  ) {
    dsn = import.meta.env.VITE_SENTRY_DSN_DEVELOP
  } else if (
    urlDomain.includes(import.meta.env.VITE_DOMAIN) ||
    urlDomain.includes('farmacia.redfsi.net')
  ) {
    dsn = import.meta.env.VITE_SENTRY_DSN
  } else {
    console.error(
      '[chamigo] Error de inicialización de Sentry:',
      `Dominio no reconocido: ${urlDomain}`,
    )
    return
  }

  if (!dsn) {
    return
  }

  Sentry.init({
    app,
    dsn,
    sendDefaultPii: true,
    initialScope: {
      tags: {
        dashboard: dashboardName || 'default',
        environment: isDevelopment ? 'development' : 'production',
      },
    },
  })
}

export { Sentry }
