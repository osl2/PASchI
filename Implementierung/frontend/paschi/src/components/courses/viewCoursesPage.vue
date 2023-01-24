<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="newCourseClick">Kurs erstellen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-list>
      <v-list-item @click="showCourse">
        Klasse 11 Informatik
        <v-btn @click="deleteCourseClick">Kurs löschen</v-btn>
      </v-list-item>
    </v-list>
    <v-list>
      <v-list-item v-for="course in courses" @click="showCourse(course)">
        {{ course.name }} {{ course.subject }}
        <v-btn @click="deleteCourseClick(course)">Kurs löschen</v-btn>
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script lang="ts">
import { StudentController } from "@/controller/StudentController";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Student } from "@/model/userdata/interactions/Student";
import { defineComponent, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import { Course } from "@/model/userdata/courses/Course";

export default defineComponent({
  name: "ViewCoursesPage",
  components: { SideMenu, NavigationBar },

  setup() {
    const courseController = CourseController.getCourseController();
    const courses = ref<Course[]>(courseController.getAllCourses());
    function newCourseClick() {}
    function deleteCourseClick(course: Course) {}

    function showCourse(course: Course) {}
    return {
      newCourseClick,
      deleteCourseClick,
      showCourse,
      courses,
    };
  },
});
</script>

<style scoped></style>
