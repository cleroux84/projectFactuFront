<template>
  <v-container>
    <template v-if="$auth.isAuthenticated">
      <div class="nav-container mb-3">
        <nav class="navbar navbar-expand-md navbar-light bg-light">
          <div class="container">
            <h3>Bienvenue, {{ currentUser.firstName }}</h3>
          </div>
        </nav>
      </div>
      <v-container fluid v-if="!this.isMobile">
        <v-col cols="4">
          <v-select
              v-if="currentUser.role === 1"
              :items="allUsers"
              :item-text="(row) => {return row.firstName+ ' ' + row.lastName;}"
              item-value="id"
              v-model="billUser"
              label="Trier par utilisateur"
              :clearable="true"
          >
          </v-select>
        </v-col>
        <v-row dense>
          <v-col cols="5" class="carre">
            <v-card height="290px">
              <p class="text-h6" v-if="currentUser.role === 1">TOTAL DES FACTURES <br> depuis 1er Janvier</p>
              <p v-else>TOTAL de mes FACTURES <br> depuis LE 1er Janvier</p>
              <v-card-title class="text-h4" style="justify-content: center">{{this.billsSum}} € HT
              </v-card-title>
              <v-spacer></v-spacer>
              <p class="text-h6" v-if="currentUser.role ===1">TOTAL DES FACTURES IMPAYEES</p>
              <p v-else>TOTAL DE MES FACTURES IMPAYEES</p>
              <v-card-title class="text-h4" style="justify-content: center">{{this.unpaidBillsSum}} € TTC</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="5" class="carre">
            <v-card height="290px" >
              <p class="text-h6">POURCENTAGE DES FACTURES IMPAYEES</p>
              <div style="margin-top: 50px">
                <v-progress-circular
                    v-model="averageUnpaidBills"
                    :rotate="360"
                    :size="125"
                    :width="15"
                    color="teal"
                >
                  {{ averageUnpaidBills }} %
                </v-progress-circular>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid v-else>
          <v-col cols="12" class="carreMobile">
            <v-card>
              <p v-if="currentUser.role === 1">TOTAL DES FACTURES <br> depuis 1er Janvier</p>
              <p v-else>TOTAL de mes FACTURES <br> depuis LE 1er Janvier</p>
              <v-card-title class="text-h6" style="justify-content: center">{{this.billsSum}} € HT
              </v-card-title>
              <v-spacer></v-spacer>
              <p v-if="currentUser.role ===1">TOTAL DES FACTURES IMPAYEES</p>
              <p v-else>TOTAL DE MES FACTURES IMPAYEES</p>
              <v-card-title class="text-h6" style="justify-content: center">{{this.unpaidBillsSum}} € TTC</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" class="carreMobile">
            <v-card height="290px" >
              <p>POURCENTAGE DES FACTURES IMPAYEES</p>
              <div style="margin-top: 50px">
                <v-progress-circular
                    v-model="averageUnpaidBills"
                    :rotate="360"
                    :size="125"
                    :width="15"
                    color="teal"
                >
                  {{ averageUnpaidBills }} %
                </v-progress-circular>
              </div>
            </v-card>
          </v-col>
      </v-container>
      <div>
        <v-expansion-panels style="margin-top: 40px">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h1 v-if="!this.isMobile">Liste des factures en retard de paiement</h1>
              <h4 v-else>Factures en retard de paiement</h4>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="searchForLateBills"
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
                  :headers="headersForBills"
                  :items="allLateBills"
                  :custom-filter="customSearchForLateBills"
                  :search="searchForLateBills"
                  sort-by="firstName"
                  no-data-text="Aucune facture en retard de paiement"
                  :footer-props="{
                    itemsPerPageText: 'Factures par page',
                    pageText: '{0}-{1} sur {2}'}"
                  :header-props="{sortByText: 'trier par'}"
              >
                <template v-slot:item.dateOfIssue=" { item }">
                  <span>{{item.created}}</span>
                </template>
                <template v-slot:item.company=" {item} ">
                  <span>{{(item.customer.company).charAt(0).toUpperCase()+ (item.customer.company).slice(1) }}</span>
                </template>
                <template v-slot:item.totalHT=" { item }">
                  <span>{{item.amountHt.toFixed(2)}} €</span>
                </template>
                <template v-slot:item.customer=" { item }">
                  <span>{{item.customer.civility}} {{item.customer.firstName}} {{item.customer.lastName}}</span>
                </template>
                <template v-slot:item.email=" { item }">
                  <span><a :href="'mailto:' +  item.customer.email"> {{item.customer.email}}</a></span>
                </template>
              </v-data-table>
            </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div v-if="currentUser.role === 1">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h4 v-if="isMobile">Liste des utilisateurs</h4>
              <h1 v-else>Liste des utilisateurs</h1>
            </v-expansion-panel-header>
            <v-expansion-panel-content>

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
              no-data-text="Aucun utilisateur n'est encore enregistré"
              :footer-props="{
                itemsPerPageText: 'Utilisateurs par page',
                pageText: '{0}-{1} sur {2}'}"
              :header-props="{sortByText: 'trier par'}"
          >
