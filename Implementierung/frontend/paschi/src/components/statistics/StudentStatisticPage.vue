<template>
  <navigation-bar></navigation-bar>
  <v-main>
    <side-menu> </side-menu>
  </v-main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({  name: "StudentStatisticPage",
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {

  }
});
</script>

<style scoped>

</style>
