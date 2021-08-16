<template>
  <v-container>
    <h1>Liste des factures</h1>
    <v-card-title>
      <v-spacer></v-spacer>
      <h5>Connecté en tant que : </h5>
      <span>{{ currentUser.civility }} {{ currentUser.firstName }} {{ currentUser.lastName }}</span>

    </v-card-title>
    <v-card-actions>
      <div class="text-center">
        <v-btn class="ma-2" outlined >
          <router-link class="linkBtn" to="/">Accueil</router-link>
          <v-icon
              right
              dark
          >
            mdi-home
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
        <v-btn
            class="ma-2"
            outlined color="blue-grey darken-2"
            @click="showAddBillForm = true"
        >
          Nouvelle Facture
          <v-icon
              right
              dark
          >
            mdi-calculator
          </v-icon>
        </v-btn>
        <v-btn
            class="ma-2"
            outlined color="blue-grey darken-2"
            @click="showAddCustomerForm=true"
        >
          Nouveau Client
          <v-icon
              right
              dark
          >
            mdi-factory
          </v-icon>
        </v-btn>
      </div>
    </v-card-actions>
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
              <span>{{benefitItem.name}}</span>:<span>{{(benefitItem.quantity * benefitItem.unitPrice).toFixed(2)}} €HT</span>
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.dateOfIssue=" { item }">
            <span>{{item.created}}</span>
        </template>  <template v-slot:item.totalHT=" { item }">
            <span>{{item.amountHt.toFixed(2)}} €</span>
        </template>
        <template v-slot:item.totalTtc=" { item }">
            <span>{{item.amountTtc.toFixed(2)}} €</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  class="material-icons"
                  @click="exportBillPdf(item.id)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-printer
              </v-icon>
            </template>
            <span>Imprimer la facture</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <AddCustomerForm v-if="showAddCustomerForm" :visible="showAddCustomerForm" @close="closeAddCustomerForm"/>
    <AddBillForm v-if="showAddBillForm" :visible="showAddBillForm" @close="closeAddBillForm" />
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddCustomerForm from "./AddCustomerForm";
import AddBillForm from "./AddBillForm";

export default {
  name: "BillList",
  components: { AddCustomerForm, AddBillForm },
  computed: {
    ...mapGetters(['apiRoutes', 'allCustomers', 'currentUser']),
    ...mapActions(['getCurrentUser'])
  },

  created() {
    this.$store.dispatch('getCurrentUser', this.$auth.user.email)
    if (this.currentUser.role === 0)
    this.getAllBillsByUser();
    else this.getAllBills()
  },

  methods: {
    closeAddBillForm() {
      this.showAddBillForm = false
      this.getAllBills()
    },
    closeAddCustomerForm() {
      this.showAddCustomerForm = false
    },

    async getAllBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      console.log(accessToken)
      this.$axios.get(this.apiRoutes.listBillByUser(this.currentUser.id), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          (response) => {
            // console.log(response.data)
            this.allBills = response.data
          }
      )
    },

    async getAllBills() {
      const accessToken = await this.$auth.getTokenSilently()
      console.log(accessToken)
      this.$axios.get(this.apiRoutes.listBill, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          (response) => {
            // console.log(response.data)
            this.allBills = response.data
          }
      )
    },

    exportBillPdf(id) {
      this.$axios.get(this.apiRoutes.exportBillPdf(id), { responseType: 'blob'}).then(response => {
        return new Blob([response.data], {type: 'application/pdf'});
      }).then(blob => {
        let objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl)
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
        {text: "", value: 'actions', sortable: false, align: "center"},
        {text: "Date d'émission", value: 'dateOfIssue', sortable: false, align: "center"},
        {text: "Numéro facture", value: 'billNumber', align: "center"},
        {text: "Entreprise", value: 'company', sortable: false, align: "center"},
        {text: "Période couverte", value: 'periodCovered', sortable: false, align: "center"},
        {text: "Prestations", value: 'benefit', sortable: false, align: "center"},
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
.v-application a{
 color: black !important;
}
table span {
  width: 80px;
}
.taleClass{
  table-layout : fixed;
}
</style>