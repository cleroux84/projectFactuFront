<template>
  <v-container>
      <v-tab>
        <v-col cols="10">
          <h1>Liste des factures</h1>
        </v-col>
        <v-row>
          <v-btn outlined color="blue-grey darken-2">Ajouter une facture</v-btn>
          <v-btn outlined color="blue-grey darken-2">Ajouter un client</v-btn>
          <v-btn outlined color="blue-grey darken-2"><router-link class="linkBtn" to="/customerList">Liste des clients</router-link></v-btn>

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
            <template v-slot:item.customerId=" { item }">
              <span >{{ (item.customer.civility).charAt(0).toUpperCase()+ (item.customer.civility).slice(1) }}
                {{ (item.customer.firstName).toUpperCase() }}
                {{ (item.customer.lastName).charAt(0).toUpperCase()+ (item.customer.lastName).slice(1) }} </span>
            </template>
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
    getAllBills() {
      this.$axios.get(this.apiRoutes.listBill).then(
          (response) => {
            console.log(response.data)
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
          this.checkStringContainsValue(item.customer.firstName, search) ||
          this.checkStringContainsValue(item.customer.lastName, search) ||
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
        {text: "Nom du client", value: 'customerId'},
//                 created: DateTime,
        {text: "Période couverte", value: 'periodCovered'},
        {text: "Avantages", value: 'benefit'},
        {text: "Total facture HT", value: 'totalHT'},
        {text: "Taux TVA", value: 'vatRate'}
      ],
      allBills: []
    }
    }
  }

</script>

<style>
.linkBtn{
  text-decoration: none;
}

</style>