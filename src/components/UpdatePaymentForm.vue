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
import BillService from "../services/BillService";
import BillsListService from "../services/BillsListService";

export default {
  created() {
  },
  name: "UpdatePaymentForm",
  computed: {
    ...mapGetters(['rules', 'apiRoutes', 'currentUser', 'allLateBills', 'unpaidBillsSum', 'allBills']),
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
    ...mapActions(['getUnpaidSum', 'getAllBillsList']),
    toggleDialog () {
      this.show = !this.show
      this.$emit('close', this.show)
    },

    composeData() {
      this.myPaymentData.userId = this.currentUser.id
      this.myPaymentData.benefits = this.myBill[0].benefit
      this.myPaymentData.created = Date.now()
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
          BillService.updatePaymentBill(accessToken, this.myPaymentData, this.myBill[0].id).then(
              () => {
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
      await BillsListService.getLateBillsList(accessToken).then(
          unpaidBills => {
            this.$store.commit('setAllLateBills',unpaidBills)
            this.getAllBills()
          }
      )
    },

    async getUnpaidBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getLateBillsListByUser(accessToken, this.currentUser.id).then(
          unpaidBills => {
            this.$store.commit('setAllLateBills',unpaidBills)
            this.getAllBillsByUser()
          }
      )
    },

    getAllUnpaidSum() {
      this.unpaidBills = this.allBills.filter(bill => {
        return bill.paid === false
      })
      this.getUnpaidSum(this.unpaidBills)
    },

    async getAllBills() {
      const accessToken = await this.$auth.getTokenSilently()
      await this.getAllBillsList(accessToken)
            this.getAllUnpaidSum()
            this.averageResult()
    },

    async getAllBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getBillsListByUser(accessToken, this.currentUser.id).then(
          bills => {
            this.$store.commit('setAllBills', bills)
            this.getAllUnpaidSum()
            this.averageResult()
          }
      )
    },

    averageResult: function () {
      let average = ((this.unpaidBills.length * 100) / this.allBills.length).toFixed(2) //donne pourcentage de facture non payées
      this.$store.commit('setAverageUnpaidBills', average)
    },

  },
  props: ['visible', 'myBill'],
  data() {
    return {
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