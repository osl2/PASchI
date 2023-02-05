<template>
  <navigation-bar />
  <v-main>
    <side-menu />
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
export default defineComponent({
  name: "SeatArrangementPage",
  components: { NavigationBar },
  props: {
    seatArrangementId: {
      type: String,
      required: true,
    },
  },
  setup(props) {},
});
</script>

<style scoped></style>
