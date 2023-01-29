<template>
  <navigation-bar></navigation-bar>
  <v-main>
    <side-menu></side-menu>
    <v-btn @click="addSessionClick">Sitzung starten</v-btn>
    <v-btn @click="editCourseDetailsClick">Kurs bearbeiten</v-btn>
    <v-btn @click="showCourseStatisticsClick">Kursstatistiken ansehen</v-btn>
    <v-btn @click="activateStudentCard">Schüler hinzufügen</v-btn>
    <v-btn @click="activateSessionStatisticsSelection"
      >Sitzungsstatistiken ansehen</v-btn
    >
    <v-btn @click="activateInteractionMapSelection"
      >Interaktionskarte ansehen</v-btn
    >
    <v-list>
      <v-list-item v-for="student in studentsInCourse"
        >{{ student.firstName }} {{ student.lastName }}
        <v-btn @click="studentStatisticClick(student)"
          >Statistiken anzeigen</v-btn
        >
        <v-btn @click="deleteStudentClick(student)">Schüler entfernen</v-btn>
      </v-list-item>
    </v-list>
    <v-dialog v-model="sessionStatisticDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="session in sessions"></v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="interactionMapSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="session in sessions">
            {{ session.date }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addStudentSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="student in studentsNotInCourse">
            {{ student.firstName }} {{ student.lastName }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="seatArrangementSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="seatArrangement in seatArrangements">
            {{ seatArrangement.name }} {{ seatArrangement.room.name }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import { Session } from "@/model/userdata/courses/Session";
import { Student } from "@/model/userdata/interactions/Student";
import { defineComponent, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import router from "@/plugins/router";

export default defineComponent({
  name: "CourseDetailsPage",
  components: { SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const courseController = CourseController.getCourseController();

    const sessionStatisticDialog = ref<boolean>(false);
    const interactionMapSelectionDialog = ref<boolean>(false);
    const addStudentSelectionDialog = ref<boolean>(false);
    const seatArrangementSelectionDialog = ref<boolean>(false);

    const sessions = ref<Session[]>(
      courseController.getSessions(props.courseId)
    );
    const studentsNotInCourse = ref<Student[]>(
      courseController.getStudents(props.courseId)
    ); //Ersetzen, wenn Controller fertig!!! courseController.getStudentsNotInCourse(courseid);
    const studentsInCourse = ref<Student[]>(
      courseController.getStudents(props.courseId)
    );
    const seatArrangements = ref<SeatArrangement[]>(
      courseController.getSeatArrangements(props.courseId)
    );

    function showCourseStatisticsClick() {
      router.push({name: 'editCoursePage', params: {courseId: props.courseId}});
    }
    function editCourseDetailsClick() {

    }
    function editStudentClick(student: Student) {}
    function deleteStudentClick(student: Student) {}
    function activateInteractionMapSelection() {
      interactionMapSelectionDialog.value=true;
    }
    function activateSessionStatisticsSelection() {
      sessionStatisticDialog.value=true;
    }
    function navigateToSessionStatistic(session: Session) {}
    function navigateToInteractionMap(session: Session) {}
    function addStudent(student: Student) {}
    function activateStudentCard() {
      addStudentSelectionDialog.value=true;
    }
    function addSessionClick() {
      seatArrangementSelectionDialog.value=true;
    }
    function startSessionClick(seatArrangement: SeatArrangement) {}
    function studentStatisticClick(student: Student) {}

    return {
      showCourseStatisticsClick,
      editCourseDetailsClick,
      editStudentClick,
      deleteStudentClick,
      activateInteractionMapSelection,
      activateSessionStatisticsSelection,
      navigateToSessionStatistic,
      navigateToInteractionMap,
      addStudent,
      activateStudentCard,
      addSessionClick,
      startSessionClick,
      studentStatisticClick,

      sessionStatisticDialog,
      interactionMapSelectionDialog,
      addStudentSelectionDialog,
      seatArrangementSelectionDialog,
      studentsNotInCourse,
      studentsInCourse,
      sessions,
      seatArrangements,
    };
  },
});
</script>

<style scoped></style>
