<template>
  <NavigationBar>
    <v-app-bar-title> Datenschutzerklärung </v-app-bar-title>
  </NavigationBar>
  <SideMenu />
  <v-main class="v-row justify-center">
    <v-card class="mt-5 v-col" max-width="1000">
      <v-card-title class="text-h5 text-center text-indigo-darken-4 text-wrap">
        <!--- Hier kommt der Titel hin ---->
      </v-card-title>
      <v-card-text>
        <!--- Hier kommt der Text hin --->
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "DataProtection",
  components: { SideMenu, NavigationBar },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
