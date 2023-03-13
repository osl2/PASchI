<template>
  <v-navigation-drawer v-if="!isMobile" permanent absolute elevation="10" floating expand-on-hover rail>
    <v-list
      nav
      density="compact"
      active-class="sideMenu-active"
      class="mt-12 text-white"
    >
      <v-list-item
        name="dashboard"
        :active="subRouteOf('Dashboard')"
        prepend-icon="fas fa-gauge"
        @click="router.push('/dashboard')"
      >
        <v-list-item-title> Dashboard </v-list-item-title>
      </v-list-item>
      <v-list-item
        name="viewStudents"
        :active="subRouteOf('ViewStudentsPage')"
        prepend-icon="fas fa-users"
        @click="router.push('/view-students')"
      >
        <v-list-item-title> Schüler </v-list-item-title>
      </v-list-item>
      <v-list-item
        name="viewCourses"
        :active="subRouteOf('ViewCoursesPage')"
        prepend-icon="fas fa-people-group"
        @click="router.push('/view-courses')"
      >
        <v-list-item-title> Kurse </v-list-item-title>
      </v-list-item>
      <v-list-item
        name="viewRooms"
        :active="subRouteOf('ViewRoomsPage')"
        prepend-icon="fas fa-door-closed"
        @click="router.push('/view-rooms')"
      >
        <v-list-item-title> Räume </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list
        nav
        density="compact"
        active-class="sideMenu-active"
        class="text-white"
      >
        <v-list-item
          name="editAccount"
          :active="subRouteOf('EditAccountPage')"
          prepend-icon="fas fa-gear"
          @click="router.push('/edit-account')"
        >
          <v-list-item-title> Benutzereinstellungen </v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="fa-solid fa-arrow-right-from-bracket"
          title="Abmelden"
          @click="logOut">
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent, inject, Ref} from "vue";
import router from "@/plugins/router";
import { useRoute } from "vue-router";
import {UserController} from "@/controller/UserController";

export default defineComponent({
  name: "SideMenu",



  setup() {
    const isMobile: Ref<boolean> = inject('isMobile') as Ref<boolean>;
    const userController = UserController.getUserController();


    /**
     * Methode, die bestimmt, ob die aktuelle Rute eine Unterroute der angegebenen Seite ist.
     *
     * @param route Die Route mit der verglichen werden soll
     */
    function subRouteOf(route: string): boolean {
      return useRoute().matched.some(({ name }) => name === route);
    }

    function logOut() {
      userController.logout();
      router.push("/login");
    }

    return {
      router,
      isMobile,
      subRouteOf,
      logOut,
    };
  },
});
</script>

<style scoped></style>
