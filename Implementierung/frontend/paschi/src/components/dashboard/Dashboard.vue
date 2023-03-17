<template>
  <NavigationBar>
    <template #default>
      <v-app-bar-title>
       Dashboard
      </v-app-bar-title>
    </template>
  </NavigationBar>

  <v-main>
    <SideMenu />
    <ButtomBar />
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
import { defineComponent } from "vue";
import ButtomBar from "@/components/navigation/ButtomBar.vue";

export default defineComponent( {
  name: "Dashboard",
  components: {
    ButtomBar,
    SideMenu,
    RecentSessionsCard,
    NavigationBar,
    RecentCoursesCard,
  },
  setup() {
    const userController = UserController.getUserController();
    const firstName = userController.getUser()?.firstName;
    const lastName = userController.getUser()?.lastName;

    return {
      firstName,
      lastName,
    };
  },
});
</script>

<style scoped></style>
