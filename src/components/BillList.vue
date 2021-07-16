<template>
  <v-container>
          <h1>Liste des factures</h1>
          <v-btn style="margin-right: 20px" outlined color="blue-grey darken-2" @click="showAddBillForm = true">Créer une facture</v-btn>
          <v-btn style="margin-right: 20px" outlined color="blue-grey darken-2" @click="showAddCustomerForm=true">Ajouter un client</v-btn>
          <v-btn outlined color="blue-grey darken-2"><router-link class="linkBtn" to="/customerList">Liste des clients</router-link></v-btn>

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
            <template v-slot:item.company=" {item} ">
              <span>{{(item.customer.company).charAt(0).toUpperCase()+ (item.customer.company).slice(1) }}</span>
            </template>
            <template v-slot:item.benefit=" { item }">
              <v-row v-for="benefitItem in item.benefit" v-bind:key="benefitItem.id">
                <span>{{benefitItem.name}}</span>
              </v-row>
            </template>
            <template v-slot:item.totalHT=" { item }">
              <v-row v-for="benefitItem in item.benefit" v-bind:key="benefitItem.id">
                <span>{{benefitItem.quantity * benefitItem.unitPrice}} €</span>
              </v-row>
            </template>
<!--            <template v-slot:item.actions="{ item }">-->
<!--              <v-row>-->
<!--                <v-icon class="material-icons" color="red" @click="deleteBill(item.id)">mdi-delete</v-icon>-->
<!--              </v-row>-->
<!--            </template>-->
          </v-data-table>
        </v-card-text>
      <AddCustomerForm :visible="showAddCustomerForm"/>
      <AddBillForm :visible="showAddBillForm" />

  </v-container>

</template>

<script>
import {mapGetters} from "vuex";
import AddCustomerForm from "./AddCustomerForm";
import AddBillForm from "./AddBillForm";

export default {
  name: "BillList",
  components: { AddCustomerForm, AddBillForm },
  mounted() {
    this.$store.dispatch('getAllCustomers');
  },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers']),
  },

  created() {
    this.getAllBills();
  },

  methods: {
    getAllBills() {
      this.$axios.get(this.apiRoutes.listBill).then(
          (response) => {
            // console.log(response.data)
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
          this.checkStringContainsValue(item.customer.company, search) ||
          this.checkStringContainsValue(item.periodCovered, search) ||
          this.checkStringContainsValue(item.benefit, search) ||
          this.checkStringContainsValue(item.unitPrice, search) ||
          this.checkStringContainsValue(item.vatRate, search)
    },
    // deleteBill(id) {
    //   this.$axios.delete(this.apiRoutes.deleteBill(id)).then(
    //       () => {
    //         this.getAllBills();
    //       }, response => {
    //         console.log(response)
    //       }
    //   )
    // }
  },
  data() {
    return {
      showAddBillForm: false,
      showAddCustomerForm: false,
      search: "",
      headers: [
        {text: "", value: 'actions', sortable: false},//TODO mettre icon oeil pour voir détail de la facture + icon print pour l'imprimer en pdf
        {text: "Date d'émission", value: 'dateOfIssue', sortable: false},
        {text: "Numéro facture", value: 'billNumber'},
        {text: "Entreprise", value: 'company', sortable: false},
        {text: "Nom du client", value: 'customerId', sortable: false},
        {text: "Période couverte", value: 'periodCovered', sortable: false},
        {text: "Prestations", value: 'benefit', sortable: false},
        {text: "Total facture HT", value: 'totalHT', sortable: false},
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