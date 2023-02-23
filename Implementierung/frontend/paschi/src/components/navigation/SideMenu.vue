<template>
  <v-navigation-drawer v-if="!isMobile" permanent absolute elevation="10" floating expand-on-hover rail>
    <v-list
      nav
      density="compact"
      active-class="sideMenu-active"
      class="mt-12 text-white"
    >
      <v-list-item
        :active="subRouteOf('Dashboard')"
        prepend-icon="fas fa-gauge"
        @click="router.push('/dashboard')"
      >
        <v-list-item-title> Dashboard </v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="subRouteOf('ViewStudentsPage')"
        prepend-icon="fas fa-users"
        @click="router.push('/view-students')"
      >
        <v-list-item-title> Schüler </v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="subRouteOf('ViewCoursesPage')"
        prepend-icon="fas fa-people-group"
        @click="router.push('/view-courses')"
      >
        <v-list-item-title> Kurse </v-list-item-title>
      </v-list-item>
      <v-list-item
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
          :active="subRouteOf('EditAccountPage')"
          prepend-icon="fas fa-gear"
          @click="router.push('/edit-account')"
        >
          <v-list-item-title> Benutzereinstellungen </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent, inject, Ref} from "vue";
import router from "@/plugins/router";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "SideMenu",
  setup() {
    const isMobile: Ref<boolean> = inject('isMobile') as Ref<boolean>

    /**
     * Methode, die bestimmt, ob die aktuelle Rute eine Unterroute der angegebenen Seite ist.
     *
     * @param route Die Route mit der verglichen werden soll
     */
    function subRouteOf(route: string): boolean {
      return useRoute().matched.some(({ name }) => name === route);
    }

    return {
      router,
      isMobile,
      subRouteOf,
    };
  },
});
</script>

<style scoped></style>
