<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Modifier {{ updateCustomerComputed.company }}</v-toolbar>
            <v-form fill-width ref="updateCustomerForm" lazy-validation>
              <v-container>
                <v-card-title v-if="this.formErrors.length > 0">
                  <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                  Merci de remplir les champs obligatoires
                </v-card-title>
                <v-row>
                  <v-col cols =2>
                    <v-select
                        :items="civilityItems"
                        v-model="updateCustomerComputed.civility"
                        :label= labelForm.civility
                        :rules="[rules.required]"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomerComputed.firstName"
                        :label= labelForm.firstName
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomerComputed.lastName"
                        :label= labelForm.lastName
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.company"
                        :label=labelForm.company
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.email"
                        :label= labelForm.email
                        :rules="[rules.required, rules.email]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.VATNumber"
                        :label= labelForm.VATNumber
                        :rules="[rules.required, rules.vatNumber]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =12>
                    <v-text-field
                        v-model="updateCustomerComputed.address"
                        :label=labelForm.address
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.zipCode"
                        :label= labelForm.zipCode
                        :rules="[rules.required, rules.zipCode]"
                        counter
                        maxlength="5"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="updateCustomerComputed.city"
                        :label= labelForm.city
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomerComputed.phone"
                        :label= labelForm.phone
                        :rules="[rules.required]"
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
                    <v-btn color="blue darken-1" text @click=toggleDialog()>Annuler</v-btn>
                    <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click="checkAddCustomerForm()">Valider</v-btn>
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
import CustomerService from "../services/CustomerService";

export default {
  name: "UpdateCustomerForm",
  created() {
    this.show = this.value
  },
  computed: {
    ...mapGetters(['apiRoutes', 'rules']),
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
      this.$emit('close', this.show)
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
    async updateCurrentCustomer () {
      const accessToken = await this.$auth.getTokenSilently()
      if (this.$refs.updateCustomerForm.validate())
       await CustomerService.updateCustomer(accessToken, this.updateCustomerComputed.id, this.updateCustomerComputed).then(
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