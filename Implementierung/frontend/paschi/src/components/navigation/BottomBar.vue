<template>
  <v-bottom-navigation style="position: fixed" active bg-color="primary" v-if="isMobile">
    <v-btn value="dashboard" :active="subRouteOf('Dashboard')"
           prepend-icon="fas fa-gauge"
           @click="router.push('/dashboard')">
      Dashboard
    </v-btn>

    <v-btn value="viewStudents"
           :active="subRouteOf('ViewStudentsPage')"
           prepend-icon="fas fa-users"
           @click="router.push('/view-students')">
      Schüler
    </v-btn>

    <v-btn value="viewCourses"
           :active="subRouteOf('ViewCoursesPage')"
           prepend-icon="fas fa-people-group"
           @click="router.push('/view-courses')"
    >
      Kurse
    </v-btn>
    <v-btn value="editAccount"
           :active="subRouteOf('EditAccountPage')"
           prepend-icon="fas fa-gear"
           @click="router.push('/edit-account')"
    >
      Einstellungen
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import {defineComponent, inject, Ref} from "vue";
import router from "@/plugins/router";
import { useRoute } from "vue-router";
import {UserController} from "@/controller/UserController";

export default defineComponent({
  name: "BottomBar",



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
