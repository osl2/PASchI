<template>
  <v-app-bar elevation="0" color="primary-darken-1" class="position-fixed ml-0 text-blue-grey-lighten-5">
    <template v-slot:prepend>
      <slot name="prepend">
        <v-app-bar-nav-icon icon="fas fa-arrow-left" @click="router.back()" />
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

    /**
     * Methode, die bestimmt, ob die aktuelle Rute eine Unterroute der angegebenen Seite ist.
     *
     * @param route Die Route mit der verglichen werden soll
     */
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
