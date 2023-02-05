<template>
  <navigation-bar />
  <v-main>
    <side-menu />
  </v-main>
</template>

<script lang="ts">
import { CourseController } from "@/controller/CourseController";
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
export default defineComponent({
  name: "CourseStatisticPage",
  components: { SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {},
});
</script>

<style scoped></style>
