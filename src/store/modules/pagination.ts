const defaultEntry = () => ({
  currentPage: 1,
  totalPages: 1,
  filters: {},
})

export default {
  namespaced: true,
  state: {
    pages: {},
  },
  mutations: {
    SET_PAGE(state: any, payload: { key: string; page: number }) {
      const { key, page } = payload
      if (!state.pages[key]) state.pages[key] = defaultEntry()
      state.pages[key].currentPage = page
    },
    SET_TOTAL_PAGES(state: any, payload: { key: string; totalPages: number }) {
      const { key, totalPages } = payload
      if (!state.pages[key]) state.pages[key] = defaultEntry()
      state.pages[key].totalPages = totalPages
    },
    SET_FILTERS(state: any, payload: { key: string; filters: Record<string, any> }) {
      const { key, filters } = payload
      if (!state.pages[key]) state.pages[key] = defaultEntry()
      state.pages[key].filters = filters || {}
    },
    SET_PAGINATION_STATE(state: any, payload: { key: string; paginationState: any }) {
      const { key, paginationState } = payload
      if (!state.pages[key]) state.pages[key] = defaultEntry()
      state.pages[key] = {
        ...state.pages[key],
        ...(paginationState || {}),
        filters:
          paginationState && paginationState.filters
            ? paginationState.filters
            : state.pages[key].filters,
      }
    },
    UPDATE_PAGINATION(
      state: any,
      payload: {
        key: string
        currentPage?: number
        totalPages?: number
        filters?: Record<string, any>
      }
    ) {
      const { key, currentPage, totalPages, filters } = payload
      if (!state.pages[key]) state.pages[key] = defaultEntry()
      if (typeof currentPage === 'number') state.pages[key].currentPage = currentPage
      if (typeof totalPages === 'number') state.pages[key].totalPages = totalPages
      if (typeof filters !== 'undefined') state.pages[key].filters = filters || {}
    },
    CLEAR_PAGINATION(state: any, key: string) {
      if (state.pages[key]) delete state.pages[key]
    },
    CLEAR_ALL_PAGINATION(state: any) {
      state.pages = {}
    },
  },
  actions: {
    setPage({ commit }: { commit: Function }, payload: { key: string; page: number }) {
      commit('SET_PAGE', payload)
    },
    setTotalPages({ commit }: { commit: Function }, payload: { key: string; totalPages: number }) {
      commit('SET_TOTAL_PAGES', payload)
    },
    setFilters(
      { commit }: { commit: Function },
      payload: { key: string; filters: Record<string, any> }
    ) {
      commit('SET_FILTERS', payload)
    },
    setPaginationState(
      { commit }: { commit: Function },
      payload: { key: string; paginationState: any }
    ) {
      commit('SET_PAGINATION_STATE', payload)
    },
    updatePagination(
      { commit }: { commit: Function },
      payload: {
        key: string
        currentPage?: number
        totalPages?: number
        filters?: Record<string, any>
      }
    ) {
      commit('UPDATE_PAGINATION', payload)
    },
    clearPagination({ commit }: { commit: Function }, key: string) {
      commit('CLEAR_PAGINATION', key)
    },
    clearAllPagination({ commit }: { commit: Function }) {
      commit('CLEAR_ALL_PAGINATION')
    },
  },
  getters: {
    getPage: (state: any) => (key: string) => {
      return state.pages[key]?.currentPage ?? 1
    },
    getTotalPages: (state: any) => (key: string) => {
      return state.pages[key]?.totalPages ?? 1
    },
    getFilters: (state: any) => (key: string) => {
      return state.pages[key]?.filters ?? {}
    },
    getPaginationState: (state: any) => (key: string) => {
      return state.pages[key] ?? defaultEntry()
    },
    hasPaginationState: (state: any) => (key: string) => {
      return Boolean(state.pages[key])
    },
  },
}
