<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="dialog" scrollable max-width="350px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Paiement pour facture n° <span>{{myBill[0].billNumber}}</span></v-toolbar>
            <v-form fill-width ref="updatePaymentForm" lazy-validation v-model="valid">
              <v-container>
              <v-card-title v-if="this.formErrors.length > 0">
                <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                Cocher la case pour valider un paiement.
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    :label="labelForm.paymentCheck"
                    v-model="myPaymentData.paid"
                  >
                  </v-checkbox>
                </v-col>
              </v-row>
                  <v-date-picker
                      v-model="myPaymentData.paymentDate"
                      first-day-of-week="1"
                      locale="fr-fr"
                  >

                  </v-date-picker>
                <v-spacer></v-spacer>
                <v-row
                    align="center"
                    justify="end"
                >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click=toggleDialog()>Annuler</v-btn>
                    <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click.prevent="composeData()">Valider</v-btn>
                  </v-card-actions>
                </v-row>
              </v-container>
            </v-form>
                    <!--                  //ajout bank ?-->



          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  created() {
  },
  name: "UpdatePaymentForm",
  computed: {
    ...mapGetters(['rules', 'apiRoutes', 'currentUser', 'allLateBills', 'unpaidBillsSum']),
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if(!value) {
          this.$emit('close')
        }
      }
    },
  },

  methods: {
    toggleDialog () {
      this.show = !this.show
      this.$emit('close', this.show)
    },
    // async updateUser () {
    //   const accessToken = await this.$auth.getTokenSilently()
    //   this.$axios.post(this.apiRoutes.updateUser(this.myUser.user.id), this.myUser.user, {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`
    //     }
    //   }).then(
    //       () => {
    //         this.toggleDialog()
    //       },
    //       response => console.log(response)
    //   )
    // },

    composeData() {
      this.myPaymentData.userId = this.currentUser.id
      this.myPaymentData.benefits = this.myBill[0].benefit
      this.myPaymentData.created = Date.parse(this.myBill[0].created)
      this.myPaymentData.customerId = this.myBill[0].customer.id
      this.myPaymentData.periodCovered = this.myBill[0].periodCovered
      if (!this.myPaymentData.paid) {
        this.myPaymentData.paid = false
        this.formErrors.push("errors")
      } else {
        if (!this.myPaymentData.paymentDate) {
          this.myPaymentData.paymentDate = Date.now()
        }
        this.updatePayment()
      }
    },

    async updatePayment () {
      const accessToken = await this.$auth.getTokenSilently()
      let res = await this.$confirm('Êtes-vous sûr de vouloir valider ce paiement ? Aucune modification possible' )
      if (this.$refs.updatePaymentForm.validate())
      if (res) {
        this.$axios.post(this.apiRoutes.updatePayment(this.myBill[0].id), this.myPaymentData, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(
            () => {
              // this.show = false
              this.toggleDialog()
              if(this.currentUser.role === 1) {
                this.getUnpaidBills()
              } else this.getUnpaidBillsByUser()
            },
            response => console.log(response)
        )
      }
    },
    async getUnpaidBills() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.unpaidBills, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          response => {
            this.$store.commit('setAllLateBills', response.data)
            this.getAllBills()
            // console.log(this.allLateBills)

          }
      )
    },
    async getUnpaidBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.unpaidBillsByUser(this.currentUser.id), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          response => {
            this.$store.commit('setAllLateBills', response.data)
            this.getAllBillsByUser()
            // console.log(this.allLateBills)
          }
      )
    },
    ...mapActions(['getUnpaidSum']),

    getAllUnpaidSum() {
      this.unpaidBills = this.allBills.filter(bill => {
        return bill.paid === false
      })
      this.getUnpaidSum(this.unpaidBills)
    },

    async getAllBills() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.listBill, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          (response) => {
            this.allBills = response.data
            this.getAllUnpaidSum()
            this.averageResult()
          }
      )
    },
    async getAllBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.listBillByUser(this.currentUser.id), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          (response) => {
            // console.log(response.data)
            this.allBills = response.data
            this.getAllUnpaidSum()
            this.averageResult()
          }
      )
    },
    averageResult: function () {
      var average = (this.unpaidBills.length * 100) / this.allBills.length //donne pourcentage de facture non payées
      this.$store.commit('setAverageUnpaidBills', average)
    },

  },
  props: ['visible', 'myBill'],
  data() {
    return {
      allBills: [],
      unpaidBills: [],
      valid: false,
      formErrors: [],
      myPaymentData: {},
      tab: 0,
      dialog: true,
      civilityItems: ['M.', 'Mme', 'Mlle'],
      labelForm : {
        paymentCheck: "paiement effectué : cocher la case",
        datePayment: "Date de paiement :"
      },
    }
  }
}
</script>

<style scoped>

</style>