<template>
  <v-app>
    <v-main>
      <Nav />
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import {mapGetters} from "vuex";
import Nav from "./components/partials/Nav";

export default {
  name: 'App',
  components: { Nav },
  mounted() {
    // this.$store.dispatch('getCurrentUser', this.$auth.user.email)
    this.$store.dispatch('getAllCustomers')
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  data: () => ({
    //
  }),
};
</script>
