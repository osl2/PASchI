<template>
  <v-app-bar elevation="12" class="ml-0 text-blue-grey-lighten-5">
    <template v-slot:prepend>
      <slot v-if="!isMobile" name="prepend">
        <v-app-bar-nav-icon icon="fas fa-arrow-left" @click="router.back()" />
      </slot>
      <slot v-if="isMobile" name="prepend">
        <v-app-bar-nav-icon
          icon="mdi mdi-menu"
          @click="mobileMenu = !mobileMenu"
        />
        <v-menu v-model="mobileMenu">
          <v-list bg-color="indigo" density="compact" class="mt-12 text-white">
            <v-list-item
              prepend-icon="fas fa-arrow-left"
              @click="router.back()"
            >
              <v-list-item-title> Zurück </v-list-item-title>
            </v-list-item>
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
              :active="subRouteOf('EditAccountPage')"
              prepend-icon="fas fa-gear"
              @click="router.push('/edit-account')"
            >
              <v-list-item-title> Benutzereinstellungen </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </slot>
    </template>
    <slot name="default"> </slot>
    <template v-slot:append>
      <slot name="append" />
    </template>
    <template v-if="extended" v-slot:extension>
      <v-card variant="text" width="56px" height="1px" />
      <slot name="extension" />
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import router from "@/plugins/router";
import { defineComponent, inject, ref, Ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "NavigationBar",

  props: {
    extended: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const isMobile: Ref<boolean> = inject("isMobile") as Ref<boolean>;
    const mobileMenu = ref(false);
    function subRouteOf(route: string): boolean {
      return useRoute().matched.some(({ name }) => name === route);
    }
    return {
      mobileMenu,
      isMobile,
      subRouteOf,
      router,
    };
  },
});
</script>

<style scoped></style>
