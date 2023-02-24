<template>
  <navigation-bar extended>
    <v-app-bar-title> Kurse ansehen </v-app-bar-title>
    <template v-slot:extension>
      <v-btn
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
      <v-list rounded v-if="courses.length > 0">
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
              v-on:click.stop
              @click="editCourseClick(course)"
              ><v-icon>fas fa-pencil</v-icon></v-btn
            >
          </template>
        </v-list-item>
      </v-list>
      <v-card v-else class="pa-2" variant="text">
        <v-card-title
          class="text-h5 text-center text-indigo-darken-4 text-wrap"
        >
          Es wurden noch keine Kurse erstellt.
        </v-card-title>
        <v-card-item class="justify-center">
          <v-btn
            max-width="450"
            height="50"
            variant="tonal"
            prepend-icon="fas fa-plus"
            color="primary"
            @click="newCourseClick"
            >Kurs erstellen!
          </v-btn>
        </v-card-item>
      </v-card>
    </v-container>
    <v-dialog max-width="700" v-model="enterCourseNameDialog">
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Neuen Kurs erstellen
        </v-card-title>
        <v-form validate-on="submit" @submit.prevent>
          <v-card-item>
            <v-text-field
              class="mt-2"
              v-model="courseName"
              variant="outlined"
              label="Kursname"
              type="input"
              autofocus
            ></v-text-field>
            <v-text-field
              class="mt-1"
              v-model="courseSubject"
              variant="outlined"
              label="Kursfach"
              type="input"
            ></v-text-field>
          </v-card-item>
          <v-card-actions class="row justify-center">
            <v-btn
              height="50"
              width="150"
              variant="tonal"
              @click="abortNewCourseClick"
              >Abbrechen</v-btn
            >
            <v-btn
              type="submit"
              height="50"
              width="150"
              variant="tonal"
              @click="confirmNewCourseClick"
              color="primary"
              >Bestätigen</v-btn
            >
          </v-card-actions>
        </v-form>
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
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ViewCoursesPage",
  components: { SideMenu, NavigationBar },

  setup() {
    const router = useRouter();

    const courseController = CourseController.getCourseController();
    const courses: Ref<Course[]> = ref<Course[]>(
      courseController.getAllCourses()
    ) as Ref<Course[]>;
    const enterCourseNameDialog: Ref<boolean> = ref(false);
    const courseName: Ref<string> = ref("");
    const courseSubject: Ref<string> = ref("");

    /**
     * Methode zum Weiterleiten zur Kursbearbeitungsseite
     *
     * @param course Der zu bearbeitende Kurs
     */
    function editCourseClick(course: Course) {
      router.push({
        name: "EditCoursePage",
        params: { courseId: course.getId },
      });
    }

    /**
     * Methode zum Öffnen eines Dialogs für die Kurserstellung
     */
    function newCourseClick() {
      courseName.value = "";
      courseSubject.value = "";
      enterCourseNameDialog.value = true;
    }

    /**
     * Methode zum Abbruch des Erstellens eines neuen Kurses
     */
    function abortNewCourseClick() {
      enterCourseNameDialog.value = false;
    }

    /**
     * Methode zur Erstellung eines neuen Kurses mit dem vorher bestimmten Namen
     */
    async function confirmNewCourseClick() {
      await router.push({
        name: "CourseDetailsPage",
        params: {
          courseId: await courseController.createCourse(
            courseName.value,
            courseSubject.value
          ),
        },
      });
    }

    /**
     * Methode zum Anzeigen eines Kurses
     *
     * @param course Der anzuzeigende Kurs
     */
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
      showCourse,
      courses,
      enterCourseNameDialog,
      courseName,
      courseSubject,
    };
  },
});
</script>

<style scoped></style>
