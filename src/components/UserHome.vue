<template>
  <v-container>
    <h1>Welcome</h1>
    <v-card-title>
    <v-spacer></v-spacer>
      <h5>Connecté en tant que : </h5>
      <span>{{ currentUser.civility }} {{ currentUser.firstName }} {{ currentUser.lastName }}</span>
    </v-card-title>
    <v-btn  outlined style="margin-right: 20px" >
      <router-link class="linkBtn" to="/BillList">Liste des factures</router-link>
    </v-btn>
    <v-btn  outlined style="margin-right: 20px" >
      <router-link class="linkBtn" to="/CustomerList">Liste des clients</router-link>
    </v-btn>
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
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-icon class="material-icons" color="red" @click="deleteCustomer(item.id)">mdi-delete</v-icon>
            <v-icon class="material-icons" color="red" @click="openUpdateCustomer(item)">mdi-account-edit-outline</v-icon>
          </v-row>
        </template>

      </v-data-table>
    </v-card-text>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "UserHome",
  mounted() {
    this.$store.dispatch('getCurrentUser')
  },
  computed: {
    ...mapGetters(['apiRoutes', 'currentUser'])
  },
  created() {
    this.getAllUsers()
  },
  methods: {
    getAllUsers() {
      this.$axios.get(this.apiRoutes.getAllUsers).then(
          (response) => {
            this.allUsers = response.data
          }
      )
    },
    // getCurrentUser() {
    //   this.$axios.get(this.apiRoutes.getCurrentUser(1).then(
    //       (response) => {
    //         console.log(response.data)
    //       }
    //   ))
    // },
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
      allUsers: [],
      search: "",
      headers: [
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