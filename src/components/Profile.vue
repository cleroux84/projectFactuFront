<template>
  <v-container>
    <v-card-actions>
      <div class="text-center">
        <v-row>
          <v-col>
            <h3>Mon Profile</h3>
          </v-col>
          <v-btn class="ma-2"
                 outlined color="blue-grey darken-2"
                 @click="showUpdateUserForm=true">
  <!--          <router-link class="linkBtn" to="/Profile">-->
              Modifier Mon Profile
  <!--          </router-link>-->
          </v-btn>
        </v-row>
      </div>
      <div>

      </div>
    </v-card-actions>
    <template>
      <v-card
          class="mx-auto my-12"
          max-width="374"
      >
        <template slot="progress">
          <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title>{{ currentUser.civility }} {{ currentUser.firstName }} {{ currentUser.lastName }}</v-card-title>
        <v-card-text>
          <v-row
              align="center"
              class="mx-0"
          >
          </v-row>

          <div class="my-4 text-subtitle-1">
            <address>{{ currentUser.address }}</address>
            <address>{{ currentUser.zipCode }} {{ currentUser.city }} </address>
            <div>{{ currentUser.phone }}</div>
            <v-spacer></v-spacer>
            <div>Siret : {{ currentUser.siret }}</div>
          </div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
          <v-card-title></v-card-title>
        <div id="app">
            <v-expansion-panels>
              <v-expansion-panel
              >
                <v-expansion-panel-header>
                  Coordonnées bancaires
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="!loading">
                  <div v-if="this.myUser.bank !== undefined">
                    <div>
                      <div>{{ myUser.bank.name }}</div>
                      <div>IBAN : {{ myUser.bank.iban }}</div>
                      <br>
                      <div>
                        <v-simple-table>
                          <thead>
                          <tr>
                            <th>Code Banque</th>
                            <th>Code Guichet</th>
                            <th>Compte n°</th>
                            <th>Clé RIB</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>{{ myUser.bank.bankCode}}</td>
                            <td>{{ myUser.bank.guichetCode}}</td>
                            <td>{{ myUser.bank.account}}</td>
                            <td>{{ myUser.bank.ribKey}}</td>
                          </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <v-btn
                        class="ma-2"
                        outlined color="blue-grey darken-2"
                        @click="showAddBankForm=true">
                      Ajouter une banque
                    </v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
        </div>
      </v-card>
    </template>
    <AddBankForm v-if="showAddBankForm" :myUser="this.myUser" :visible="showAddBankForm" @close="closeAddBankForm"/>
    <UpdateUserForm v-if="showUpdateUserForm" :myUser="this.myUser" :visible="showUpdateUserForm" @close="closeUpdateUserForm"/>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddBankForm from "./AddBankForm";
import UpdateUserForm from "./UpdateUserForm";

export default {
  name: "Profile",
  components: {UpdateUserForm, AddBankForm},
  data() {
    return {
      myUser: {},
      loading: false,
      showAddBankForm: false,
      showUpdateUserForm: false
    }
  },
  computed: {
    ...mapActions(['getCurrentUser']),
    ...mapGetters(['apiRoutes', 'currentUser', 'allCustomers']),
  },
  created () {
    // setTimeout(this.currentUser, 1000)
    this.$store.dispatch('getCurrentUser', this.$auth.user.email)
    this.getProfileComplete()

    // setTimeout(this.getCurrentUserData, 2000)
  },
  methods: {
    closeAddBankForm() {
      this.showAddBankForm = false
    },

    closeUpdateUserForm() {
      this.showUpdateUserForm = false
    },

    getProfileComplete() {
      this.loading = true
      this.$axios.get(this.apiRoutes.getProfile(this.currentUser.email)).then(
          (response) => {
            this.myUser = response.data
            // if (this.myUser.bank !== undefined) {
            //   console.log("a une banque")
            // } else {
            //   console.log("n'a pas de banque")
            // }
            // console.log(response.data)
            // console.log(this.currentUser)
            this.loading = false;
          }
      )
    }
    // getCurrentUserData() {
    //   this.getCurrentUser("sousou@example.com")
    //   console.log(this.currentUser)
    // }
    // currentUser() {
    //   // const userId = (this.$auth.user.sub).slice(6)
    //   // console.log(userId)
    //   this.$axios.get(this.apiRoutes.getCurrentUser(this.$auth.user.email)).then(
    //       (response) =>
    //       {
    //         this.myUser = response.data
    //         console.log(response.data)
    //       },
    //       response => console.log(response.data)
    //   )
    // }
  }
}
</script>

<style scoped>

</style>