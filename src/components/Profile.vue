<template>
  <v-container>
    <template>
      <v-card
          class="mx-auto my-12"
          max-width="374"
      >
        <template slot="progress">
        </template>
        <v-card-title>
          <v-col cols="10">
            {{ currentUser.civility }} {{ currentUser.firstName }} {{ currentUser.lastName }}
          </v-col>
          <v-col cols="2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                       v-bind="attrs"
                       v-on="on"
                       @click="showUpdateUserForm=true">
                  <v-icon> mdi-pen </v-icon>
                </v-btn>
              </template>
              <span>Modifier mon profil</span>
            </v-tooltip>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-row
              align="center"
              class="mx-0"
          >
          </v-row>
          <div class="my-4 text-subtitle-1">
            <v-col>
              <address>{{ currentUser.address }}</address>
              <address>{{ currentUser.zipCode }} {{ currentUser.city }} </address>
              <div>{{ currentUser.phone }}</div>
              <v-spacer></v-spacer>
              <div>Siret : {{ currentUser.siret }}</div>
            </v-col>
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
import BankService from "../services/BankService";

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
      let res = await this.$confirm("Êtes-vous sûr de vouloir supprimer ces coordonnées bancaires ?")
      if(res) {
       BankService.deleteBank(accessToken, this.myUser.bank.id).then(
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