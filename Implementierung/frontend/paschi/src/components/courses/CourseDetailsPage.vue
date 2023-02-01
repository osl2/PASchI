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
          <v-list-item
            v-for="session in sessions"
            @click="navigateToSessionStatistic(session)"
            >{{ session.date }}</v-list-item
          >
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="interactionMapSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item
            v-for="session in sessions"
            @click="navigateToInteractionMap(session)"
          >
            {{ session.date }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addStudentSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item
            v-for="student in studentsNotInCourse"
            @click="addStudent(student)"
          >
            {{ student.firstName }} {{ student.lastName }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="seatArrangementSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item
            v-for="seatArrangement in seatArrangements"
            @click="startSessionClick(seatArrangement)"
          >
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
import { computed, defineComponent, Ref, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import router from "@/plugins/router";
import { SessionController } from "@/controller/SessionController";

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
    const courseController: CourseController =
      CourseController.getCourseController();
    const sessionController: SessionController =
      SessionController.getSessionController();

    const sessionStatisticDialog: Ref<boolean> = ref<boolean>(false);
    const interactionMapSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const addStudentSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const seatArrangementSelectionDialog: Ref<boolean> = ref<boolean>(false);

    const sessions: Ref<Session[]> = ref<Session[]>(getSessions()) as Ref<
      Session[]
    >;

    const studentsNotInCourse = computed(
      () => getStudentsNotInCourse()
    );

    const studentsInCourse: Ref<Student[]> = ref<Student[]>(
      getStudentsOfCourse()
    ) as Ref<Student[]>;
    const seatArrangements: Ref<SeatArrangement[]> = ref<SeatArrangement[]>(
      getSeatArrangements()
    ) as Ref<SeatArrangement[]>;

    //Hilfsmethoden
    function getSessions(): Session[] {
      let sessions: undefined | Session[] = courseController.getSessions(
        props.courseId
      );
      if (sessions instanceof Array) {
        return sessions as Session[];
      }
      return [];
    }
    function getStudentsOfCourse(): Student[] {
      let students: undefined | Student[] =
        courseController.getStudentsOfCourse(props.courseId);
      if (students instanceof Array) {
        return students as Student[];
      }
      return [];
    }
    function getStudentsNotInCourse(): Student[] {
      let students: undefined | Student[] =
        courseController.getStudentsNotInCourse(props.courseId);
      if (students instanceof Array) {
        return students as Student[];
      }
      return [];
    }
    function getSeatArrangements(): SeatArrangement[] {
      let seatArrangements: undefined | SeatArrangement[] =
        courseController.getSeatArrangements(props.courseId);
      if (seatArrangements instanceof Array) {
        return seatArrangements as SeatArrangement[];
      }
      return [];
    }

    //normale Methoden
    function showCourseStatisticsClick() {
      router.push({
        name: "CourseStatisticPage",
        params: { courseId: props.courseId },
      });
    }
    function editCourseDetailsClick() {
      router.push({
        name: "EditCoursePage",
        params: { courseId: props.courseId },
      });
    }
    function editStudentClick(student: Student) {
      router.push({
        name: "EditStudentPage",
        params: { studentId: student.getId },
      });
    }
    function deleteStudentClick(student: Student) {
      courseController.removeStudentFromCourse(props.courseId, student.getId);
    }
    function activateInteractionMapSelection() {
      interactionMapSelectionDialog.value = true;
    }
    function activateSessionStatisticsSelection() {
      sessionStatisticDialog.value = true;
    }
    function navigateToSessionStatistic(session: Session) {
      router.push({
        name: "SessionStatisticPage",
        params: { sessionId: session.getId },
      });
    }
    function navigateToInteractionMap(session: Session) {
      router.push({
        name: "ShowInteractionMapPage",
        params: { sessionId: session.getId },
      });
    }
    function addStudent(student: Student) {
      courseController.addStudentToCourse(props.courseId, student.getId);
    }
    function activateStudentCard() {
      addStudentSelectionDialog.value = true;
    }
    function addSessionClick() {
      seatArrangementSelectionDialog.value = true;
    }
    function startSessionClick(seatArrangement: SeatArrangement) {
      router.push({
        name: "SessionPage",
        params: { sessionId: sessionController.createSession(props.courseId, seatArrangement.getId, "")} //TODO session name
      })
    }
    function studentStatisticClick(student: Student) {
      router.push({
        name: "StudentStatisticPage",
        params: { studentId: student.getId },
      });
    }

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
