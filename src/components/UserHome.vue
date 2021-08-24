<template>
  <v-container>
    <template v-if="$auth.isAuthenticated">
      <div class="nav-container mb-3">
        <nav class="navbar navbar-expand-md navbar-light bg-light">
          <div class="container">
            <h3>Bienvenue, {{ currentUser.firstName }}</h3>
          </div>
        </nav>
      </div>
      <v-card-actions>
        <div class="text-center">
          <v-btn class="ma-2" outlined color="blue-grey darken-2">
            <router-link class="linkBtn" to="/Profile">
              Mon Profile
            </router-link>
          </v-btn>
          <v-btn class="ma-2" outlined color="blue-grey darken-2">
            <router-link class="linkBtn" to="/BillList">
              Liste des factures
            </router-link>
            <v-icon
                right
                dark
            >
              mdi-view-list
            </v-icon>
          </v-btn>
          <v-btn class="ma-2" outlined color="blue-grey darken-2">
            <router-link class="linkBtn text--darken-3" to="/customerList">
              Liste des clients
            </router-link>
            <v-icon
                right
                dark
            >
              mdi-folder-account
            </v-icon>
          </v-btn>
        </div>
      </v-card-actions>
      <div v-if="currentUser.role === 1">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-account-search"
              search bar
              single-line
              hide-details
          ></v-text-field>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-data-table
              :headers="headers"
              :items="allUsers"
              :custom-filter="customSearch"
              :search="search"
              sort-by="firstName"
          >
            <template v-slot:item.delete="{ item }">
              <v-row>
                <v-icon class="material-icons" color="red" @click="deleteUser(item.id)">mdi-delete</v-icon>
              </v-row>
            </template>
            <!--          <template v-slot:item.update="{ item }">-->
            <!--            <v-row>-->
            <!--              <v-icon class="material-icons" color="red" @click="updateUser(item.id)">mdi-account-edit-outline</v-icon>-->
            <!--            </v-row>-->
            <!--          </template>-->

          </v-data-table>
        </v-card-text>
      </div>
    </template>

    <template v-else>
          <div class="flex-box" style="margin: auto">
              <v-btn
                  rounded
                  x-large
                  :style="{left: '50%', transform:'translateX(-50%)', marginTop: '20%'}"
                  @click="login()"
              >
                Connexion requise
              </v-btn>
          </div>
    </template>
    <login-page v-if="userToRegisterForm" :visible="userToRegisterForm" @close="closeUserRegisterForm" />
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import {getInstance} from "../auth";
import LoginPage from "./LoginPage";

export default {
  name: "UserHome",
  mounted() {
  },
  computed: {
    ...mapGetters(['apiRoutes', 'currentUser', 'allUsers'])
  },
  components: {LoginPage},
  created() {
    //permet d'attendre que le token soit renvoyé
    this.init(this.loadTokenInfoStore)
  },
  methods: {
    init(fn) {
      var instance = getInstance();
      instance.$watch("loading", loading => {
        if (loading === false) {
          fn(instance)
        }
      })
    },

//TODO : probleme rencontré et reglé ici pour set currentUser : https://community.auth0.com/t/auth0-client-is-null-in-vue-spa-component-on-page-refresh/38147/2
    async initializeCurrentUser() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.getCurrentUser(this.$auth.user.email), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          response => {
            this.$store.commit('setCurrentUser', response.data)
          }
      )
    },
    async loadTokenInfoStore(instance) {
      await instance.getTokenSilently().then((authToken) => {
        this.$axios.get(this.apiRoutes.getAllUsers, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }).then(
            (response) => {
              this.$store.commit('setAllUsers', response.data)
              this.connectUser()
            }
        )
      })
    },
    connectUser() {
      if(!this.allUsers.some(data => data.email === this.$auth.user.email)) {
        this.userToRegisterForm = true
      } else {
        this.initializeCurrentUser()
      }
    },
    closeUserRegisterForm() {
      this.userToRegisterForm = false
    },
    async deleteUser(id) {
      let res = await this.$confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
      if(res) {
        this.$axios.delete(this.apiRoutes.deleteUser(id)).then(
            () => {
              this.getAllUsers();
            }, response => {
              console.log(response)
            }
        )
      }
    },
    login() {
      this.$auth.loginWithRedirect();
    },
    checkStringContainsValue(string, value) {
      return (string !== null && string !== undefined && string.toLowerCase().includes(value));
    },

    customSearch (value, search, item) {
      search = search.toLowerCase();
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          this.checkStringContainsValue(item.firstName, search) ||
          this.checkStringContainsValue(item.lastName, search) ||
          this.checkStringContainsValue(item.email, search) ||
          this.checkStringContainsValue(item.phone, search) ||
          this.checkStringContainsValue(item.zipCode, search) ||
          this.checkStringContainsValue(item.city, search) ||
          this.checkStringContainsValue(item.siret, search)
    },
  },
  data() {
    return {
      userToRegisterForm: false,
      role: 0,
      // allUsers: [],
      search: "",
      headers: [
        { text: '', sortable: false, value: 'update'},
        { text: '', sortable: false, value: 'delete'},
        { text: 'Civilité', align: 'start', sortable: false, value: 'civility'},
        { text: 'Prénom', value: 'firstName' },
        { text: 'Nom', value: 'lastName', },
        { text: 'Siret', value: 'siret', },
        { text: 'Email', value: 'email' },
        { text: 'Téléphone', value: 'phone', sortable: false },
        { text: 'Adresse', value: 'address' },
        { text: 'Code Postal', value: 'zipCode' },
        { text: 'Ville', value: 'city' },

      ]
    }
  }


}
</script>

<style scoped>

</style>