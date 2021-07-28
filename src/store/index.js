import Vue from 'vue'
import Vuex from 'vuex'
import ApiRoutes from '../router/apiRoutes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiRoutes: ApiRoutes,
    allCustomers: [],
    currentUser: {},
  },

  mutations: {
     setAllCustomers (state, allCustomers) {
       state.allCustomers = allCustomers
     },
     setCurrentUser (state, currentUser) {
         state.currentUser = currentUser
     },
  },

  actions: {
    getAllCustomers({rootState, commit}) {
        Vue.axios.get(rootState.apiRoutes.listCustomer).then(
            response => {
              commit('setAllCustomers', response.data)
            }
        )
    },
    getCurrentUser({rootState, commit}) {
        Vue.axios.get(rootState.apiRoutes.getCurrentUser(1)).then(
            response => {
                commit('setCurrentUser', response.data)
            }
        )
    }
  },
  modules: {
  },
  getters: {
    allCustomers: state => {return state.allCustomers},
    apiRoutes: state => { return state.apiRoutes },
    currentUser: state => { return state.currentUser}
  }
})
