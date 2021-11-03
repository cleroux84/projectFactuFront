<template>
  <v-container>
    <h1>Liste des clients</h1>
    <v-card-title>
      <v-spacer></v-spacer>
    </v-card-title>
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
            no-data-text="Aucun client"
            :footer-props="{
              itemsPerPageText: 'Clients par page par page',
              pageText: '{0}-{1} sur {2}'}"
            :header-props="{sortByText: 'trier par'}"
        >
<!--          <template v-slot:item.delete="{ item }">-->
<!--            <v-row>-->
<!--              <v-icon class="material-icons" color="black" @click="deleteCustomer(item.id)">mdi-delete</v-icon>-->
<!--            </v-row>-->
<!--          </template>-->
          <template v-if="currentUser.role === 1" v-slot:item.update="{ item }">
            <v-row>
              <v-icon class="material-icons" color="black" @click="openUpdateCustomer(item)">mdi-account-edit-outline</v-icon>
            </v-row>
          </template>
        </v-data-table>
      </v-card-text>
    <add-customer-form v-if="showAddCustomerForm" :visible="showAddCustomerForm" @close="closeAddCustomerForm"></add-customer-form>
    <update-customer-form v-model="showUpdateCustomerForm" :updateCustomer="updateCustomer" @close="closeUpdateCustomerForm"></update-customer-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddCustomerForm from "./AddCustomerForm";
import UpdateCustomerForm from "./UpdateCustomerForm";

export default {

  name: "CustomerList",
  components: {UpdateCustomerForm, AddCustomerForm},
  mounted() {
  },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers', "currentUser"]),
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
        { text: '', value: 'update'},
        // { text: '', value: 'delete'},
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
    }
  },

  watch: {
  },
  methods: {
    closeAddCustomerForm() {
      this.showAddCustomerForm = false
    },
    closeUpdateCustomerForm() {
      this.showUpdateCustomerForm = false
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