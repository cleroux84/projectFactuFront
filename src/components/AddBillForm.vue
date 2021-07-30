<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Nouvelle facture</v-toolbar>
            <v-form fill-width ref="addBillForm" lazy-validation v-model="valid">
              <v-container>
                <v-card-title v-if="this.formErrors.length > 0" >
                  <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                  Merci de remplir les champs obligatoires
                </v-card-title>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :placeholder="labelForm.customerId"
                      :items="allCustomers"
                      item-value="id"
                      item-text="company"
                      v-model="formAddBill.customerId"
                      :rules="[rules.required]"
                      >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                        v-model="formAddBill.periodCovered"
                        :label="labelForm.periodCovered"
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <div>
                  <div v-for="(newComponent, index) in benefitComponents" :key="index">
                    <form-benefit ref="benefitForm"/>
                  </div>
                </div>
                <v-row>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-col cols="1">
                        <v-icon class="material-icons"
                                @click="addBenefit()"
                                v-bind="attrs"
                                v-on="on"
                        >
                          mdi-folder-plus
                        </v-icon>
                      </v-col>
                    </template>
                    <span>Ajouter une prestation à la facture</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-col cols="3">
                        <v-icon v-bind:disabled="benefitComponents.length <= 1"
                                class="material-icons"
                                @click="deleteBenefit()"
                                v-bind="attrs"
                                v-on="on"
                        >
                          mdi-minus-circle-outline
                        </v-icon>
                      </v-col>
                    </template>
                    <span>Retirer une prestation de la facture</span>
                  </v-tooltip>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="show = false">Annuler</v-btn>
                  <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click="checkAddBillForm()">Valider</v-btn>
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
  },
  components: { FormBenefit },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers', 'rules']),
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
  watch: {

  },
  props: ['visible', 'formBenefits'],
  methods: {
    deleteBenefit() {
      this.benefitComponents.pop()
    },
    addBenefit() {
      this.benefitComponents.push(this.formBenefit)
    },
    checkAddBillForm: function () {
      if(this.formAddBill.customerId &&
          this.formAddBill.periodCovered) {
        this.checkFormBenefits()
      } else {
        this.formErrors.push("errors")
        console.log("manque customerId ou periode couverte")
      }
    },

    checkFormBenefits: function () {
      for(let i = 0; i < this.benefitComponents.length; i++) {
        if(this.$refs.benefitForm[i].checkBenefitForm() === true) {
          this.formAddBill.benefits.push(this.$refs.benefitForm[i].formBenefit)

           // this.composeAddBillForm()
        } else {
          this.$refs.benefitForm[i].resetFormBenefit()
          //TODO dire : tu valides pas mais tu gardes pas en mémoire
          console.log("presta mal remplie non prise en compte")
          this.formErrors.push("errors")
        }
      }
        this.composeAddBillForm()

      // console.log("this.formAddBill.benefits.length")
      // console.log(this.formAddBill.benefits.length)
      // console.log("this.benefitComponents.length")
      // console.log(this.benefitComponents.length)
      // if(this.formAddBill.benefits.length === this.benefitComponents.length){
      //   this.composeAddBillForm()
      // } else {
      //   console.log(this.formAddBill)
      // }
    },

    composeAddBillForm: function () {
      this.formAddBill.created = Date.now()
      this.addBill()
    },

    addBill: function () {
      if (this.$refs.addBillForm.validate())
      this.$axios.post(this.apiRoutes.addBill, this.formAddBill).then(
          () => {
            // console.log(this.formAddBill)
            this.show = false
      },
          () => {
            console.log("error")
            // console.log(this.formAddBill)
          }
      )
    },
  },

  data() {
   return {
     valid: false,
     minusSign: false,
     benefitComponents: [
       {
          name: "",
          quantity: null,
          unitPrice: null,
          vatRate: null
        }
     ],
     formBenefit: {
       name: "",
       quantity: null,
       unitPrice: null,
       vatRate: null
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