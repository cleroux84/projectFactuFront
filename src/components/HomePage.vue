<template>
  <div v-if="!$auth.loading">
    <v-btn v-if="!$auth.isAuthenticated" @click="login">
      Connexion
    </v-btn>
    <v-btn v-if="$auth.isAuthenticated" @click="logout">
      Déconnexion
    </v-btn>
  </div>

</template>

<script>
export default {
  name: "HomePage",
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
    }
  }
}
</script>

<style scoped>

</style>