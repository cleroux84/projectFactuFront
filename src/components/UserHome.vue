<template>
  <v-container>

    <template>
      <div class="nav-container mb-3">
        <nav class="navbar navbar-expand-md navbar-light bg-light">
          <div class="container">
            <h3 v-if="$auth.isAuthenticated">Bienvenue, {{ $auth.user.name }}</h3>
          </div>
        </nav>
      </div>
    </template>

<!--    <h1>Welcome</h1>-->
    <v-card-title>
    <v-spacer></v-spacer>
<!--      <h5>Connecté en tant que : </h5>-->
<!--      <span>{{ currentUser.civility }} {{ currentUser.firstName }} {{ currentUser.lastName }}</span>-->
    </v-card-title>
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

<!--    TODO : si role admin-->
    <div v-if="$auth.isAuthenticated">
        {{ currentUser.email }}
      <div>
      </div>
    </div>
    <div v-else>
      Aucune connexion
    </div>
    <div v-if="this.currentUser.role === 1">
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

  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "UserHome",
  mounted() {
    // this.$store.dispatch('getCurrentUser')
  },
  computed: {
    ...mapActions(['getCurrentUser']),
    ...mapGetters(['apiRoutes', 'currentUser'])
  },
  created() {
    this.$store.dispatch('getCurrentUser', this.$auth.user.email)
    this.getAllUsers()
    // this.test(1)
  },
  methods: {
    getAllUsers() {
      this.$axios.get(this.apiRoutes.getAllUsers).then(
          (response) => {
            this.allUsers = response.data
          }
      )
    },

    deleteUser(id) {
      if(confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        this.$axios.delete(this.apiRoutes.deleteUser(id)).then(
            () => {
              this.getAllUsers();
            }, response => {
              console.log(response)
            }
        )
      }
    },


    // async test(id) {
    //   if(this.$auth.isAuthenticated) {
    //     const accessToken = await this.$auth.getTokenSilently()
    //     console.log(accessToken)
    //     this.$axios.get(this.apiRoutes.testUser(id), {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`
    //       }
    //     }).then(
    //         response => {
    //           console.log("user en dur :")
    //           console.log(response.data)
    //         }
    //     )
    //   }
    // },

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
      role: 0,
      allUsers: [],
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