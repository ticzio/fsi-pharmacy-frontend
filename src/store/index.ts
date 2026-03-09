import { createStore } from 'vuex'
import type { User, State } from '@/interfaces/utils'
import { useCookies } from '@/composables/useCookies'
import utils from './modules/utils'
import calendar from './modules/calendar'
import pagination from './modules/pagination'
import { useAuth } from '@/composables/useAuth'
import apiClient from '@/services/apiClient'

const persistedUser = localStorage.getItem('user')
const persistedAuth = localStorage.getItem('isAuthenticated')
const store = createStore({
  state: {
    user: persistedUser ? JSON.parse(persistedUser) : null,
    isAuthenticated: persistedAuth === 'true',
    sidebarCollapsed: true,
    isMobile: window.innerWidth <= 768,
  },
  mutations: {
    SET_USER(state: State, user: User) {
      state.user = user
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
    },
    LOGOUT(state: State) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.setItem('isAuthenticated', 'false')
    },
    TOGGLE_SIDEBAR(state: State) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    SET_IS_MOBILE(state: State, isMobile: boolean) {
      state.isMobile = isMobile
    },
  },
  actions: {
    // =====================
    // Métodos CRUD genéricos
    // =====================
    /**
     * getData
     * Uso:
     *   this.$store.dispatch('getData', { url: 'ruta', params: { foo: 'bar' } })
     *   // Retorna una promesa con los datos
     */
    getData({ commit }: { commit: Function }, form: { url: string; params?: Record<string, any> }) {
      return new Promise((resolve, reject) => {
        apiClient
          .get('/' + form.url, {
            params: { active: 1, ...(form.params || {}) },
          })
          .then((response) => resolve(response.data))
          .catch((error) => reject(error?.response?.data || error))
      })
    },
    /**
     * createData
     * Uso:
     *   this.$store.dispatch('createData', { url: 'ruta', data: { ... } })
     *   // Retorna una promesa con la respuesta
     */
    createData({ commit }: { commit: Function }, form: { url: string; data: any }) {
      return new Promise((resolve, reject) => {
        apiClient
          .post('/' + form.url, form.data)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error?.response?.data || error))
      })
    },
    /**
     * updateData
     * Uso:
     *   this.$store.dispatch('updateData', { url: 'ruta', id: 123, data: { ... } })
     *   // Retorna una promesa con la respuesta
     */
    updateData(
      { commit }: { commit: Function },
      form: { url: string; id: string | number; data: any },
    ) {
      return new Promise((resolve, reject) => {
        apiClient
          .put('/' + form.url + '/' + form.id, form.data)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error?.response?.data || error))
      })
    },
    changeStatus(
      { commit }: { commit: Function },
      form: { url: string; id: string | number; status: string | number },
    ) {
      return new Promise((resolve, reject) => {
        apiClient
          .put('/' + form.url + '/' + form.id + '/' + form.status)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error?.response?.data || error))
      })
    },

    initMobileListener({ commit }: { commit: Function }) {
      function checkIsMobile() {
        commit('SET_IS_MOBILE', window.innerWidth <= 1024)
      }
      window.addEventListener('resize', checkIsMobile)
      checkIsMobile()
    },
    // En tu store (ej: store/index.ts)

    login(
      // El primer argumento es el contexto de Vuex, lo desestructuramos para obtener 'commit'
      { commit }: { commit: Function },
      // El segundo argumento AHORA es el objeto payload. Lo desestructuramos también.
      { url, credentials }: { url: string; credentials: { email: string; password: string } },
    ) {
      const { resetAuthRole } = useAuth()
      const { setCookie } = useCookies()

      return new Promise((resolve, reject) => {
        apiClient
          .post(`${url}`, credentials, {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((response) => {
            if (response.data.code === 200) {
              setCookie('changan_admin_token', response.data.auth.token)
              setCookie('changan_admin_full_name', response.data.full_name)
              const id_role_hashing = btoa(response.data.id_role.toString())
              setCookie('changan_admin_id_role', id_role_hashing)
              setCookie('changan_admin_id_admin', response.data.id_admin)
              if (response.data.url_image) {
                setCookie('changan_admin_url_image', response.data.url_image)
              }
              commit('SET_USER', response.data)
              resetAuthRole()
              resolve(response.data)
            } else {
              reject(new Error(response.data.message || 'Error al iniciar sesión'))
            }
          })
          .catch((error) => {
            console.error('Error en Axios:', error.response?.data || error.message)
            reject(error?.response?.data || error)
          })
      })
    },
    logout({ commit }: { commit: Function }) {
      const { resetAuthRole } = useAuth()
      const { removeCookie } = useCookies()

      removeCookie('changan_admin_token')
      removeCookie('changan_admin_full_name')
      removeCookie('changan_admin_id_role')
      removeCookie('changan_admin_id_admin')
      removeCookie('changan_admin_url_image')

      resetAuthRole()

      commit('LOGOUT')
    },
    toggleSidebar({ commit }: { commit: Function }) {
      commit('TOGGLE_SIDEBAR')
    },
    async CancelClass(
      { dispatch }: { dispatch: Function },
      { url, data }: { url: string; data: any },
    ) {
      const fullUrl = `/${url}`
      return apiClient.put(fullUrl, data).then((r) => r.data)
    },
    clearRedisCache() {
      return new Promise((resolve, reject) => {
        apiClient
          .post('/auth/clear_redis')
          .then((response) => resolve(response.data))
          .catch((error) => reject(error?.response?.data || error))
      })
    },
    async downloadFile(
      { dispatch }: { dispatch: Function },
      { url, filename, fileType = 'xlsx' }: { url: string; filename: string; fileType?: string },
    ) {
      const fullUrl = `/${url}`

      try {
        const response = await apiClient.get(fullUrl, {
          responseType: 'blob',
          headers: {
            Accept:
              fileType === 'xlsx'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/octet-stream',
          },
        })

        // Crear blob con el tipo correcto
        const mimeType =
          fileType === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/octet-stream'

        const blob = new Blob([response.data], { type: mimeType })

        // Crear URL temporal
        const url_temp = window.URL.createObjectURL(blob)

        // Crear elemento <a> temporal para descargar
        const link = document.createElement('a')
        link.href = url_temp
        link.download = `${filename}.${fileType}`

        // Agregar al DOM, hacer click y remover
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Limpiar URL temporal
        window.URL.revokeObjectURL(url_temp)

        return { success: true, message: 'Archivo descargado correctamente' }
      } catch (error) {
        console.error('Error al descargar archivo:', error)
        throw error
      }
    },
  },
  getters: {
    isAuthenticated: (state: State) => state.isAuthenticated,
    currentUser: (state: State) => state.user,
    sidebarCollapsed: (state: State) => state.sidebarCollapsed,
    isMobile: (state: State) => state.isMobile,
  },
  modules: {
    utils: utils,
    calendar: calendar,
    pagination: pagination,
  },
})

export default store
