<template>
  <NavigationBar extended>
    <template v-slot:default>
      <v-app-bar-title> Benutzerdaten bearbeiten </v-app-bar-title>
    </template>
    <template v-slot:extension>
      <v-btn
        class="ml-15 ma-2"
        variant="tonal"
        rounded="pill"
        @click="router.back()"
        >Verwerfen</v-btn
      >
      <v-btn class="ma-2" variant="flat" rounded="pill" color="green" @click=""
        >Speichern</v-btn
      >
    </template>
  </NavigationBar>
  <v-main>
    <SideMenu />
    <v-container>
      <v-form class="mt-5" style="max-width: 1000px">
        <v-text-field variant="outlined" label="Vorname" />
        <v-text-field variant="outlined" label="Nachname" />
        <v-text-field type="password" variant="outlined" label="Passwort" />
        <v-text-field
          type="password"
          variant="outlined"
          label="Passwort bestätigen"
        />
      </v-form>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";

export default {
  name: "EditAccountPage",
  components: { SideMenu, NavigationBar, AppBar },
  setup() {

    return {
      router,
    };
  },
};
</script>

<style></style>
