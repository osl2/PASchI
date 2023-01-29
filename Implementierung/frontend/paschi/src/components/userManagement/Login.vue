<template>
  <v-main
    class="ma-0 bg-grey-lighten-3 v-row justify-center align-content-xl-space-around"
    :style="{
      borderTop: 'solid',
      borderWidth: '5px',
      borderTopColor: $vuetify.theme.current.colors.primary,
    }"
  >
    <v-container fluid class="v-col-11" style="max-width: 450px">
      <v-card class="pa-2" variant="text">
        <v-card-title
          class="text-h4 text-center text-indigo-darken-4 text-wrap"
        >
          Willkommen bei PAschI
        </v-card-title>
        <v-card-subtitle
          class="text-xxl-caption text-center text-indigo-darken-3 text-wrap"
        >
          Das Programm zur Aufzeichnung von schülerischen Interaktionen
        </v-card-subtitle>
      </v-card>
      <v-card class="mt-10 pa-2 rounded-lg" variant="flat">
        <v-card-title class="text-center text-grey-darken-3">
          Bitte melden Sie sich an.
        </v-card-title>
        <v-card-item>
          <v-text-field
            prepend-inner-icon="mdi mdi-email-outline"
            class="mt-2"
            variant="outlined"
            label="Mailadresse"
          />
          <v-text-field
            prepend-inner-icon="mdi mdi-lock-outline"
            type="password"
            variant="outlined"
            label="Passwort"
          />
        </v-card-item>
        <v-card-item>
          <v-btn
            block
            height="50"
            variant="flat"
            prepend-icon="fas fa-sign-in-alt"
            color="primary"
            @click="router.push('Dashboard')"
            >Anmelden
          </v-btn>
        </v-card-item>
      </v-card>
      <v-card
        class="mt-8 pa-2 rounded-lg bg-grey-lighten-2"
        variant="flat"
        @click="router.push('Register')"
      >
        <v-card-title
          class="text-sm-button align-content-center text-center text-grey-darken-3 text-wrap"
        >
          Ohne Account? &middot; Registrieren
        </v-card-title>
      </v-card>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore";
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
export default {
  name: "Login",
  components: { AppBar },
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
      router,
    };
  },
};
</script>

<style></style>
