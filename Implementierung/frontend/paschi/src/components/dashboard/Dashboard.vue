<template>
  <NavigationBar>
    <template #default>
      <v-app-bar-title>
        Willkommen zurück, {{ firstName }}
        {{ lastName }}
      </v-app-bar-title>
    </template>
    <template #append>
      <v-btn variant="tonal" @click="logOut" color="white" rounded="pill">
        Abmelden
      </v-btn>
    </template>
  </NavigationBar>

  <v-main>
    <SideMenu />
    <v-container fluid>
      <v-row justify="space-around" align-content="stretch">
        <v-col>
          <RecentCoursesCard class="ma-3" />
        </v-col>
        <v-col>
          <RecentSessionsCard class="ma-3" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import RecentCoursesCard from "@/components/dashboard/RecentCoursesCard.vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import RecentSessionsCard from "@/components/dashboard/RecentSessionsCard.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { UserController } from "@/controller/UserController";
import router from "@/plugins/router";
import { defineComponent } from "vue";

export default defineComponent( {
  name: "Dashboard",
  components: {
    SideMenu,
    RecentSessionsCard,
    NavigationBar,
    RecentCoursesCard,
  },
  setup() {
    const userController = UserController.getUserController();
    const firstName = userController.getUser()?.firstName;
    const lastName = userController.getUser()?.lastName;

    function logOut() {
      router.push("login");
    }
    return {
      firstName,
      lastName,
      logOut,
    };
  },
});
</script>

<style scoped></style>
