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
        <v-form @submit.prevent>
          <v-card-item>
            <v-text-field
              name="email"
              prepend-inner-icon="mdi mdi-email-outline"
              class="mt-2"
              variant="outlined"
              label="Mailadresse"
              v-model="email"
            />
            <v-text-field
              name="password"
              prepend-inner-icon="mdi mdi-lock-outline"
              type="password"
              :error="passwordError"
              variant="outlined"
              label="Passwort"
              v-model="password"
            />
          </v-card-item>
          <v-card-item>
            <v-btn
              type="submit"
              block
              height="50"
              variant="flat"
              prepend-icon="fas fa-sign-in-alt"
              color="primary"
              @click="login"
              :loading="loginLoading"
              >Anmelden
            </v-btn>
          </v-card-item>
        </v-form>
        <v-card-text class="text-red" v-if="loginError">
          Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.
        </v-card-text>
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
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import {LOGIN_SUCCESS, UserController} from "@/controller/UserController";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "Login",
  components: { AppBar },
  setup() {
    const userController = UserController.getUserController();

    const email = ref("");
    const password = ref("");
    const passwordError = ref(false);

    const loginError = ref(false);

    const loginLoading = ref(false);

    onMounted(() => {
      userController.loginWithToken(null).then((res) => {
        if (res === LOGIN_SUCCESS) {
          if (userController.getUser().isAdmin()) {
            router.push("/admin");
          } else router.push("/dashboard");
        }
      });
    });

    /**
     * Loggt den Benutzer ein, die eingegebenen Accountdaten korrekt sind.
     */
    function login() {
      loginLoading.value = true;
      userController.login(email.value, password.value).then((res) => {
        if (res === LOGIN_SUCCESS) {
          if (userController.getUser().isAdmin()) {
            router.push("/admin");
          } else router.push("/dashboard");
        } else {
          loginError.value = true;
          loginLoading.value = false;
        }
      });
    }

    return {
      router,
      login,
      email,
      passwordError,
      password,
      loginError,
      loginLoading
    };
  },
});
</script>

<style></style>
