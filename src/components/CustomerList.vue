<template>
  <v-container>
    <v-col cols="12">
      <v-tab>
        <v-col cols="10">
          <h1>Liste des clients</h1>
        </v-col>
        <v-col cols="2">
          <v-btn outlined color="primary" @click="showAddCustomerForm=true">Ajouter un client</v-btn>
        </v-col>
      </v-tab>
    </v-col>

    <v-col cols="auto">
      <v-dialog
          transition="dialog-top-transition"
          max-width="600"
      >
      </v-dialog>

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
            :items="allCustomers"
            :custom-filter="customSearch"
            :search="search"
            sort-by="firstName"
        >
          <template v-slot:item.delete="{ item }">
            <v-row>
              <v-icon class="material-icons" color="red" @click="deleteCustomer(item.id)">mdi-delete</v-icon>
              <v-icon class="material-icons" color="red" @click="openUpdateCustomer(item)">mdi-account-edit-outline</v-icon>
            </v-row>
          </template>

        </v-data-table>
      </v-card-text>
    </v-col>
    <add-customer-form :visible="showAddCustomerForm"></add-customer-form>
    <update-customer-form v-model="showUpdateCustomerForm" :updateCustomer="updateCustomer"></update-customer-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddCustomerForm from "./AddCustomerForm";
import UpdateCustomerForm from "./UpdateCustomerForm";

export default {

  name: "CustomerList",
  components: {UpdateCustomerForm, AddCustomerForm},
  computed: {
    ...mapGetters(['apiRoutes'])
  },
  component: {
    AddCustomerForm, UpdateCustomerForm
  },

  data() {
    return {
      updateCustomer: {},
      showAddCustomerForm: false,
      showUpdateCustomerForm: false,
      search: "",
      headers: [
        { text: 'Actions', value: 'delete'},
        { text: 'Entreprise', value: 'company' },
        { text: 'Civilité', align: 'start', sortable: false, value: 'civility'},
        { text: 'Prénom', value: 'lastName' },
        { text: 'Nom', value: 'firstName', },
        { text: 'Numero TVA', value: 'VATNumber', sortable: false },
        { text: 'Email', value: 'email' },
        { text: 'Téléphone', value: 'phone', sortable: false },
        { text: 'Adresse', value: 'address' },
        { text: 'Code Postal', value: 'zipCode' },
        { text: 'Ville', value: 'city' },
      ],

      allCustomers: [],
    }
  },

  created() {
    this.getAllCustomers();
  },
  methods: {
    getAllCustomers() {
      this.$axios.get(this.apiRoutes.listCustomer).then(
          (response) => {
            this.allCustomers= response.data
          }
      )
    },
    deleteCustomer(id) {
      this.$axios.delete(this.apiRoutes.deleteCustomer(id)).then(
          () => {
            this.getAllCustomers()
          }, response => {
            console.log(response);
          }
      )
    },
    openUpdateCustomer(item) {
      this.updateCustomer = item;
      this.showUpdateCustomerForm = true;
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
          this.checkStringContainsValue(item.VATNumber, search) ||
          this.checkStringContainsValue(item.company, search)
    },
  },
}
</script>


<style scoped>

</style>