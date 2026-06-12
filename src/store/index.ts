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
      const isAbsolute = form.url.startsWith('http')
      const finalUrl = isAbsolute ? form.url : '/' + form.url
      return new Promise((resolve, reject) => {
        apiClient
          .get(finalUrl, {
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
    /**
     * updateDataNoId
     * Uso:
     *   this.$store.dispatch('updateDataNoId', { url: 'ruta', data: { ... } })
     *   // Retorna una promesa con la respuesta sin concatenar ID al final
     */
    updateDataNoId({ commit }: { commit: Function }, form: { url: string; data: any }) {
      return new Promise((resolve, reject) => {
        apiClient
          .put('/' + form.url, form.data)
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
      { url, credentials }: { url: string; credentials: { email: string; password: string; turnstile_token?: string } },
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
              const userData = response.data.data
              setCookie('fsi_pharmacy_token', userData.auth.token)
              setCookie('fsi_pharmacy_full_name', userData.full_name)
              setCookie('fsi_pharmacy_id_user', userData.id)
              setCookie('fsi_pharmacy_code_user', userData.code)
              setCookie('fsi_pharmacy_id_pharmacy', userData.type_pharmacy.id_pharmacy)
              setCookie('fsi_pharmacy_name_pharmacy', userData.type_pharmacy.name)
              setCookie('fsi_pharmacy_code_pharmacy', userData.type_pharmacy.code_pharmacy)
              const id_role_hashing = btoa(userData.id_type_rol_user.toString())
              setCookie('fsi_pharmacy_id_role', id_role_hashing)

              //setCookie('fsi_pharmacy_id_admin', userData.id_admin)
              if (userData.url_image) {
                setCookie('fsi_pharmacy_url_image', userData.url_image)
              }
              commit('SET_USER', userData)
              resetAuthRole()
              resolve(response.data)
            } else {
              reject(response.data)
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

      removeCookie('fsi_pharmacy_token')
      removeCookie('fsi_pharmacy_full_name')
      removeCookie('fsi_pharmacy_id_role')
      removeCookie('fsi_pharmacy_id_admin')
      removeCookie('fsi_pharmacy_url_image')
      removeCookie('fsi_pharmacy_code_user')
      removeCookie('fsi_pharmacy_id_user')
      removeCookie('fsi_pharmacy_name_pharmacy')
      removeCookie('fsi_pharmacy_code_pharmacy')
      removeCookie('fsi_pharmacy_id_pharmacy')

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
