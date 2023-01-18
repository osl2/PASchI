<template>
  <v-main>
    <v-container fluid class="h-100">
      <v-row  class="h-100" align="center" justify="center">
        <v-card class="v-col-11 bg-grey-lighten-3 elevation-6" max-width="500px">
          <v-card-title class="text-center" >
            Bitte registrieren Sie sich.
          </v-card-title>
          <v-card-item>
            <v-text-field class="mt-2" variant="outlined" label="Benutzername" />
            <v-text-field class="mt-2" variant="outlined" label="Mailadresse" />
            <v-text-field type="password" variant="outlined" label="Passwort" />
            <v-text-field type="password" variant="outlined" label="Passwort bestätigen" />
          </v-card-item>
          <v-card-item>
            <v-btn block prepend-icon="fa-sign-in-alt" color="primary" >Registrieren</v-btn>
          </v-card-item>
            <v-card-item>
            <v-btn block prepend-icon="fa-sign-in-alt" color="primary" @click="router.push('Login')" >Schon registriert? Zum Login</v-btn>
          </v-card-item>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">

import {useUserStore} from "@/store/UserStore";
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
export default {
  name: "Register",
  components: {AppBar},
  setup() {
    const userStore = useUserStore()

    return {
      userStore,
      router
    }
  }
}
</script>

<style>

</style>
