<template>
  <v-app>
    <v-app-bar
      app
      color="blue-grey darken-2"
      dark
    >
      <div class="d-flex align-center">
        <v-toolbar-title>FACTRUC</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ currentUser.email }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'App',
  mounted() {
    this.$store.dispatch('getCurrentUser')
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  data: () => ({
    //
  }),
};
</script>
