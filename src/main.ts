import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import '@/assets/styles/forms.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { InitializeConfig } from '@/services/initApi'
import { setApiBaseURL } from '@/services/apiClient'
import { formatDate } from './directives/formatDate'
import { formatPercentage } from './directives/formatPercentage'
import { canDirective } from './directives/canDirective'
import { formatDateTime } from './directives/formatDateTime'
import { formatTime } from './directives/formatTime'

async function startApp() {
  await InitializeConfig()
  setApiBaseURL()

  const app = createApp(App)

  app.directive('format-date', formatDate)
  app.directive('format-percentage', formatPercentage)
  app.directive('can', canDirective)
  app.directive('format-date-time', formatDateTime)
  app.directive('format-time', formatTime)
  app.use(router)
  app.use(store)
  store.dispatch('initMobileListener')
  app.mount('#app')

  // Ocultar el loader inicial del index.html
  const appLoader = document.getElementById('app-loader')
  if (appLoader) {
    appLoader.style.transition = 'opacity 0.3s ease-out'
    appLoader.style.opacity = '0'
    setTimeout(() => appLoader.remove(), 300)
  }
}

startApp()
