<template>
  <v-container>
    <h1>Liste des factures</h1>
    <v-card-title>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-switch
        v-model="switchTable"
        inset
        label="Factures non payées"
    ></v-switch>
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
         no-data-text="Aucune facture"
         :footer-props="{
          itemsPerPageText: 'Factures par page',
          pageText: '{0}-{1} sur {2}'}"
         :header-props="{sortByText: 'trier par'}"
      >
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
        </template>
        <template v-slot:item.totalHT=" { item }">
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
                  @click="exportBillPdf(item.id, currentUser.email)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-printer
              </v-icon>
            </template>
            <span>Imprimer la facture</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-show="!item.paid"
                  class="material-icons"
                  @click="getThisBill(item.id)"
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-calculator
              </v-icon>
            </template>
            <span>Indiquer un paiement</span>
          </v-tooltip>
        </template>
        <template v-slot:item.unPaid=" { item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-show="!item.paid && item.paymentStatus === 'latePayment'"
                  class="material-icons"
                  v-bind="attrs"
                  v-on="on"
                  color="red"
              >
                mdi-alert
              </v-icon>
              <v-icon
                  v-show="!item.paid && item.paymentStatus === 'waitingPayment'"
                  class="material-icons"
                  v-bind="attrs"
                  v-on="on"
                  color="orange"
              >
                mdi-timer
              </v-icon>
              <v-icon
                  v-show="item.paid"
                  class="material-icons"
                  v-bind="attrs"
                  v-on="on"
                  color="green"
              >
                mdi-check
              </v-icon>
            </template>
            <span v-show="!item.paid && item.paymentStatus === 'latePayment'">Facture en retard de paiement</span>
            <span v-show="!item.paid && item.paymentStatus === 'waitingPayment'">Facture en attente de paiement</span>
            <span v-show="item.paid">Facture payée le {{item.paymentDate}} </span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <AddCustomerForm v-if="showAddCustomerForm" :visible="showAddCustomerForm" @close="closeAddCustomerForm"/>
    <AddBillForm v-if="showAddBillForm" :visible="showAddBillForm" @close="closeAddBillForm" />
    <UpdatePaymentForm v-if="showUpdatePayment" :allBills="allBills" :myBill="myBill" :visible="showUpdatePayment" @close="closeUpdatePayment" />
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddCustomerForm from "./AddCustomerForm";
import AddBillForm from "./AddBillForm";
import UpdatePaymentForm from "./UpdatePaymentForm";
import BillsListService from "../services/BillsListService";

export default {
  name: "BillList",
  components: {UpdatePaymentForm, AddCustomerForm, AddBillForm },
  computed: {
    ...mapGetters(['apiRoutes', 'allBills', 'currentUser', 'unpaidBills']),
  },

  created() {
    this.giveGoodList()
  },

  watch: {
    switchTable(bool) {
      if (bool) {
        if(this.currentUser.role === 1) {
          this.getUnpaidBills()
        } else {
          this.getUnpaidBillsByUser()
        }
      } else {
        this.giveGoodList()
      }
    },
  },

  methods: {
    ...mapActions(['getAllBillsList']),
    closeAddBillForm() {
      this.showAddBillForm = false
      this.giveGoodList()
    },
    closeAddCustomerForm() {
      this.showAddCustomerForm = false
    },
    closeUpdatePayment() {
      this.showUpdatePayment = false
      this.giveGoodList()
    },

    giveGoodList(){
      if (this.currentUser.role === 0) this.getAllBillsByUser();
      else this.getAllBills()
    },

    //methods service appel à la DB
    async getAllBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getBillsListByUser(accessToken, this.currentUser.id).then(
          bills => {
            this.$store.commit('setAllBills', bills)
          }
      )
    },

    async getAllBills() {
      const accessToken = await this.$auth.getTokenSilently()
      await this.getAllBillsList(accessToken)
    },

    async getUnpaidBills() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getUnpaidBillsList(accessToken).then(
          unpaidBills => {
            this.$store.commit('setAllBills', unpaidBills)
          }
      )
    },

    async getUnpaidBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getUnpaidBillsListByUser(accessToken, this.currentUser.id).then(
          (unPaidBills => {
            this.$store.commit('setAllBills', unPaidBills)
          })
      )
    },

    async getThisBill(id) {
      await BillsListService.getBill(id).then(
          (bill => {
            this.myBill = bill
            this.showUpdatePayment = true
          })
      )
    },

    exportBillPdf(id, user) {
      this.$axios.get(this.apiRoutes.exportBillPdf(id, user), { responseType: 'blob'}).then(response => {
        return new Blob([response.data], {type: 'application/pdf'});
      }).then(blob => {
        let objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl)
      });
    },

    //methods pour la barre de recherche
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
  },
  data() {
    return {
      myBill: {},
      showUpdatePayment: false,
      switchTable: false,
      lateBills: [],
      isLateToPaid: false,
      isWaitingPaiement: false,
      isPaid: false,
      showAddBillForm: false,
      showAddCustomerForm: false,
      search: "",
      headers: [
        {text: "", value: 'actions', sortable: false, align: "center"},
        {text: "", value: 'unPaid', sortable: false, align: "center"},
        {text: "Date d'émission", value: 'dateOfIssue', sortable: false, align: "center"},
        {text: "Numéro facture", value: 'billNumber', align: "center"},
        {text: "Entreprise", value: 'company', sortable: false, align: "center"},
        {text: "Période couverte", value: 'periodCovered', sortable: false, align: "center"},
        {text: "Prestations", value: 'benefit', sortable: false, align: "center"},
        {text: "Total HT", value: 'totalHT', sortable: false, align: "center"},
        {text: "Total TTC", value: 'totalTtc', sortable: false, align: "center"},
      ],
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