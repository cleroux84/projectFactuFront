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
                        v-model="updateCustomer.civility"
                        :label= labelForm.civility
                        required
                    >
                    </v-select>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomer.firstName"
                        :label= labelForm.firstName
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =5>
                    <v-text-field
                        v-model="updateCustomer.lastName"
                        :label= labelForm.lastName
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomer.company"
                        :label=labelForm.company
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomer.email"
                        :label= labelForm.email
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomer.VATNumber"
                        :label= labelForm.VATNumber
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =12>
                    <v-text-field
                        v-model="updateCustomer.address"
                        :label=labelForm.address
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomer.zipCode"
                        :label= labelForm.zipCode
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="updateCustomer.city"
                        :label= labelForm.city
                        required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols =4>
                    <v-text-field
                        v-model="updateCustomer.phone"
                        :label= labelForm.phone
                        required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols =8>
                    <v-text-field
                        v-model="updateCustomer.phone2"
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
  computed: {
    ...mapGetters(['apiRoutes']),
    show: {
      get () {
        console.log()
        return this.visible
      },
      set (value) {
        if(!value) {
          this.$emit('close')
        }
      }
    }
  },
  props: ['visible', 'updateCustomer'],

  methods: {
  checkAddCustomerForm: function () {
      if(this.updateCustomer.civility &&
          this.updateCustomer.firstName &&
          this.updateCustomer.lastName &&
          this.updateCustomer.address &&
          this.updateCustomer.zipCode &&
          this.updateCustomer.city &&
          this.updateCustomer.VATNumber &&
          this.updateCustomer.phone &&
          this.updateCustomer.email
      ) {
        this.updateCurrentCustomer()
        // this.nextTick()(() => {
        //   this.updateCurrentCustomer()
        // })

      } else this.formErrors.push("errors")

    },
    updateCurrentCustomer: function () {
      this.$axios.post(this.apiRoutes.updateCustomer(this.updateCustomer.id), this.updateCustomer).then(
          () => {
            console.log(this.updateCustomer)
            this.resetForm()
          },
          response => {
            console.log(response)
          }
      )
    },
    resetForm: function () {
    this.updateCustomer = ""
    }
  },

  data() {
    return {
      updatedCustomer: this.$props.updateCustomer,
      formErrors: [],
      // formAddCustomer : {
      //   civility : "",
      //   firstName: "",
      //   lastName: "",
      //   company: "",
      //   phone: "",
      //   phone2: "",
      //   VATNumber: "",
      //   email: "",
      //   address: "",
      //   zipCode: "",
      //   city: ""
      // },
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