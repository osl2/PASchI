<template>
  <navigation-bar extended>
    <v-app-bar-title>
      Kurse ansehen
    </v-app-bar-title>
    <template v-slot:extension>
      <v-btn class="ml-15" variant="flat" color="green" rounded @click="newCourseClick">Kurs erstellen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-container fluid>
      <v-list max-width="500px">
        <v-list-item
          rounded
          v-for="course in courses"
          @click="showCourse(course)"
        >
          <v-list-item-title>
            {{ course.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ course.subject }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn class="ml-2" variant="tonal" color="primary" @click="editCourseClick(course)"><v-icon>fas fa-pencil</v-icon></v-btn>
            <v-btn class="ml-2" variant="tonal" color="red" @click="deleteCourseClick(course)"><v-icon>fas fa-trash</v-icon></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { defineComponent, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import { Course } from "@/model/userdata/courses/Course";
import { User } from "@/model/User";
import { Role } from "@/model/Role";

export default defineComponent({
  name: "ViewCoursesPage",
  components: { SideMenu, NavigationBar },

  setup() {
    const courseController = CourseController.getCourseController();
    //const courses = ref<Course[]>(courseController.getAllCourses());

    const courses = ref<Course[]>([
      new Course(
        "asdf",
        new User(1, "", "", "", true, Role.USER, ""),
        "Physik 11",
        "Physik"
      ),
      new Course(
        "asdf",
        new User(1, "", "", "", true, Role.USER, ""),
        "Physik 12",
        "Physik"
      ),
      new Course(
        "asdf",
        new User(1, "", "", "", true, Role.USER, ""),
        "Informatik 11",
        "Informatik"
      ),
      new Course(
        "asdf",
        new User(1, "", "", "", true, Role.USER, ""),
        "Informatik 12",
        "Informatik"
      ),
    ]);
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
