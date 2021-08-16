import Vue from 'vue'
import Vuex from 'vuex'
import ApiRoutes from '../router/apiRoutes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      apiRoutes: ApiRoutes,
      allCustomers: [],
      currentUser: {},
      rules: {
          required: value => !!value || 'Champs obligatoire.',
          zipCode: value => value && value.length === 5 || 'Le code postal doit être composé de 5 chiffres !',
          min: v => (v && v.length >= 6) || "Minimum 6 caractères",
          minTwoChar: v => (v && v.length >= 2) || "Minimum 2 caractères",
          email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Entrez une adresse mail valide'
          },
          vatNumber: value => value && value.length === 13 || 'Le numéro de TVA Intracommunautaire doit être composé de 11 chiffres',
          phone: value => value && value.length === 10 || 'Le numéro de téléphone doit être composé de 10 chiffres',
          decimals: value => {
              const pattern = /^[1-9]\d*(\.\d+)?$/
              return pattern.test(value) || 'Entrez un chiffre'
          },
          intOnly: value => {
              return Number.isInteger(value) || 'Entrez un nombre entier'
          }
      }
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
      getCurrentUser({rootState, commit}, authId) {
        Vue.axios.get(rootState.apiRoutes.getCurrentUser(authId)).then(
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
      currentUser: state => { return state.currentUser},
      rules: state => {return state.rules}
  }
})
