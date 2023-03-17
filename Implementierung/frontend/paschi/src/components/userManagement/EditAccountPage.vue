<template>
  <NavigationBar>
    <template v-slot:default>
      <v-app-bar-title> Benutzerdaten bearbeiten</v-app-bar-title>
    </template>
    <template v-if="!isMobile" v-slot:append>
      <v-btn class="ma-2" variant="tonal" rounded="pill" @click="router.back()"
      >Verwerfen
      </v-btn>
      <v-btn
        class="ma-2"
        variant="flat"
        rounded="pill"
        color="green"
        @click="updateAccount()"
      >Speichern
      </v-btn>
    </template>
    <template v-if="isMobile" v-slot:append>
      <v-btn class="ma-2" variant="tonal" rounded="pill" @click="logOut">
        Abmelden
      </v-btn>
    </template>
  </NavigationBar>
  <v-main class="v-row justify-center">
    <SideMenu/>
    <BottomBar/>
    <v-form class="mt-5 v-col" style="max-width: 1000px">
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
      <v-container align="center">
        <v-btn v-if="isMobile" class="ma-2" variant="tonal" rounded="pill" @click="router.back()"
        >Verwerfen
        </v-btn
        >
        <v-btn
          v-if="isMobile"
          class="ma-2"
          variant="flat"
          rounded="pill"
          color="green"
          @click="updateAccount()"
        >
          Speichern
        </v-btn>
      </v-container>
    </v-form>


    <v-snackbar v-model="errorSnackbar" :timeout="errorSnackbarTimeout">
      {{ errorSnackbarText }}

      <template v-slot:actions>
        <v-btn color="blue" icon="mdi mdi-close" @click="errorSnackbar = false">
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
import {UserController} from "@/controller/UserController";
import {inject, Ref, ref} from "vue";
import BottomBar from "@/components/navigation/BottomBar.vue";

export default {
  name: "EditAccountPage",
  components: {BottomBar, SideMenu, NavigationBar, AppBar},
  setup() {
    const userController = UserController.getUserController();
    const firstName = ref(userController.getUser().firstName);
    const lastName = ref(userController.getUser().lastName);
    const errorSnackbar = ref(false);
    const errorSnackbarText = "Alle Felder müssen ausgefüllt sein.";
    const errorSnackbarTimeout = 2000;
    const isMobile: Ref<boolean> = inject("isMobile") as Ref<boolean>;

    /**
     * Loggt den Benutzer aus und leitet ihn auf die Login-Seite weiter.
     */
    function logOut() {
      userController.logout();
      router.push("/login");
    }

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
          nameMaxLengthRule(firstName.value),
          nameMaxLengthRule(lastName.value),
        ])
      ) {
        userController.update(firstName.value, lastName.value);
        router.push("Dashboard");
      } else if (
        error([
          requiredRule(firstName.value),
          requiredRule(lastName.value),
        ])
      ) {
        errorSnackbar.value = true;
      }
    }

    return {
      firstName,
      lastName,
      errorSnackbar,
      errorSnackbarText,
      errorSnackbarTimeout,
      updateAccount,
      requiredRule,
      nameMaxLengthRule,
      router,
      isMobile,
      logOut,
    };
  },
};
</script>

<style></style>
