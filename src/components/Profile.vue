<template>
  <v-container>
    <v-card-actions>
      <div class="text-center">
        <v-row>
          <v-col>
            <h3>Mon Profile</h3>
          </v-col>
          <v-btn class="ma-2" outlined >
            <router-link class="linkBtn" to="/">Accueil</router-link>
            <v-icon
                right
                dark
            >
              mdi-home
            </v-icon>
          </v-btn>
          <v-btn class="ma-2"
                 outlined color="blue-grey darken-2"
                 @click="showUpdateUserForm=true">
  <!--          <router-link class="linkBtn" to="/Profile">-->
              Modifier Mon Profil
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
                      <v-divider class="mx-4"></v-divider>
                      <v-row
                          align="center"
                          justify="end"
                      >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                              style="margin-top: 10px"
                              text color="blue-grey darken-2"
                              @click="showUpdateBankForm=true">
                            Modifier
                          </v-btn>
                          <v-btn
                              style="margin-top: 10px"
                              text color="blue-grey darken-2"
                              @click="deleteBank()">
                            Supprimer
                          </v-btn>

                        </v-card-actions>
                      </v-row>
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
    <UpdateBankForm v-if="showUpdateBankForm" :myUser="this.myUser" :visible="showUpdateBankForm" @close="closeUpdateBankForm"/>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import AddBankForm from "./AddBankForm";
import UpdateUserForm from "./UpdateUserForm";
import UpdateBankForm from "./UpdateBankForm";

export default {
  name: "Profile",
  components: {UpdateBankForm, UpdateUserForm, AddBankForm},
  data() {
    return {
      myUser: {},
      loading: false,
      showAddBankForm: false,
      showUpdateUserForm: false,
      showUpdateBankForm: false
    }
  },
  computed: {
    ...mapGetters(['apiRoutes', 'currentUser', 'allCustomers']),
  },
  created () {
    this.getProfileComplete()
  },
  methods: {
    closeAddBankForm() {
      this.showAddBankForm = false
      this.getProfileComplete()
    },

    closeUpdateUserForm() {
      this.showUpdateUserForm = false
      this.getProfileComplete()
    },

    closeUpdateBankForm() {
      this.showUpdateBankForm = false
      this.getProfileComplete()
    },

    async getProfileComplete() {
      const accessToken = await this.$auth.getTokenSilently()
      this.loading = true
      this.$axios.get(this.apiRoutes.getProfile(this.currentUser.email), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          (response) => {
            this.myUser = response.data
            this.loading = false;
          }
      )
    },

    async deleteBank() {
      const accessToken = await this.$auth.getTokenSilently()
      if(confirm("Êtes-vous sûr de vouloir supprimer ces coordonnées bancaires ?")) {
        this.$axios.delete(this.apiRoutes.deleteBank(this.myUser.bank.id), {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(
            () => {
              this.getProfileComplete()
            }, response => console.log(response)
        )
      }
    },
  }
}
</script>

<style scoped>

</style>