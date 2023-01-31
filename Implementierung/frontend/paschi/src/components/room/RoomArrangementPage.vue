<template>
  <navigation-bar></navigation-bar>
  <v-main>
    <side-menu> </side-menu>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import * as string_decoder from "string_decoder";

export default {
  name: "RoomArrangementPage",
  components: { SideMenu, NavigationBar },
  props: {
    roomId: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped></style>