<!--            <template v-slot:item.delete="{ item }">-->
<!--              <v-row>-->
<!--                <v-icon class="material-icons" color="red" @click="deleteUser(item.id)">mdi-delete</v-icon>-->
<!--              </v-row>-->
<!--            </template>-->
            <!--          <template v-slot:item.update="{ item }">-->
            <!--            <v-row>-->
            <!--              <v-icon class="material-icons" color="red" @click="updateUser(item.id)">mdi-account-edit-outline</v-icon>-->
            <!--            </v-row>-->
            <!--          </template>-->

          </v-data-table>
        </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </template>

    <template v-else>
          <div class="flex-box" style="margin: auto">
              <v-btn
                  rounded
                  x-large
                  :style="{left: '50%', transform:'translateX(-50%)', marginTop: '20%'}"
                  color="blue-grey darken-2"
                  @click="login()"
                  dark
                  class="button"
              >
                Connexion requise
              </v-btn>
          </div>
    </template>
    <login-page v-if="userToRegisterForm" :visible="userToRegisterForm" @close="closeUserRegisterForm" />
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {getInstance} from "../auth";
import LoginPage from "./LoginPage";
import UserService from "../services/UserService";
import BillsListService from "../services/BillsListService";

export default {
  name: "UserHome",
  mounted() {
  },
  computed: {
    ...mapGetters(['apiRoutes','currentUser', 'allUsers', "allLateBills", "billsSum", "unpaidBillsSum", "averageUnpaidBills", 'allBills', 'isMobile'])
  },
  components: {LoginPage},
  created() {
    //permet d'attendre que le token soit renvoyé
    this.init(this.loadTokenInfoStore)
  },
  watch: {
    billUser(billUserId) {
      if(billUserId !== null && billUserId !== undefined) {
        this.getListByUser(this.billUser)
      } else this.getAllBills()
    }
  },
  methods: {
    ...mapActions(['getSum', 'getUnpaidSum', 'getAllBillsList']),

    init(fn) {
      let instance = getInstance();
      instance.$watch("loading", loading => {
        if (loading === false) {
          fn(instance)
        }
      })
    },

    async loadTokenInfoStore(instance) {
      await instance.getTokenSilently().then((authToken) => {
        UserService.getAllUsers(authToken).then(
            (allUsers => {
              this.$store.commit('setAllUsers', allUsers)
              this.connectUser()
            })
        )
      })
    },

    connectUser() {
      if(!this.allUsers.some(data => data.email === this.$auth.user.email)) {
        this.userToRegisterForm = true
      } else {
        this.initializeCurrentUserConnexion()

      }
    },
    //TODO : probleme rencontré et reglé ici pour set currentUser : https://community.auth0.com/t/auth0-client-is-null-in-vue-spa-component-on-page-refresh/38147/2
    async initializeCurrentUserConnexion() {
      const accessToken = await this.$auth.getTokenSilently()
      UserService.getCurrentUser(accessToken, this.$auth.user.email).then(
          (user => {
            this.$store.commit('setCurrentUser', user)
            
            if(this.currentUser.role === 1) {
              this.getUnpaidBills()
              this.getAllBills()
            } else {
              this.getUnpaidBillsByUser()
              this.getAllBillsByUser()
            }
          })
      )
    },

    async getUnpaidBills() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getLateBillsList(accessToken).then(
          unpaidBills => {
            this.$store.commit('setAllLateBills', unpaidBills)
          }
      )
    },

    async getUnpaidBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getLateBillsListByUser(accessToken, this.currentUser.id).then(
          unpaidBills => {
            this.$store.commit('setAllLateBills', unpaidBills)
          }
      )
    },

    getStats() {
      this.getSumAllBillsThisYear()
      this.getAllUnpaidSum()
      this.averageResult()
    },

    async getAllBills() {
      const accessToken = await this.$auth.getTokenSilently()
      await this.getAllBillsList(accessToken)
            this.getStats()
    },

    async getAllBillsByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      await BillsListService.getBillsListByUser(accessToken, this.currentUser.id).then(
          bills => {
            this.$store.commit('setAllBills', bills)
            this.getStats()
          }
      )
    },

    averageResult: function () {
      var average = ((this.unpaidBills.length * 100) / this.allBills.length).toFixed(2) //donne pourcentage de facture non payées
      this.$store.commit('setAverageUnpaidBills', average)
    },

    async getListByUser() {
      const accessToken = await this.$auth.getTokenSilently()
      this.$axios.get(this.apiRoutes.listBillByUser(this.billUser), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(
          response => {
            this.$store.commit('setAllBills', response.data)
            this.getStats()
          }
      )
    },

    getSumAllBillsThisYear() {
      this.allBillsForSumArray = this.allBills.filter(bill => {
        var date = bill.created;
        var myCreated = new Date(date);
        var year = myCreated.getFullYear();
        return year === new Date().getFullYear()
      })
      this.getSum(this.allBillsForSumArray)
    },

    getAllUnpaidSum() {
      this.unpaidBills = this.allBills.filter(bill => {
        return bill.paid === false
      })
     this.getUnpaidSum(this.unpaidBills)
    },

    // async deleteUser(id) {
    //   let res = await this.$confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
    //   if(res) {
    //     this.$axios.delete(this.apiRoutes.deleteUser(id)).then(
    //         () => {
    //           this.getAllUsers();
    //         }, response => {
    //           console.log(response)
    //         }
    //     )
    //   }
    // },

    login() {
      this.$auth.loginWithRedirect();
    },
    closeUserRegisterForm() {
      this.userToRegisterForm = false
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
    customSearchForLateBills (value, searchForLateBills, item) {
      searchForLateBills = searchForLateBills.toLowerCase();
      return value != null &&
          searchForLateBills != null &&
          typeof value === 'string' &&
          this.checkStringContainsValue(item.customer.firstName, searchForLateBills) ||
          this.checkStringContainsValue(item.customer.lastName, searchForLateBills) ||
          this.checkStringContainsValue(item.customer.email, searchForLateBills) ||
          this.checkStringContainsValue(item.billNumber, searchForLateBills) ||
          this.checkStringContainsValue(item.customer.company, searchForLateBills) ||
          this.checkStringContainsValue(item.customer.siret, searchForLateBills)
    },
  },
  data() {
    return {
      billUser: null,
      unpaidBills: [],
      allBillsPaid: [],
      allBillsUnpaid: [],
      allBillsForSumArray: null,
      userToRegisterForm: false,
      role: 0,
      search: "",
      searchForLateBills: "",
      headersForBills: [
        {text: "Date d'émission", value: 'dateOfIssue', align: "center"},
        {text: "Numéro facture", value: 'billNumber', align: "center"},
        {text: "Période couverte", value: 'periodCovered', sortable: false, align: "center"},
        {text: "Total HT", value: 'totalHT', sortable: false, align: "center"},
        {text: "Entreprise", value: 'company', align: "center"},
        {text: "Nom du contact", value: 'customer', sortable: false, align: "center"},
        {text: "Email", value: 'email', sortable: false, align: "center"},

      ],
      headers: [
        { text: '', sortable: false, value: 'update'},
        // { text: '', sortable: false, value: 'delete'},
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
.carre {
  border-style: double;
  margin-left: 50px;
  text-align: center;
  height: 300px;
}
.carreMobile{
  text-align: center;
}
.button {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  -webkit-animation: glowing 1500ms infinite;
}
@-webkit-keyframes glowing {
  0% { background-color: #223149; -webkit-box-shadow: 0 0 3px #23272d; }
  50% { background-color: #353b3e; -webkit-box-shadow: 0 0 40px #1c1a1a; }
  100% { background-color: #2d2d34; -webkit-box-shadow: 0 0 3px #262628; }
}
</style>