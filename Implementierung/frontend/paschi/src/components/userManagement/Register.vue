<template>
  <v-main
    class="ma-0 v-row justify-center align-content-xl-space-around"
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
          Gleich geschafft!
        </v-card-title>
        <v-card-subtitle
          class="text-xxl-caption text-center text-indigo-darken-3 text-wrap"
        >
          Registrieren Sie sich jetzt und nutzen Sie PAschI im vollen Umfang.
        </v-card-subtitle>
      </v-card>
      <v-card class="pa-2 rounded-lg" variant="flat" max-width="450px">
        <v-card-item>
          <v-text-field class="mt-2" variant="outlined" label="Vorname" />
          <v-text-field variant="outlined" label="Nachname" />
          <v-text-field
            prepend-inner-icon="mdi mdi-email-outline"
            variant="outlined"
            label="Mailadresse"
          />
          <v-text-field
            prepend-inner-icon="mdi mdi-lock-outline"
            type="password"
            variant="outlined"
            label="Passwort"
          />
          <v-text-field
            prepend-inner-icon="mdi mdi-lock-outline"
            type="password"
            variant="outlined"
            label="Passwort bestätigen"
          />
        </v-card-item>
        <v-card-item>
          <v-btn
            block
            height="50"
            variant="flat"
            prepend-icon="fas fa-sign-in-alt"
            color="primary"
            >Registrieren</v-btn
          >
        </v-card-item>
      </v-card>
      <v-card
        class="mt-8 pa-2 rounded-lg bg-grey-lighten-2"
        variant="flat"
        @click="router.push('Login')"
      >
        <v-card-title
          class="text-sm-button align-content-center text-center text-grey-darken-3 text-wrap"
        >
          Schon registriert? &middot; Zum Login
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
  name: "Register",
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
