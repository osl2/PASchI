<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
        Kürzlich verwendete Kurse
        <v-spacer />
        <v-btn color="secondary" @click="navigateToCourses()" class="white" >Alle anzeigen</v-btn>
      </v-row>
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
