<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Nouvelle facture</v-toolbar>
            <v-form fill-width ref="addBillForm" lazy-validation>
              <v-container>
                <v-row>
                  <v-card-title v-if="this.formErrors.length > 0" >
                    <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                    Remplir les champs obligatoires
                  </v-card-title>
                  <v-col cols="12">
                    <v-autocomplete
                      :placeholder="labelForm.customerId"
                      :items="allCustomers"
                      item-value="id"
                      item-text="company"
                      v-model="formAddBill.customerId"
                      required
                      >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                        v-model="formAddBill.periodCovered"
                        :label="labelForm.periodCovered"
                        required>
                    </v-text-field>
                  </v-col>
                </v-row>
                <div v-for="(newComponent, index) in benefitComponents" :key="index">
                  <form-benefit ref="benefitFormComponent"/>
                </div>
                <v-icon class="material-icons" @click="addBenefit()">mdi-folder-plus</v-icon>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  text color="blue-grey darken-2" @click="checkAddBillForm()">Valider</v-btn>
                  </v-card-actions>
              </v-container>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import FormBenefit from "./FormBenefit";

export default {
  name: "AddBillForm.vue",
  mounted() {
    this.$store.dispatch('getAllCustomers');
  },
  components: { FormBenefit },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers']),
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if(!value) {
          this.$emit('close')
        }
      }
    }
  },
  props: ['visible', 'formBenefits'],
  methods: {
    addBenefit() {
      this.benefitComponents.push(this.formBenefit)
    },
    checkAddBillForm: function () {
      if(this.formAddBill.customerId &&
          this.formAddBill.periodCovered) {
        this.composeAddBillForm()
      } else {
        this.formErrors.push("errors")
        console.log("manque customerId ou periode couverte")
      }
    },
    composeAddBillForm: function () {
      for(let i = 0; i < this.benefitComponents.length; i++) {
        if(this.$refs.benefitFormComponent[i].checkBenefitForm() === true) {
          this.formAddBill.benefits.push(this.$refs.benefitFormComponent[i].formBenefit)
          this.addBill()
        } else {
          this.formErrors.push("errors")
          console.log("prestation mal remplie")
        }
      }
    },

    addBill: function () {
      this.$axios.post(this.apiRoutes.addBill, this.formAddBill).then(
          () => {
            this.resetForm()
      },
          () => {
            console.log("error")
            console.log(this.formAddBill)
          }
      )
    },
    resetForm: function () {
      this.formAddBill = ""
    },
  },
  created() {
  },
  data() {
   return {
     benefitComponents: [this.formBenefit],
     formBenefit: {
       name: "",
       quantity: "",
       unitPrice: "",
       vatRate: ""
     },
     formErrors: [],
     formAddBill : {
       customerId : "",
       periodCovered: "",
       benefits: [],
     },
     labelForm: {
       customerId: "Sélectionner un client",
       periodCovered: "Sélectionner la période couverte",
       name: "Sélectionner la prestation",
       quantity: "Quantité",
       unitPrice: "Prix unitaire",
       vatRate: "TVA appliquée",
     }
   }
  }
}
</script>

<style scoped>

</style>