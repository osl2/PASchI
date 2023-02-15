<template>
  <navigation-bar extended>
    <v-app-bar-title> Kursdetails </v-app-bar-title>
    <template v-slot:extension>
      <v-btn @click="showCourseStatisticsClick">Kursstatistiken ansehen</v-btn>
      <v-btn @click="editCourseDetailsClick">Kurs bearbeiten</v-btn>
    </template>
  </navigation-bar>
  <side-menu></side-menu>
  <v-main>
    <v-container fluid class="v-row justify-center">
      <v-card min-width="640" rounded class="ma-3 v-col-auto">
        <v-row>
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
                  >InteraktionsKarte</v-btn
                >
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
            min-width="228"
            @click="activateStudentCard"
            >Schüler hinzufügen</v-btn
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

    const studentListCollapsed: Ref<boolean> = ref<boolean>(true);
    const sessionListCollapsed: Ref<boolean> = ref<boolean>(true);

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
    function deleteSessionClick(session: Session) {
      courseController.deleteSession(props.courseId, session.getId);
    }
    function toggleSessionListCollapsed() {
      sessionListCollapsed.value = !sessionListCollapsed.value;
    }
    function toggleStudentListCollapsed() {
      studentListCollapsed.value = !studentListCollapsed.value;
    }
    function removeStudentFromCourse(student: Student) {
      courseController.removeStudentFromCourse(props.courseId, student.getId);
    }
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
    function sessionStatisticClick(session: Session) {
      router.push({
        name: "SessionStatisticPage",
        params: { sessionId: session.getId },
      });
    }
    function interactionMapClick(session: Session) {
      router.push({
        name: "ShowInteractionMapPage",
        params: { sessionId: session.getId },
      });
    }
    function addStudent(student: Student) {
      courseController.addStudentToCourse(props.courseId, student.getId);
      if (studentsNotInCourse.value.length == 0) {
        addStudentSelectionDialog.value = false;
      }
    }
    function activateStudentCard() {
      addStudentSelectionDialog.value = true;
    }
    function addSessionClick() {
      seatArrangementSelectionDialog.value = true;
    }
    function startSessionClick(seatArrangement: SeatArrangement) {
      router.push({
        //name: "SessionPage",
        name: "SessionPageDesktop",
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
      sessionStatisticClick,
      interactionMapClick,
      addStudent,
      activateStudentCard,
      addSessionClick,
      startSessionClick,
      studentStatisticClick,
      removeStudentFromCourse,
      toggleStudentListCollapsed,
      toggleSessionListCollapsed,
      deleteSessionClick,
      sessionStatisticDialog,
      interactionMapSelectionDialog,
      addStudentSelectionDialog,
      seatArrangementSelectionDialog,
      studentsNotInCourse,
      studentsInCourse,
      sessions,
      seatArrangements,
      studentListCollapsed,
      sessionListCollapsed,
    };
  },
});
</script>

<style scoped></style>
