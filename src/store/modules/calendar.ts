export default {
  namespaced: true,
  state: {
    selectedEvent: null,
    countConsumer: 0,
    countExternal: 0,
    countCancelled: 0,
    countTransferred: 0,
    totalReservations: 0,
    clickedPreviewActivity: false,
    clickedPreviewEvent: false,
    clickedPreviewPromotion: false,
    colorCancelEvent: '',
  },
  mutations: {
    SET_CLICKED_PREVIEW_ACTIVITY(state: any, clickedPreviewActivity: boolean) {
      state.clickedPreviewActivity = clickedPreviewActivity
    },
    SET_CLICKED_PREVIEW_EVENT(state: any, clickedPreviewEvent: boolean) {
      state.clickedPreviewEvent = clickedPreviewEvent
    },
    SET_SELECTED_EVENT(state: any, selectedEvent: any) {
      state.selectedEvent = selectedEvent
    },
    SET_COUNT_CONSUMER(state: any, countConsumer: number) {
      state.countConsumer = countConsumer
    },
    SET_COUNT_EXTERNAL(state: any, countExternal: number) {
      state.countExternal = countExternal
    },
    SET_COUNT_CANCELLED(state: any, countCancelled: number) {
      state.countCancelled = countCancelled
    },
    SET_COUNT_TRANSFERRED(state: any, countTransferred: number) {
      state.countTransferred = countTransferred
    },
    SET_TOTAL_RESERVATIONS(state: any, totalReservations: number) {
      state.totalReservations = totalReservations
    },
    SET_CLICKED_PREVIEW_PROMOTION(state: any, clickedPreviewPromotion: boolean) {
      state.clickedPreviewPromotion = clickedPreviewPromotion
    },
    SET_COLOR_CANCEL_EVENT(state: any, colorCancelEvent: string) {
      state.colorCancelEvent = colorCancelEvent
    },
  },
  actions: {
    setClickedPreviewActivity({ commit }: { commit: Function }, clickedPreviewActivity: boolean) {
      commit('SET_CLICKED_PREVIEW_ACTIVITY', clickedPreviewActivity)
    },
    setClickedPreviewEvent({ commit }: { commit: Function }, clickedPreviewEvent: boolean) {
      commit('SET_CLICKED_PREVIEW_EVENT', clickedPreviewEvent)
    },
    setSelectedEvent({ commit }: { commit: Function }, selectedEvent: any) {
      commit('SET_SELECTED_EVENT', selectedEvent)
    },
    setCountConsumer({ commit }: { commit: Function }, countConsumer: number) {
      commit('SET_COUNT_CONSUMER', countConsumer)
    },
    setCountExternal({ commit }: { commit: Function }, countExternal: number) {
      commit('SET_COUNT_EXTERNAL', countExternal)
    },
    setCountCancelled({ commit }: { commit: Function }, countCancelled: number) {
      commit('SET_COUNT_CANCELLED', countCancelled)
    },
    setCountTransferred({ commit }: { commit: Function }, countTransferred: number) {
      commit('SET_COUNT_TRANSFERRED', countTransferred)
    },
    setTotalReservations({ commit }: { commit: Function }, totalReservations: number) {
      commit('SET_TOTAL_RESERVATIONS', totalReservations)
    },
    setClickedPreviewPromotion({ commit }: { commit: Function }, clickedPreviewPromotion: boolean) {
      commit('SET_CLICKED_PREVIEW_PROMOTION', clickedPreviewPromotion)
    },
    setColorCancelEvent({ commit }: { commit: Function }, colorCancelEvent: string) {
      commit('SET_COLOR_CANCEL_EVENT', colorCancelEvent)
    },
  },
  getters: {
    selectedEvent: (state: any) => state.selectedEvent,
    clickedPreviewActivity: (state: any) => state.clickedPreviewActivity,
    clickedPreviewEvent: (state: any) => state.clickedPreviewEvent,
    countConsumer: (state: any) => state.countConsumer,
    countExternal: (state: any) => state.countExternal,
    countCancelled: (state: any) => state.countCancelled,
    countTransferred: (state: any) => state.countTransferred,
    totalReservations: (state: any) => state.totalReservations,
    clickedPreviewPromotion: (state: any) => state.clickedPreviewPromotion,
    colorCancelEvent: (state: any) => state.colorCancelEvent,
  },
}
