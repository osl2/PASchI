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
  <side-menu />
  <v-main>
    <v-container fluid class="v-row align-start justify-space-around">
      <v-card max-width="800" min-width="570" rounded class="ma-1 v-col-5">
        <v-row class="v-col-12">
          <h2 class="ma-2">Sitzungsliste</h2>
          <v-spacer />
          <v-btn
            min-width="228"
            class="ml-15 ma-2"
            variant="flat"
            color="green"
            rounded
            prepend-icon="mdi mdi-plus"
            @click="addSessionClick"
            >Sitzung starten</v-btn
          >
          <v-icon
            v-if="sessionListCollapsed"
            icon="mdi mdi-arrow-up-drop-circle"
            size="40"
            @click="toggleSessionListCollapsed"
            class="ma-2"
            color="primary"
          />
          <v-icon
            v-if="!sessionListCollapsed"
            icon="mdi mdi-arrow-down-drop-circle"
            size="40"
            @click="toggleSessionListCollapsed"
            class="ma-2"
            color="primary"
          />
        </v-row>
        <v-row class="v-card justify-center" v-if="!sessionListCollapsed">
          <v-card class="v-col-12" max-height="1000">
            <v-list max-height="500">
              <v-row class="ma-2" v-for="session in sessions"
                >{{ session.name }} {{ session.date }}
                <v-spacer />
                <v-btn
                  variant="tonal"
                  color="primary"
                  @click="interactionMapClick(session)"
                  >
                  <v-icon>mdi mdi-map</v-icon>
                </v-btn>
                <v-btn
                  class="ml-2"
                  variant="tonal"
                  color="primary"
                  @click="sessionStatisticClick(session)"
                >
                  <v-icon> fas fa-chart-line </v-icon>
                </v-btn>
                <v-btn
                  class="ml-2"
                  variant="tonal"
                  color="red"
                  @click="deleteSessionClick(session)"
                >
                  <v-icon>mdi mdi-minus</v-icon>
                </v-btn>
              </v-row>
            </v-list>
          </v-card>
        </v-row>
      </v-card>
      <v-card max-width="800" min-width="570" rounded class="ma-1 v-col-5">
        <v-row class="v-col-12">
          <h2 class="ma-2">Schülerliste</h2>
          <v-spacer/>
          <v-btn
            name="addStudent"
            class="ml-15 ma-2"
            variant="flat"
            color="green"
            rounded
            prepend-icon="mdi mdi-plus"
            min-width="228"
            @click="activateStudentCard"
          >Schüler hinzufügen
          </v-btn
          >
          <v-icon
            v-if="studentListCollapsed"
            icon="mdi mdi-arrow-up-drop-circle"
            size="40"
            @click="toggleStudentListCollapsed"
            class="ma-2"
            color="primary"
          />
          <v-icon
            v-if="!studentListCollapsed"
            icon="mdi mdi-arrow-down-drop-circle"
            size="40"
            @click="toggleStudentListCollapsed"
            class="ma-2"
            color="primary"
          />
        </v-row>
        <v-row class="v-card justify-center" v-if="!studentListCollapsed">
          <v-card class="v-col-12" max-height="1000">
            <v-list max-height="500">
              <v-row class="ma-2" v-for="student in studentsInCourse"
              >{{ student.firstName }} {{ student.lastName }}
                <v-spacer/>
                <v-btn
                  variant="tonal"
                  color="primary"
                  @click="editStudentClick(student)"
                >
                  <v-icon>fas fa-pencil</v-icon>
                </v-btn
                >
                <v-btn
                  class="ml-2"
                  variant="tonal"
                  color="primary"
                  @click="studentStatisticClick(student)"
                >
                  <v-icon> fas fa-chart-line</v-icon>
                </v-btn>
                <v-btn
                  class="ml-2"
                  variant="tonal"
                  color="red"
                  @click="removeStudentFromCourse(student)"
                >
                  <v-icon>mdi mdi-minus</v-icon>
                </v-btn>
              </v-row>
            </v-list>
          </v-card>
        </v-row>
      </v-card>
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
export default defineComponent({
  name: "CourseDetailsPage",
  components: {
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
