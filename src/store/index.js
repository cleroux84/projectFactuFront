import Vue from 'vue'
import Vuex from 'vuex'
import ApiRoutes from '../router/apiRoutes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiRoutes: ApiRoutes
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  getters: {
    apiRoutes: state => { return state.apiRoutes }
  }
})
