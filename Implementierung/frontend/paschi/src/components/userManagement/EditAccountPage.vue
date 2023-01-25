<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="">zurück</v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <SideMenu/>
    <v-container>
      <v-card-title class="ma-2, justify-center"> Benutzerdaten ändern </v-card-title>
      <v-card-item style="max-width: 1000px">
        <v-text-field variant="outlined" label="Vorname"/>
        <v-text-field variant="outlined" label="Nachname"/>
        <v-text-field type="password" variant="outlined" label="Passwort"/>
        <v-text-field type="password" variant="outlined" label="Passwort bestätigen"/>
        <v-btn color="primary" @click="">Speichern</v-btn>
      </v-card-item>
    </v-container>

  </v-main>
</template>

<script lang="ts">

import {useUserStore} from "@/store/UserStore";
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";

export default {
  name: "EditAccountPage",
  components: {SideMenu, NavigationBar, AppBar,},
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
