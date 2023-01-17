<template>
  <v-card>
    <v-card-title>
      Kürzlich verwendete Kurse
      <v-spacer />
      <v-btn color="secondary" @click="navigateToCourses()">Alle anzeigen</v-btn>
    </v-card-title>
    <v-card-item v-for="course in courses">
      {{course.name}}
      <v-btn @click="navigateTo(course)"></v-btn>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/plugins/router";

export default defineComponent({
  name: "RecentCoursesCard",
  setup() {
    function navigateToCourses() {
      router.push("/courses")
    }
    return {
      navigateToCourses
    }
  }
})
</script>

<style scoped>

</style>
