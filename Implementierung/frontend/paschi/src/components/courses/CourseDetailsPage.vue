<template>
  <navigation-bar></navigation-bar>
  <side-menu></side-menu>
  <v-main>
    <v-container fluid class="v-row justify-center">
      <v-card min-width="640" rounded class="ma-3 v-col-auto">
        <v-row justify="space-around">
          <v-btn class="ma-2 v-col-11" @click="addSessionClick"
            >Sitzung starten</v-btn
          >
        </v-row>
        <v-row justify="space-around">
          <v-btn class="ma-2 v-col-11" @click="editCourseDetailsClick"
            >Kurs bearbeiten</v-btn
          >
        </v-row>
        <v-row justify="space-around">
          <v-btn class="ma-2 v-col-11" @click="showCourseStatisticsClick"
            >Kursstatistiken ansehen</v-btn
          >
        </v-row>
        <v-row justify="space-around">
          <v-btn
            class="ma-2 v-col-11"
            @click="activateSessionStatisticsSelection"
            >Sitzungsstatistiken ansehen</v-btn
          ></v-row
        >
        <v-row justify="space-around">
          <v-btn class="ma-2 v-col-11" @click="activateInteractionMapSelection"
            >Interaktionskarte ansehen</v-btn
          ></v-row
        >
      </v-card>
    </v-container>
    <v-container fluid class="v-row justify-center">
      <v-card min-width="640" rounded class="ma-3 v-col-auto">
        <v-row>
          <h2 class="ma-2">Schülerliste</h2>
          <v-spacer />
          <v-btn
            class="ml-15 ma-2"
            variant="flat"
            color="green"
            rounded
            prepend-icon="mdi mdi-plus"
            @click="activateStudentCard"
            >Schüler hinzufügen</v-btn
          >
        </v-row>
        <v-row class="v-card justify-center">
          <v-card class="v-col-12" max-height="1000">
            <v-list max-height="500">
              <v-row class="ma-2" v-for="student in studentsInCourse"
                >{{ student.firstName }} {{ student.lastName }}
                <v-spacer />
                <v-btn
                  variant="tonal"
                  color="primary"
                  @click="editStudentClick(student)"
                  ><v-icon>fas fa-pencil</v-icon></v-btn
                >
                <v-btn
                  class="ml-2"
                  variant="tonal"
                  color="primary"
                  @click="studentStatisticClick(student)"
                >
                  <v-icon> fas fa-chart-line </v-icon>
                </v-btn>
              </v-row>
            </v-list>
          </v-card>
        </v-row>
      </v-card>
    </v-container>
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
import { SessionController } from "@/controller/SessionController";
import { useRouter } from "vue-router";

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
    const router = useRouter();

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

    const studentsNotInCourse = computed(() => getStudentsNotInCourse());

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
        params: {
          sessionId: sessionController.createSession(
            props.courseId,
            seatArrangement.getId,
            ""
          ),
        }, //TODO session name
      });
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
