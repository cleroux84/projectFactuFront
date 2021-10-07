<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog v-model="show" persistent max-width="600px" min-width="360px">
          <v-card class="mt-2">
            <v-toolbar color="blue-grey darken-2" dark>Première connexion - Veuillez terminer votre profil</v-toolbar>
            <v-form fill-width ref="registerForm" v-model="valid" lazy-validation>
              <v-container>
                <v-card-title v-if="this.formErrors.length > 0">
                  <v-icon color="red" style='padding-right: 20px' class="material-icons">mdi-alert</v-icon>
                  Tous les champs sont obligatoires
                </v-card-title>
                <v-row>
                  <v-col cols =2>
                    <v-select
                        :items="civilityItems"
                        v-model="formAddUser.civility"
                        :label= labelForm.civility
                        :rules="[rules.required]"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                        v-model="formAddUser.firstName"
                        :rules="[rules.required, rules.minTwoChar]"
                        :label="labelForm.firstName"
                        maxlength="20"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                        v-model="formAddUser.lastName"
                        :label="labelForm.lastName"
                        :rules="[rules.required, rules.minTwoChar]"
                        maxlength="20"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                        v-model=$auth.user.email
                        :label="labelForm.email"
                        :rules="[rules.required, rules.email ]"
                        disabled
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                        v-model="formAddUser.phone"
                        :label="labelForm.phone"
                        :rules="[rules.required, rules.phone]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="formAddUser.address"
                        :label="labelForm.address"
                        :rules="[rules.required, rules.minTwoChar]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        v-model="formAddUser.zipCode"
                        :label="labelForm.zipCode"
                        :rules="[rules.required, rules.zipCode]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                        v-model="formAddUser.city"
                        :label="labelForm.city"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        v-model="formAddUser.siret"
                        :label="labelForm.siret"
                        :rules="[rules.required, rules.siretNumber]"
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
                      <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click="checkAddUserForm()">Valider</v-btn>
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
import UserService from "../services/UserService";

export default {
  name: "LoginPage",
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
  props: ['visible'],
  methods: {
    checkAddUserForm: function () {
      if(this.formAddUser.civility &&
          this.formAddUser.firstName &&
          this.formAddUser.lastName &&
          this.formAddUser.address &&
          this.formAddUser.zipCode &&
          this.formAddUser.city &&
          this.formAddUser.siret
      ) {
        this.composeUserFormBeforeBankExist()

      } else this.formErrors.push("errors")

    },

    composeUserFormBeforeBankExist: function() {
      this.formAddUser.authId = this.$auth.user.sub
      this.formAddUser.role = 0 //non admin par defaut
      this.formAddUser.email = this.$auth.user.email
      this.addNewUser()
    },

    async addNewUser () {
      const accessToken = await this.$auth.getTokenSilently()
      if(this.$refs.registerForm.validate())
        UserService.addUser(accessToken, this.formAddUser).then(
          () => {
            this.show = false;
          },
          () => console.log("error")
      )
    }
  },

  data: () => ({
    formErrors: [],
    formAddUser: {
      civility: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      siret: "",
      role: "",
      authId: ""
    },
    formLogin: {
      email: "",
      password: ""
    },
    civilityItems: ['M.', 'Mme', 'Mlle'],
    labelForm : {
      civility: "Civilité",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      address: "Adresse",
      city: "Ville",
      zipCode: "Code Postal",
      siret: "Siret",
      password: "Mot de passe",
      verifyPassword: "Confirmation mot de passe"
    },
    dialog: true,
    tab: 0,
    tabs: [
      {name:"Connexion", icon:"mdi-account"},
      {name:"Inscription", icon:"mdi-account-outline"}
    ],
    valid: true,
  })
}
</script>

<style scoped>

</style>