<template>
  <v-app>
    <v-app-bar
      app
      color="blue-grey darken-2"
      dark
    >
      <div class="d-flex align-center">
        FACTRUC
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
