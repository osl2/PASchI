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
          <form>
            <v-text-field
              v-model="firstName"
              class="mt-2"
              variant="outlined"
              label="Vorname"
              :rules="[requiredRule, nameMaxLengthRule]"
            />
            <v-text-field
              v-model="lastName"
              variant="outlined"
              label="Nachname"
              :rules="[requiredRule, nameMaxLengthRule]"
            />
            <v-text-field
              v-model="mail"
              prepend-inner-icon="mdi mdi-email-outline"
              variant="outlined"
              label="Mailadresse"
              :rules="[requiredRule, emailRule]"
            />
            <v-text-field
              v-model="password"
              prepend-inner-icon="mdi mdi-lock-outline"
              type="Password"
              variant="outlined"
              label="Passwort"
              :rules="[
                requiredRule,
                passwordMinLengthRule,
                passwordMaxLengthRule,
              ]"
            />
            <v-text-field
              v-model="passwordRepeat"
              prepend-inner-icon="mdi mdi-lock-outline"
              type="Password"
              variant="outlined"
              label="Passwort bestätigen"
              :rules="[requiredRule, passwordsEqualRule]"
            />
          </form>
        </v-card-item>
        <v-card-item>
          <v-btn
            block
            height="50"
            variant="flat"
            prepend-icon="fas fa-sign-in-alt"
            color="primary"
            @click="register()"
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
    </v-container>#
    <v-snackbar
      v-model="errorSnackbar"
      :timeout="errorSnackbarTimeout"
    >
      {{ errorSnackbarText }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          icon="mdi mdi-close"
          @click="errorSnackbar = false"
        >
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script lang="ts">
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import { ref } from "vue";
import { UserController } from "@/controller/UserController";
export default {
  name: "Register",
  components: { AppBar },

  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const mail = ref("");
    const password = ref("");
    const passwordRepeat = ref("");
    const userController = UserController.getUserController();
    const errorSnackbar = ref(false);
    const errorSnackbarText = 'Alle Felder müssen ausgefüllt sein.';
    const errorSnackbarTimeout = 2000;
    function requiredRule(value: string) {
      if (value === "") {
        return "Dieses Feld muss ausgefüllt sein.";
      }
      return true;
    }
    function emailRule() {
      if (!mail.value.match("(.+)@(.+)\\.(.+)") || mail.value.length > 254) {
        return "Keine gültige Email Adresse.";
      }
      return true;
    }
    function passwordMinLengthRule() {
      if (password.value.length < 8) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein.";
      }
      return true;
    }
    function passwordMaxLengthRule() {
      if (password.value.length > 32) {
        return "Das Passwort muss höchstens 32 Zeichen lang sein.";
      }
      return true;
    }
    function passwordsEqualRule() {
      if (password.value !== passwordRepeat.value) {
        return "Passwörter müssen gleich sein.";
      }
      return true;
    }
    function nameMaxLengthRule(value: string) {
      if (value.length > 20) {
        return "Namen müssen kürzer als 20 Zeichen sein";
      }
      return true;
    }
    function error(ruleReturns: (boolean | string)[]): boolean {
      for (let i = 0; i < ruleReturns.length; i++) {
        if (typeof ruleReturns[i] === "string" || !ruleReturns[i]) {
          return true;
        }
      }
      return false;
    }
    function register() {
      if (
        !error([
          requiredRule(firstName.value),
          requiredRule(lastName.value),
          requiredRule(mail.value),
          requiredRule(password.value),
          requiredRule(passwordRepeat.value),
          emailRule(),
          nameMaxLengthRule(firstName.value),
          nameMaxLengthRule(lastName.value),
          passwordMinLengthRule(),
          passwordMaxLengthRule(),
          passwordsEqualRule(),
        ])
      ) {
        userController.register(
          firstName.value,
          lastName.value,
          mail.value,
          password.value,
          passwordRepeat.value
        );
        router.push("login");
      }
      else if (
        error([
          requiredRule(firstName.value),
          requiredRule(lastName.value),
          requiredRule(mail.value),
          requiredRule(password.value),
          requiredRule(passwordRepeat.value)
        ])
      ) {
        errorSnackbar.value = true
      }
    }

    return {
      firstName,
      lastName,
      mail,
      password,
      passwordRepeat,
      errorSnackbar,
      errorSnackbarText,
      errorSnackbarTimeout,
      register,
      emailRule,
      requiredRule,
      passwordMinLengthRule,
      passwordMaxLengthRule,
      passwordsEqualRule,
      nameMaxLengthRule,
      router,
    };
  },
};
</script>

<style></style>
