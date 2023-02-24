<template>
  <v-card color="primary-lighten-1">
    <v-card-title>
      <v-row class="ma-2">
        Kürzlich verwendete Kurse
        <v-spacer />
        <v-btn variant="tonal" color="white" @click="navigateToCourses()"
          >Alle anzeigen</v-btn
        >
      </v-row>
    </v-card-title>
    <v-card-item @click="navigateToCourse(course)" v-for="course in courses">
      <v-row class="ma-2">
        {{ course.name }}
        <v-spacer />
        <v-btn
          class="ml-2"
          variant="tonal"
          color="primary"
          @click="navigateToStatistic(course)"
        >
          <v-icon> fas fa-chart-line </v-icon>
        </v-btn>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/plugins/router";
import { Course } from "@/model/userdata/courses/Course";
import { CourseController } from "@/controller/CourseController";

export default defineComponent({
  name: "RecentCoursesCard",
  setup() {
    const courseController = CourseController.getCourseController();
    const courses: Course[] = courseController.getRecentCourses();

    /**
     * Methode, die zur Kursübersichtsseite Leitet
     */
    function navigateToCourses() {
      router.push({ name: "ViewCoursesPage" });
    }

    /**
     * Methode, die zur Kursdetailansicht leitet
     *
     * @param course Der Kurs der angezeigt wird
     */
    function navigateToCourse(course: Course) {
      router.push({
        name: "CourseDetailsPage",
        params: { courseId: course.getId },
      });
    }

    /**
     * Methode, die zur Kursstatistikseite leitet
     *
     * @param course Der Kurs der Statistik
     */
    function navigateToStatistic(course: Course) {
      router.push({
        name: "CourseStatisticPage",
        params: { courseId: course.getId },
      });
    }
    return {
      courses,
      navigateToCourses,
      navigateToStatistic,
      navigateToCourse,
    };
  },
});
</script>

<style scoped></style>
