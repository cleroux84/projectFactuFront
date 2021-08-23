<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" scrollable max-width="700px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Ajouter un client</v-toolbar>
            <v-form fill-width ref="addCustomerForm" lazy-validation>
              <v-container>
                <v-card-title v-if="this.formErrors.length > 0">
                  <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                  Merci de remplir les champs obligatoires
                </v-card-title>
                <v-row>
                  <v-col cols =2>
                    <v-select
                        :items="civilityItems"
                        v-model="formAddCustomer.civility"
                        :label= labelForm.civility
                        :rules="[rules.required]"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="formAddCustomer.firstName"
                        :label= labelForm.firstName
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="formAddCustomer.lastName"
                        :label= labelForm.lastName
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="formAddCustomer.company"
                        :label=labelForm.company
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="formAddCustomer.email"
                        :label= labelForm.email
                        :rules="[rules.email, rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="formAddCustomer.VATNumber"
                        :label= labelForm.VATNumber
                        :rules="[rules.required, rules.vatNumber]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =12>
                    <v-text-field
                        v-model="formAddCustomer.address"
                        :label=labelForm.address
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="formAddCustomer.zipCode"
                        :label= labelForm.zipCode
                        :rules="[rules.required, rules.zipCode]"
                        counter
                        maxlength="5"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="formAddCustomer.city"
                        :label= labelForm.city
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="formAddCustomer.phone"
                        :label= labelForm.phone
                        :rules="[rules.required, rules.phone]"
                        counter
                        maxlength="10"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="formAddCustomer.phone2"
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
                    <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click.prevent="checkAddCustomerForm()">Valider</v-btn>
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
import { mapGetters } from 'vuex'

export default {
  name: "AddCustomerForm",
  computed: {
    ...mapGetters(['apiRoutes', 'rules']),
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
  props: ['visible', 'item'],

  methods: {
  checkAddCustomerForm: function () {
      if(this.formAddCustomer.civility &&
          this.formAddCustomer.firstName &&
          this.formAddCustomer.lastName &&
          this.formAddCustomer.address &&
          this.formAddCustomer.zipCode &&
          this.formAddCustomer.city &&
          this.formAddCustomer.VATNumber &&
          this.formAddCustomer.phone &&
          this.formAddCustomer.email
      ) {
        this.addNewCustomer()

      } else this.formErrors.push("errors")

    },
  async addNewCustomer () {
    const accessToken = await this.$auth.getTokenSilently()
    if (this.$refs.addCustomerForm.validate())
      this.$axios.post(this.apiRoutes.addCustomer, this.formAddCustomer, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          () => {
            this.resetForm()
            this.show = false;
            this.$store.dispatch('getAllCustomers')
          },
          response => {
            console.log(response)
          }
      )
    },
    resetForm: function () {
    this.formAddCustomer = ""
    }
  },

  data() {
    return {
      tvaFR: "FR",
      formErrors: [],
      formAddCustomer : {
        civility : "",
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        phone2: "",
        VATNumber: "FR",
        email: "",
        address: "",
        zipCode: "",
        city: ""
      },
      labelForm : {
        civility : "Civilité*",
        firstName: "Nom*",
        lastName: "Prénom*",
        company: "Entreprise*",
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