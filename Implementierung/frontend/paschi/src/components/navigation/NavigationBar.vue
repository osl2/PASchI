<template>
  <v-app-bar elevation="12" class="ml-0 text-blue-grey-lighten-5">
    <template v-slot:prepend>
      <slot name="prepend" />
      <v-app-bar-nav-icon icon="fas fa-arrow-left" @click="router.back()" />
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

<script>
import router from "@/plugins/router";

export default {
  name: "NavigationBar",

  props: {
    extended: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    return {
      router,
    };
  },
};
</script>

<style scoped></style>
