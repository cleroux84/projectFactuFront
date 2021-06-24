<template>
  <v-container>
      <v-tab>
        <v-col cols="10">
          <h1>Liste des factures</h1>
        </v-col>
        <v-row>
          <v-btn>Ajouter une facture</v-btn>
          <v-btn>Ajouter un client</v-btn>
          <v-btn>Liste des clients</v-btn>
        </v-row>
      </v-tab>
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
            :items="allBills"
            :custom-filter="customSearch"
            :search="search"
            sort-by="firstName"
            >
          </v-data-table>
        </v-card-text>


  </v-container>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "BillList",
  mounted() {
    this.$store.dispatch('getAllCustomers');
  },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers'])
  },

  created() {
    this.getAllBills();
  },

  methods: {
    // getCurrentCustomer(customerId) {
    //   return this.allCustomers.filter(this.allCustomers, currentCustomer => {
    //     return currentCustomer.id === customerId
    //
    //   })
    // },
    getAllBills() {
      this.$axios.get(this.apiRoutes.listBill).then(
          (response) => {
            this.allBills = response.data
          }
      )
    },
    checkStringContainsValue(string, value) {
      return (string !== null && string !== undefined && string.toString().toLowerCase().includes(value));
    },
    customSearch (value, search, item) {
      search = search.toLowerCase();
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          this.checkStringContainsValue(item.billNumber, search) ||
          this.checkStringContainsValue(item.customerId, search) ||
          this.checkStringContainsValue(item.periodCovered, search) ||
          this.checkStringContainsValue(item.benefit, search) ||
          this.checkStringContainsValue(item.unitPrice, search) ||
          this.checkStringContainsValue(item.vatRate, search)
    },
  },
  data() {
    return {
      search: "",
      headers: [
        {text: "Numéro facture", value: 'billNumber'},
        {text: "Numéro client", value: 'customerId'},
//                 created: DateTime,
        {text: "Période couverte", value: 'periodCovered'},
        {text: "Avantages", value: 'benefit'},
        {text: "Prix unitaire", value: 'unitPrice'},
        {text: "Taux TVA", value: 'vatRate'}
      ],
      allBills: []
    }
    }
  }

</script>

<style scoped>

</style>