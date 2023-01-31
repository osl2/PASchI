<template>
  <navigation-bar/>
  <v-main>
    <side-menu/>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import {defineComponent} from "vue";
export default defineComponent({
  name: "RoomArrangementPage",
  components: { SideMenu, NavigationBar },
  props: {
    roomId: {
      type: String,
      required: true
    }
  },
  setup(props) {

  }
});
</script>

<style scoped></style>
