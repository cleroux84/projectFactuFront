<template>
  <div>
  <v-app-bar
        color="blue-grey darken-2"
        dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title v-if="!isMobile">FacTruc</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>

      </div>
      <div v-if="$auth.isAuthenticated && !isMobile">Bienvenue {{$auth.user.name}}</div>
      <v-spacer></v-spacer>
      <div style="margin-right: 20px">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
              <v-btn icon
                     v-bind="attrs"
                     v-on="on"
                     @click="openAddBillForm">
                <v-icon> mdi-file-document </v-icon>
              </v-btn>
          </template>
          <span>Créer une nouvelle facture</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
                   v-bind="attrs"
                   v-on="on"
                   @click="openAddCustomerForm">
              <v-icon> mdi-account-plus </v-icon>
            </v-btn>
          </template>
          <span>Créer un nouveau client</span>
        </v-tooltip>
      </div>
      <v-toolbar-title>
        <div v-if="!$auth.loading">
          <v-btn v-if="!$auth.isAuthenticated" @click="login">
            Connexion
          </v-btn>
          <v-btn v-if="$auth.isAuthenticated" @click="logout">
            Déconnexion
          </v-btn>
        </div>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        absolute
        bottom
        temporary
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="blue-grey darken-2--text text--accent-4"
        >
          <router-link id="homePage" class="linkBtn" to="/">
            <v-list-item>
              <v-list-item-title>
                <span>Accueil</span>
            </v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link id="profile" class="linkBtn" to="/Profile">
            <v-list-item>
              <v-list-item-title>
                <span>Mon profil</span>
              </v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link class="linkBtn" to="/BillList" id="billLists" >
            <v-list-item>
              <v-list-item-title>
                <span>Liste des factures</span>
              </v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link class="linkBtn text--darken-3" to="/customerList" id="CustomerList" >
            <v-list-item>
              <v-list-item-title>
                <span>Liste des clients</span>
              </v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <AddBillForm v-if="showAddBillForm" :visible="showAddBillForm" @close="closeAddBillForm" />
    <add-customer-form v-if="showAddCustomerForm" :visible="showAddCustomerForm" @close="closeAddCustomerForm"></add-customer-form>
  </div>
</template>

<script>
import AddBillForm from "../AddBillForm";
import AddCustomerForm from "../AddCustomerForm";
import {mapGetters} from "vuex";

export default {
  name: 'Nav',
  components: {AddBillForm, AddCustomerForm},
  computed: {...mapGetters(['isMobile'])},
  created() {
    if(screen.width <= 760) this.$store.commit('setIsMobile', true);
  },
  data() {
    return {
      drawer: false,
      group: null,
      showAddBillForm: false,
      showAddCustomerForm: false
    }
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
    closeAddBillForm() {
      this.showAddBillForm = false
      // this.giveGoodList()
    },
    openAddBillForm() {
      this.showAddBillForm = true
    },
    closeAddCustomerForm() {
      this.showAddCustomerForm = false
      // this.giveGoodList()
    },
    openAddCustomerForm() {
      this.showAddCustomerForm = true
    }

  }
}
</script>
<style>
.theme--dark.v-btn.v-btn--has-bg {
  background-color: rgba(255,255,255,0);
}

</style>
