import Vue from 'vue'
import Vuex from 'vuex'
import ApiRoutes from '../router/apiRoutes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiRoutes: ApiRoutes,
    allCustomers: []
  },
  mutations: {
     setAllCustomers (state, allCustomers) {
       state.allCustomers = allCustomers
     }
  },
  actions: {
    getAllCustomers({rootState, commit}) {
         Vue.axios.get(rootState.apiRoutes.listCustomer).then(
            response => {
              commit('setAllCustomers', response.data)
            }
        )
    },
  },
  modules: {
  },
  getters: {
    allCustomers: state => {return state.allCustomers},
    apiRoutes: state => { return state.apiRoutes },
  }
})
