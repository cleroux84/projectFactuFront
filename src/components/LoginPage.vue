<template>
  <div id="app">
    <v-app>
      <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
        <div>
          <v-tabs
              v-model="tab"
              show-arrows
              background-color="blue-grey darken-2"
              icons-and-text
              dark grow>
<!--            <v-tabs-slider color="blue-grey darken-2"></v-tabs-slider>-->
<!--            <v-tab v-for="i in tabs" :key="i.name">-->
<!--              <v-icon large>{{ i.icon }}</v-icon>-->
<!--              <div class="caption py-1">{{ i.name }}</div>-->
<!--            </v-tab>-->
<!--            <v-tab-item>-->
<!--              <v-card class="px-4">-->
<!--                <v-card-text>-->
<!--                  <v-form ref="loginForm" v-model="valid" lazy-validation>-->
<!--                    <v-row>-->
<!--                      <v-col cols="12">-->
<!--                        <v-text-field-->
<!--                            v-model="formLogin.email"-->
<!--                            :label="labelForm.email"-->
<!--                            :rules="[rules.required, rules.email]"-->
<!--                        >-->
<!--                        </v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col cols="12">-->
<!--                        <v-text-field-->
<!--                            v-model="formLogin.password"-->
<!--                            :append-icon="show1?'mdi-eye':'mdi-eye-off'"-->
<!--                            :type="show1 ? 'text' : 'password'"-->
<!--                            name="input-10-1"-->
<!--                            :label="labelForm.password"-->
<!--                            :rules="[rules.min, rules.required]"-->
<!--                            hint="Au moins 6 caractères"-->
<!--                            counter-->
<!--                            @click:append="show1 = !show1">-->
<!--                        </v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col class="d-flex" cols="12" sm="6" xsm="12">-->
<!--                      </v-col>-->
<!--                      <v-spacer></v-spacer>-->
<!--                      <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>-->
<!--                        <v-btn-->
<!--                            x-large block :disabled="!valid"-->
<!--                            color="blue-grey darken-2" dark-->
<!--                            @click="validate"-->
<!--                        >-->
<!--                          Valider-->
<!--                        </v-btn>-->
<!--                      </v-col>-->
<!--                    </v-row>-->
<!--                  </v-form>-->
<!--                </v-card-text>-->
<!--              </v-card>-->
<!--            </v-tab-item>-->
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="registerForm" v-model="valid" lazy-validation>
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
                            :rules="[rules.required]"
                            :label="labelForm.firstName"
                            maxlength="20"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                            v-model="formAddUser.lastName"
                            :label="labelForm.lastName"
                            :rules="[rules.required]"
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
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                            v-model="formAddUser.address"
                            :label="labelForm.address"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                            v-model="formAddUser.zipCode"
                            :label="labelForm.zipCode"
                            :rules="[rules.required]"
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
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
<!--                      <v-col cols="6">-->
<!--                        <v-text-field-->
<!--                            v-model="formAddUser.password"-->
<!--                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"-->
<!--                            :rules="[rules.required, rules.min]"-->
<!--                            :type="show1 ? 'text' : 'password'"-->
<!--                            name="input-10-1"-->
<!--                            :label="labelForm.password"-->
<!--                            hint="At least 6 characters"-->
<!--                            counter-->
<!--                            @click:append="show1 = !show1"-->
<!--                        ></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col cols="6">-->
<!--                        <v-text-field-->
<!--                            block v-model="formAddUser.verifyPassword"-->
<!--                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"-->
<!--                            :type="show1 ? 'text' : 'password'"-->
<!--                            name="input-10-1"-->
<!--                            :label="labelForm.verifyPassword"-->
<!--                            counter-->
<!--                            @click:append="show1 = !show1">-->
<!--                        </v-text-field>-->
<!--                      </v-col>-->
                      <v-spacer></v-spacer>
                      <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                        <v-btn
                            x-large block
                            :disabled="!valid"
                            color="blue-grey darken-2" dark
                            @click="composeUserFormBeforeBankExist"
                        >
                          Valider
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
<!--                  //ajout bank ?-->
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-dialog>
    </v-app>
  </div>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "LoginPage",
  computed: {
    ...mapGetters(['apiRoutes', 'rules']),
    passwordMatch() {
      return () => this.formAddUser.password === this.formAddUser.verifyPassword || "Password must match";
    }
  },
  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    // reset() {
    //   this.$refs.form.reset();
    // },
    // resetValidation() {
    //   this.$refs.form.resetValidation();
    // }

    composeUserFormBeforeBankExist: function() {
      this.formAddUser.bankId = 2
      this.formAddUser.email = this.$auth.user.email
      this.addNewUser()
    },

    addNewUser: function () {
      this.$axios.post(this.apiRoutes.addUser, this.formAddUser).then(
          () => {
            console.log(this.formAddUser)
          },
          () => console.log("error")
      )
    }
  },

  data: () => ({
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
      password: "",
      verifyPassword: "",
      bankId:""
    },
    formLogin: {
      email: "",
      password: ""
    },
    civilityItems: ['M.', 'Mme', 'Mlle'],
    labelForm : {
      civility: "Civility",
      firstName: "Nom",
      lastName: "Prénom",
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

    // loginEmailRules: [
    //   v => !!v || "Required",
    //   v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    // ],
    // emailRules: [
    //   v => !!v || "Required",
    //   v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    // ],

    show1: false,
    // rules: {
    //   required: value => !!value || "Required.",
    //   min: v => (v && v.length >= 8) || "Min 8 characters"
    // }
  })
}
</script>

<style scoped>

</style>