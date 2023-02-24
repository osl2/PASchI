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
      <v-btn class="ma-2" variant="flat" rounded="pill" color="green" @click="updateAccount()"
        >Speichern</v-btn
      >
    </template>
  </NavigationBar>
  <v-main>
    <SideMenu />
    <v-container>
      <v-form class="mt-5" style="max-width: 1000px">
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
      </v-form>
    </v-container>
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
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { UserController } from "@/controller/UserController";
import { ref } from "vue";

export default {
  name: "EditAccountPage",
  components: { SideMenu, NavigationBar, AppBar },
  setup() {
    const userController = UserController.getUserController();
    const firstName = ref("");
    const lastName = ref("");
    const password = ref("");
    const passwordRepeat = ref("");
    const errorSnackbar = ref(false);
    const errorSnackbarText = 'Alle Felder müssen ausgefüllt sein.';
    const errorSnackbarTimeout = 2000;

    /**
     * Gibt Fehlermeldung zurück, falls der übergebene Wert leer ist, sonst true.
     *
     * @param value Der Wert, der überprüft wird.
     */
    function requiredRule(value: string) {
      if (value === "") {
        return "Dieses Feld muss ausgefüllt sein.";
      }
      return true;
    }

    /**
     * Gibt Fehlermeldung zurück, falls das Passwort kürzer als 8 ist, sonst true.
     */
    function passwordMinLengthRule() {
      if (password.value.length < 8) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein.";
      }
      return true;
    }

    /**
     * Gibt Fehlermeldung zurück, falls das Passwort länger als 32 ist, sonst true.
     */
    function passwordMaxLengthRule() {
      if (password.value.length > 32) {
        return "Das Passwort muss höchstens 32 Zeichen lang sein.";
      }
      return true;
    }

    /**
     * Gibt Fehlermeldung zurück, falls die Passwörter nicht übereinstimmen, sonst true.
     */
    function passwordsEqualRule() {
      if (password.value !== passwordRepeat.value) {
        return "Passwörter müssen gleich sein.";
      }
      return true;
    }

    /**
     * Gibt Fehlermeldung zurück, falls der übergebene Wert länger als 20 ist, sonst true.
     */
    function nameMaxLengthRule(value: string) {
      if (value.length > 20) {
        return "Namen müssen kürzer als 20 Zeichen sein";
      }
      return true;
    }

    /**
     * Gibt zurück, ob eine der Regeln eine Fehlermeldung zurückgibt.
     *
     * @param ruleReturns Array mit Regeln.
     */
    function error(ruleReturns: (boolean | string)[]): boolean {
      for (let i = 0; i < ruleReturns.length; i++) {
        if (typeof ruleReturns[i] === "string" || !ruleReturns[i]) {
          return true;
        }
      }
      return false;
    }

    /**
     * Falls kein Fehler auftritt, wird der Account mit den zuvor bestimmten Werten aktualisiert. Wenn eines der Felder leer ist, wird ein Fehlerhinweis aktiviert.
     */
    function updateAccount() {
      if (
        !error([
          requiredRule(firstName.value),
          requiredRule(lastName.value),
          requiredRule(password.value),
          requiredRule(passwordRepeat.value),
          nameMaxLengthRule(firstName.value),
          nameMaxLengthRule(lastName.value),
          passwordMinLengthRule(),
          passwordMaxLengthRule(),
          passwordsEqualRule(),
        ])
      ) {
        userController.update(firstName.value, lastName.value, userController.getUser().email, password.value);
        router.push("Dashboard")
      }
      else if (
        error([
          requiredRule(firstName.value),
          requiredRule(lastName.value),
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
      password,
      passwordRepeat,
      errorSnackbar,
      errorSnackbarText,
      errorSnackbarTimeout,
      updateAccount,
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
