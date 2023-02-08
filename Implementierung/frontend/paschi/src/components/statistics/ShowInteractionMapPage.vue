<template>
  <navigation-bar />
  <v-main>
    <side-menu />
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
export default defineComponent({
  name: "ShowInteractionMapPage",
  components: { SideMenu, NavigationBar },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {},
});
</script>

<style scoped></style>
