export default {
  namespaced: true,
  state: {
    isDeleting: false,
    isUpdating: false,
    isCreating: false,
    isGetting: false,
    isItem: null,
  },
  mutations: {
    SET_IS_DELETING(state: any, value: boolean) {
      state.isDeleting = value
    },
    SET_IS_UPDATING(state: any, value: boolean) {
      state.isUpdating = value
    },
    SET_IS_CREATING(state: any, value: boolean) {
      state.isCreating = value
    },
    SET_IS_ITEM(state: any, item: any) {
      state.isItem = item
    },
    SET_IS_GETTING(state: any, value: boolean) {
      state.isGetting = value
    },
  },
  actions: {
    setIsDeleting({ commit }: { commit: Function }, value: boolean) {
      commit('SET_IS_DELETING', value)
    },
    setIsUpdating({ commit }: { commit: Function }, value: boolean) {
      commit('SET_IS_UPDATING', value)
    },
    setIsCreating({ commit }: { commit: Function }, value: boolean) {
      commit('SET_IS_CREATING', value)
    },
    setIsGetting({ commit }: { commit: Function }, value: boolean) {
      commit('SET_IS_GETTING', value)
    },
    setIsItem({ commit }: { commit: Function }, item: any) {
      commit('SET_IS_ITEM', item)
    },
  },
  getters: {
    isDeleting: (state: any) => state.isDeleting,
    isUpdating: (state: any) => state.isUpdating,
    isCreating: (state: any) => state.isCreating,
    isGetting: (state: any) => state.isGetting,
    isItem: (state: any) => state.isItem,
  },
}
