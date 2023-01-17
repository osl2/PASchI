<template>
  <navigation-bar>
    <template v-slot:extension>
      <v-btn>speichern</v-btn>
    </template>
  </navigation-bar>

</template>

<script>
import NavigationBar from "@/components/navigation/NavigationBar.vue";

export default {
  name: "editStudentPage.vue",
  components: {NavigationBar}
}
</script>

<style scoped>

</style>
