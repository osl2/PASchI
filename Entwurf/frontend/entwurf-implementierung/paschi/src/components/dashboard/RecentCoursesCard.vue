<template>
  <v-list>
    <v-list-item v-for="course, key in courses">
      <v-list-item-title>{{course.name}}</v-list-item-title>
      <v-btn @click="navigateTo(course)"></v-btn>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "RecentCoursesCard"
}
</script>

<style scoped>

</style>
