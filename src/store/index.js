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
          email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Entrez une adresse mail valide'
          },
          zipCode: value => {
              return value.length === 5 || 'Le code postal doit être composé de 5 chiffres'
          },
          vatNumber: value => {
              return value.length === 13 || 'Le numéro de TVA Intracommunautaire doit être composé de 11 chiffres'
          },
          phone: value => {
              return value.length === 10 || 'Le numéro de téléphone doit être composé de 10 chiffres'
          },
          minimumCharacter: value => value.length >= 2 || 'Nombre de caractère minimum requis',
          charOnly: value => {
              const pattern = /^[1-9]\d*(\.\d+)?$/
              return pattern.test(value) || 'Entrez un chiffre'
              // return Number.isInteger(value) || 'Entrez un chiffre'
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
      currentUser: state => { return state.currentUser},
      rules: state => {return state.rules}
  }
})
