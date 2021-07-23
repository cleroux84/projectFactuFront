<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Ajouter un client</v-toolbar>
            <v-form fill-width ref="updateCustomerForm" lazy-validation>
              <v-container>
                <v-row>
                  <v-card-text v-if="this.formErrors.length > 0">Merci de remplir les champs obligatoires</v-card-text>
                  <v-col cols =2>
                    <v-select
                        :items="civilityItems"
                        v-model="updateCustomerComputed.civility"
                        :label= labelForm.civility
                        required
                    >
                    </v-select>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomerComputed.firstName"
                        :label= labelForm.firstName
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomerComputed.lastName"
                        :label= labelForm.lastName
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.company"
                        :label=labelForm.company
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.email"
                        :label= labelForm.email
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.VATNumber"
                        :label= labelForm.VATNumber
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =12>
                    <v-text-field
                        v-model="updateCustomerComputed.address"
                        :label=labelForm.address
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.zipCode"
                        :label= labelForm.zipCode
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="updateCustomerComputed.city"
                        :label= labelForm.city
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.phone"
                        :label= labelForm.phone
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="updateCustomerComputed.phone2"
                        :label= labelForm.phone2
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="end"
                >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="show = false">Annuler</v-btn>
                    <v-btn  text color="blue-grey darken-2" @click="checkAddCustomerForm()">Valider</v-btn>
                  </v-card-actions>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>


</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "UpdateCustomerForm",
  created() {
    this.show = this.value
  },
  computed: {
    ...mapGetters(['apiRoutes']),
    /* show: {
      get () {
        console.log(this.visible)
        return this.visible
      },
      set (value) {
        if(!value) {
          this.$emit('close')
        }
      }
    }, */
    updateCustomerComputed: {
      get: function() {
        return this.updateCustomer
      },
      set: function(value) {
        this.$emit('customerChange', value)
      }
    }
  },
  props: ['value', 'updateCustomer'],
  watch: {
    value (v) {
      this.show = v
    }
  },
  methods: {
    toggleDialog () {
      this.show = !this.show
      this.$emit('update:value', this.show)
    },
    checkAddCustomerForm: function () {
        if(this.updateCustomerComputed.civility &&
            this.updateCustomerComputed.firstName &&
            this.updateCustomerComputed.lastName &&
            this.updateCustomerComputed.address &&
            this.updateCustomerComputed.zipCode &&
            this.updateCustomerComputed.city &&
            this.updateCustomerComputed.VATNumber &&
            this.updateCustomerComputed.phone &&
            this.updateCustomerComputed.email
        ) {
          this.updateCurrentCustomer()

        } else this.formErrors.push("errors")

      },
    updateCurrentCustomer: function () {
      this.$axios.post(this.apiRoutes.updateCustomer(this.updateCustomerComputed.id), this.updateCustomerComputed).then(
          () => {
            this.toggleDialog()
          },
          response => {
            console.log(response)
          }
      )
    },
  },

  data() {
    return {
      show: false,
      formErrors: [],
      labelForm : {
        civility : "Civilité*",
        firstName: "Nom*",
        lastName: "Prénom*",
        company: "Entreprise",
        phone: "Téléphone*",
        phone2: "Téléphone 2",
        VATNumber: "Numéro TVA*",
        email: "Email*",
        address: "Adresse*",
        zipCode: "Code postal*",
        city: "Ville*"
      },
      civilityItems: ['M.', 'Mme', 'Mlle']
    }
  }
}
</script>

<style scoped>

</style>