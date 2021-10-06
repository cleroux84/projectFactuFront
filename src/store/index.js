import Vue from 'vue'
import Vuex from 'vuex'
import ApiRoutes from '../router/apiRoutes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      apiRoutes: ApiRoutes,
      allCustomers: [],
      currentUser: {},
      allUsers: [],
      allBills: [],
      allLateBills: [],
      billsSum: null,
      unpaidBillsSum: null,
      averageUnpaidBills: null,
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
          siretNumber: value => value && value.length <= 14 && value.length >= 9|| 'Le numéro siren est composé de 9 chiffres, Le numéro siret est composé de 14 chiffres',
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
      setAllUsers (state, allUsers) {
          state.allUsers = allUsers
      },
      setAllLateBills (state, allLateBills) {
          state.allLateBills = allLateBills
      },
      setBillsSum (state, billsSum) {
          state.billsSum = billsSum
      },
      setUnpaidBillsSum (state, unpaidBillsSum) {
          state.unpaidBillsSum = unpaidBillsSum
      },
      setAverageUnpaidBills (state, averageUnpaidBills) {
          state.averageUnpaidBills = averageUnpaidBills
      },
      setAllBills (state, allBills) {
          state.allBills = allBills
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
      getCurrentUser({rootState, commit}, email) {
        Vue.axios.get(rootState.apiRoutes.getCurrentUser(email)).then(
            response => {
                commit('setCurrentUser', response.data)
            }
        )
    },
      getAllUsers({rootState, commit}) {
        Vue.axios.get(rootState.apiRoutes.getAllUsers).then(
            response => {
                commit('setAllUsers', response.data)
            }
        )
      },

      getSum: function ({commit}, allBillsForSumArray) {
          var amountSum = (allBillsForSumArray.reduce(function (s, a) {
              return s + a.amountHt;
          }, 0)).toFixed(2)
          commit('setBillsSum', amountSum)
      },

      getUnpaidSum: function ({commit}, unpaidBills) {
          var amountSum = (unpaidBills.reduce(function (s, a) {
              return s + a.amountHt;
          }, 0)).toFixed(2)
          commit('setUnpaidBillsSum', amountSum)
      },

      async getAllBills({rootState, commit}) {
          const accessToken = await this.$auth.getTokenSilently()
          Vue.axios.get(rootState.apiRoutes.listBill, {
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          }).then(
              response => {
                  commit('setAllBills', response.data)
              }
          )
      },
      //
      // async getAllLateBills({rootState, commit}) {
      //     const accessToken = await this.$auth.getTokenSilently()
      //     Vue.axios.get(rootState.apiRoutes.lateBill, {
      //         headers: {
      //             Authorization: `Bearer ${accessToken}`
      //         }
      //     }).then(
      //       response => {
      //           commit('setAllLateBills', response.data)
      //       }
      //   )
      // },


  },
  modules: {
  },
  getters: {
      allCustomers: state => {return state.allCustomers},
      apiRoutes: state => { return state.apiRoutes },
      currentUser: state => { return state.currentUser},
      rules: state => {return state.rules},
      allUsers: state => {return state.allUsers},
      allBills: state => {return state.allBills},
      allLateBills: state => {return state.allLateBills},
      billsSum: state => { return state.billsSum},
      unpaidBillsSum: state => { return state.unpaidBillsSum},
      averageUnpaidBills: state => { return state.averageUnpaidBills},
  }
})
