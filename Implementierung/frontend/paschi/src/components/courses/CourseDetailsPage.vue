<template>
  <navigation-bar>
    <v-app-bar-title> Kursdetails</v-app-bar-title>
    <template v-slot:append>
      <v-btn
        class="ma-2"
        rounded
        variant="tonal"
        @click="showCourseStatisticsClick"
        >Kursstatistiken ansehen</v-btn
      >
      <v-btn
        class="ma-2"
        rounded
        variant="tonal"
        @click="editCourseDetailsClick"
        >Kurs bearbeiten</v-btn
      >
    </template>
  </navigation-bar>
  <side-menu></side-menu>
  <BottomBar />

  <v-main>
    <v-container fluid class="v-row align-start justify-space-around">
      <v-container max-width="800" min-width="570" rounded class="ma-1 v-col-5">
        <NewSessionCard :course-id="courseId" />
        <SessionListCard :course-id="courseId" />
      </v-container>
      <v-container max-width="800" min-width="570" rounded class="ma-1 v-col-5">
        <AddStudentsCard :course-id="courseId" />
      </v-container>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import PDialog from "@/components/base/PDialog.vue";
import AddStudentsCard from "@/components/courses/AddStudentsCard.vue";
import SessionListCard from "@/components/session/SessionListCard.vue";
import NewSessionCard from "@/components/session/NewSessionCard.vue";
import BottomBar from "@/components/navigation/BottomBar.vue";
export default defineComponent({
  name: "CourseDetailsPage",
  components: {
    BottomBar,
    NewSessionCard,
    SessionListCard,
    AddStudentsCard,
    PDialog,
    SideMenu,
    NavigationBar,
  },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    /**
     * Methode zur Anzeige der Kursstatistiken
     */
    function showCourseStatisticsClick() {
      router.push({
        name: "CourseStatisticPage",
        params: { courseId: props.courseId },
      });
    }

    /**
     * Methode zum Bearbeiten eines Kurses.
     */
    function editCourseDetailsClick() {
      router.push({
        name: "EditCoursePage",
        params: { courseId: props.courseId },
      });
    }

    return {
      showCourseStatisticsClick,
      editCourseDetailsClick,
    };
  },
});
</script>

<style scoped></style>
