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
            <v-tab-item>
              <v-card class="px-4">
                <v-card-text>
                  <v-form ref="updateUserForm" lazy-validation>
                    <v-row>
                      <v-col cols =2>
                        <v-select
                            :items="civilityItems"
                            v-model="myUser.user.civility"
                            :label= labelForm.civility
                            :rules="[rules.required]"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                            v-model="myUser.user.firstName"
                            :rules="[rules.required]"
                            :label="labelForm.firstName"
                            maxlength="20"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                            v-model="myUser.user.lastName"
                            :label="labelForm.lastName"
                            :rules="[rules.required]"
                            maxlength="20"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                            v-model=myUser.user.email
                            :label="labelForm.email"
                            :rules="[rules.required, rules.email ]"
                            disabled
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                            v-model="myUser.user.phone"
                            :label="labelForm.phone"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                            v-model="myUser.user.address"
                            :label="labelForm.address"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                            v-model="myUser.user.zipCode"
                            :label="labelForm.zipCode"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="8">
                        <v-text-field
                            v-model="myUser.user.city"
                            :label="labelForm.city"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                            v-model="myUser.user.siret"
                            :label="labelForm.siret"
                            :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-row
                          align="center"
                          justify="end"
                      >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click=toggleDialog()>Annuler</v-btn>
                          <v-btn type="submit" value="submit" text color="blue-grey darken-2" @click.prevent="updateUser()">Valider</v-btn>
                        </v-card-actions>
                      </v-row>
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
import UserService from "../services/UserService";

export default {
  // created() {
  //   console.log(this.myUser.user.email)
  // },
  name: "UpdateUserForm",
  computed: {
    ...mapGetters(['rules', 'apiRoutes']),
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
    async updateUser () {
      const accessToken = await this.$auth.getTokenSilently()
  UserService.updateProfile(accessToken, this.myUser.user.id, this.myUser.user).then(
          () => {
            this.show = false
            this.$store.commit('setCurrentUser', this.myUser.user)
          },
          response => console.log(response)
      )
    }
  },
  props: ['visible', 'myUser'],
  data() {
    return {
      tab: 0,
      dialog: true,
      civilityItems: ['M.', 'Mme', 'Mlle'],
      labelForm : {
        civility: "Civility",
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
    }
  }
}
</script>

<style scoped>

</style>