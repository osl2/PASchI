<template>
  <navigation-bar extended>
    <v-app-bar-title> Kurse ansehen </v-app-bar-title>
    <template v-slot:extension>
      <v-btn
        class="ml-15"
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-plus"
        @click="newCourseClick"
        >Kurs erstellen</v-btn
      >
    </template>
  </navigation-bar>

  <SideMenu />
  <v-main class="ma-0 v-row justify-center align-content-xl-space-around">
    <v-container fluid class="v-col-11" style="max-width: 700px">
      <v-list rounded>
        <v-list-item
          rounded
          v-for="course in courses"
          :key="course.getId"
          @click="showCourse(course)"
        >
          <v-list-item-title>
            {{ course.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ course.subject }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="primary"
              @click="editCourseClick(course)"
              ><v-icon>fas fa-pencil</v-icon></v-btn
            >
            <v-btn
              class="ml-2"
              variant="tonal"
              color="red"
              @click="deleteCourseClick(course)"
              ><v-icon>far fa-trash-can</v-icon></v-btn
            >
          </template>
        </v-list-item>
      </v-list>
    </v-container>
    <v-dialog v-model="enterCourseNameDialog">
      <v-card>
        <v-text-field
          v-model="courseName"
          label="Kursname"
          type="input"
        ></v-text-field>
        <v-text-field
          v-model="courseSubject"
          label="Kursfach"
          type="input"
        ></v-text-field>
        <v-btn @click="abortNewCourseClick">abbrechen</v-btn>
        <v-btn @click="confirmNewCourseClick">bestätigen</v-btn>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { defineComponent, Ref, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import { Course } from "@/model/userdata/courses/Course";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "ViewCoursesPage",
  components: { SideMenu, NavigationBar },

  setup() {
    const router = useRouter();

    const courseController = CourseController.getCourseController();
    const courses: Ref<Course[]> = ref<Course[]>(courseController.getAllCourses()) as Ref<Course[]>;
    const enterCourseNameDialog: Ref<boolean> = ref(false);
    const courseName: Ref<string> = ref("");
    const courseSubject: Ref<string> = ref("");

    function editCourseClick(course: Course) {
      router.push({
        name:"EditCoursePage",
        params: { courseId: course.getId }
      })
    }
    function newCourseClick() {
      courseName.value="";
      courseSubject.value="";
      enterCourseNameDialog.value=true;
    }
    function abortNewCourseClick() {
      enterCourseNameDialog.value=false;
    }
    function confirmNewCourseClick() {
      router.push({
        name: "CourseDetailsPage",
        params: { courseId: courseController.createCourse(courseName.value, courseSubject.value)},
      });
    }
    function deleteCourseClick(course: Course) {
      courseController.deleteCourse(course.getId);
    }

    function showCourse(course: Course) {
      router.push({
        name: "CourseDetailsPage",
        params: { courseId: course.getId },
      });
    }
    return {
      abortNewCourseClick,
      confirmNewCourseClick,
      editCourseClick,
      newCourseClick,
      deleteCourseClick,
      showCourse,
      courses,
      enterCourseNameDialog,
      courseName,
      courseSubject
    };
  },
});
</script>

<style scoped></style>
