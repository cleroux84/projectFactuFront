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
             class="taleClass"
            :headers="headers"
            :items="allBills"
            :custom-filter="customSearch"
            :search="search"
            sort-by="firstName"
            >
<!--            <template v-slot:item.customerId=" { item }">-->
<!--              <span >{{ (item.customer.civility).charAt(0).toUpperCase()+ (item.customer.civility).slice(1) }}-->
<!--                {{ (item.customer.firstName).toUpperCase() }}-->
<!--                {{ (item.customer.lastName).charAt(0).toUpperCase()+ (item.customer.lastName).slice(1) }} </span>-->
<!--            </template>-->
            <template v-slot:item.company=" {item} ">
              <span>{{(item.customer.company).charAt(0).toUpperCase()+ (item.customer.company).slice(1) }}</span>
            </template>
            <template v-slot:item.benefit=" { item }">
              <v-list>
                <v-list-item v-for="benefitItem in item.benefit" v-bind:key="benefitItem.id">
                  <span>{{benefitItem.name}}</span><span> : </span><span>{{benefitItem.quantity * benefitItem.unitPrice}} €HT</span>
                </v-list-item>
              </v-list>
            </template>
            <template v-slot:item.totalHT=" { item }">
                <span>{{item.amountHt}} €</span>
            </template>  <template v-slot:item.totalTtc=" { item }">
                <span>{{item.amountTtc}} €</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-row>
                <v-icon class="material-icons" @click="exportBillPdf(item.id)">mdi-printer</v-icon>
              </v-row>
            </template>
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

    //test pour afficher pdf helloworld
    exportBillPdf(id) {
      this.$axios.get(this.apiRoutes.exportBillPdf(id), { responseType: 'blob'}).then(response => {
        return new Blob([response.data], {type: 'application/pdf'});
      }).then(blob => {
        let objectUrl = window.URL.createObjectURL(blob);

        let anchor = document.createElement('a');
        anchor.setAttribute("type", "hidden");
        anchor.href = objectUrl;
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(objectUrl);

      });
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
        {text: "Imprimer", value: 'actions', sortable: false, align: "center"},//TODO mettre icon oeil pour voir détail de la facture + icon print pour l'imprimer en pdf
        {text: "Date d'émission", value: 'dateOfIssue', sortable: false, align: "center"},
        {text: "Numéro facture", value: 'billNumber', align: "center"},
        {text: "Entreprise", value: 'company', sortable: false, align: "center"},
        // {text: "Nom du client", value: 'customerId', sortable: false},
        {text: "Période couverte", value: 'periodCovered', sortable: false, align: "center"},
        {text: "Prestations", value: 'benefit', sortable: false},
        {text: "Total HT", value: 'totalHT', sortable: false, align: "center"},
        {text: "Total TTC", value: 'totalTtc', sortable: false, align: "center"},
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
table span {
  width: 80px;
}
.taleClass{
  table-layout : fixed;
}
</style>