<template>
  <navigation-bar>
    <v-app-bar-title> Kursdetails</v-app-bar-title>
    <template v-slot:append>
      <v-btn class="ma-2" rounded variant="tonal" @click="showCourseStatisticsClick">Kursstatistiken ansehen</v-btn>
      <v-btn class="ma-2" rounded variant="tonal" @click="editCourseDetailsClick">Kurs bearbeiten</v-btn>
    </template>
  </navigation-bar>
  <side-menu></side-menu>
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
    <v-dialog max-width="700" v-model="addStudentSelectionDialog">
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
    <v-dialog max-width="700" v-model="seatArrangementSelectionDialog">
      <v-card min-height="50">
        <v-card-item style="height: 100px" class="v-row justify-end">
          <v-btn class="ma-2" prepend-icon="mdi mdi-plus" variant="tonal" @click="newStandardSeatArrangement">Neue Standardsitzordnung</v-btn>
          <v-btn class="ma-2" prepend-icon="mdi mdi-pencil" variant="tonal" color="primary" @click="editCourseDetailsClick">Sitzordnungen bearbeiten</v-btn>
        </v-card-item>
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
    <v-dialog max-width="700" v-model="deleteSessionDialog">
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Sitzung unwiderruflich löschen?
        </v-card-title>
        <v-card-actions class="row justify-center">
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="cancelDeleteSessionClick"
          >Abbrechen
          </v-btn
          >
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="confirmDeleteSessionClick"
            color="primary"
            >Bestätigen</v-btn
          >
        </v-card-actions>
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
import { computed, defineComponent, inject, Ref, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import { SessionController } from "@/controller/SessionController";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "CourseDetailsPage",
  components: {SideMenu, NavigationBar},
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isMobile: Ref<boolean> = inject('isMobile') as Ref<boolean>

    const router = useRouter();

    const courseController: CourseController =
      CourseController.getCourseController();
    const sessionController: SessionController =
      SessionController.getSessionController();

    const studentListCollapsed: Ref<boolean> = ref<boolean>(false);
    const sessionListCollapsed: Ref<boolean> = ref<boolean>(false);
    const deleteSessionBuffer: Ref<Session | undefined> = ref<
      Session | undefined
    >(undefined) as Ref<Session | undefined>;

    const sessionStatisticDialog: Ref<boolean> = ref<boolean>(false);
    const interactionMapSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const addStudentSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const seatArrangementSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const deleteSessionDialog: Ref<boolean> = ref<boolean>(false);

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
    /**
     * Methode zur Vorbereitung der Löschung eines Kurses.
     *
     * @param session Die zu löschende Sitzung
     */
    function deleteSessionClick(session: Session) {
      deleteSessionBuffer.value = session;
      deleteSessionDialog.value = true;
    }

    /**
     * Methode zum Abbruch der Löschung einer Sitzung.
     */
    function cancelDeleteSessionClick() {
      deleteSessionDialog.value = false;
    }

    /**
     * Methode zur Bestätigung der Löschung des zuvor bestimmten Kurses.
     */
    function confirmDeleteSessionClick() {
      courseController.deleteSession(
        props.courseId,
        deleteSessionBuffer.value!.getId
      );
      deleteSessionDialog.value = false;
    }

    /**
     * Methode um den Zustand der Sitzungsliste (geöffnet/ zugeklappt) zu wechseln.
     */
    function toggleSessionListCollapsed() {
      sessionListCollapsed.value = !sessionListCollapsed.value;
    }

    /**
     * Methode um den Zustand von der Schülerliste (geöffnet/ zugeklappt) zu wechseln.
     */
    function toggleStudentListCollapsed() {
      studentListCollapsed.value = !studentListCollapsed.value;
    }

    /**
     * Methode um einen Schüler aus dem Kurs zu entfernen
     *
     * @param student Der zu entfernende Schüler
     */
    function removeStudentFromCourse(student: Student) {
      courseController.removeStudentFromCourse(props.courseId, student.getId);
    }

    /**
     * Methode zur Anzeige der Kursstatistiken
     */
    function showCourseStatisticsClick() {
      router.push({
        name: "CourseStatisticPage",
        params: {courseId: props.courseId},
      });
    }

    /**
     * Methode zum Bearbeiten eines Kurses.
     */
    function editCourseDetailsClick() {
      router.push({
        name: "EditCoursePage",
        params: {courseId: props.courseId},
      });
    }

    /**
     * Methode um die Bearbeitungsseite eines Schülers aufzurufen.
     *
     * @param student
     */
    function editStudentClick(student: Student) {
      router.push({
        name: "EditStudentPage",
        params: {studentId: student.getId},
      });
    }

    /**
     * Methode zur Anzeige einer Sitzungsstatistik
     *
     * @param session Die Sitzung der Statistik
     */
    function sessionStatisticClick(session: Session) {
      router.push({
        name: "SessionStatisticPage",
        params: {sessionId: session.getId},
      });
    }

    /**
     * Methode zur Anzeige einer Interaktionskarte
     *
     * @param session Die Sitzung der Interaktionskarte
     */
    function interactionMapClick(session: Session) {
      router.push({
        name: "ShowInteractionMapPage",
        params: {sessionId: session.getId},
      });
    }

    /**
     * Methode zum Hinzufügen eines Schülers zu einem Kurs
     *
     * @param student Der Schüler der hinzugefügt werden soll
     */
    function addStudent(student: Student) {
      courseController.addStudentToCourse(props.courseId, student.getId);
      if (studentsNotInCourse.value.length == 0) {
        addStudentSelectionDialog.value = false;
      }
    }

    /**
     * Methode zum Aktivieren der Anzeige der SchülerListe
     */
    function activateStudentCard() {
      addStudentSelectionDialog.value = true;
    }

    /**
     * Methode zum Starten einer Sitzung.
     * Bei mobiler Version wird eine Sizung gestartet,
     * bei Desktop eine Liste mit Sitzornungen geöffnet
     */
    async function addSessionClick() {
      if (isMobile.value) {
        await router.push({
          name: "SessionPage",
          params: {
            sessionId: await sessionController.createSession(
              props.courseId,
              undefined,
              ""
            ),
          }, //TODO session name
        });
      } else {
        seatArrangementSelectionDialog.value = true;
      }
    }

    /**
     * Methode zum Starten einer Desktop- Sitzung
     *
     * @param seatArrangement Die Sitzordnung für die Sitzung
     */
    async function startSessionClick(seatArrangement: SeatArrangement) {
      await router.push({
        name: "SessionPageDesktop",
        params: {
          sessionId: await sessionController.createSession(
            props.courseId,
            seatArrangement.getId,
            ""
          ),
        }, //TODO session name
      });
    }

    /**
     * Methode zur Anzeige der Schülerstatistik.
     *
     * @param student Schüler der Statistik
     */
    function studentStatisticClick(student: Student) {
      router.push({
        name: "StudentStatisticPage",
        params: {studentId: student.getId},
      });
    }

    async function newStandardSeatArrangement() {
      const sessionId = await sessionController.createSession(props.courseId, undefined, "");
      await router.push({
        name: "SessionPageDesktop",
        params: {
          sessionId: sessionId
        },
      });

    }

    return {
      showCourseStatisticsClick,
      editCourseDetailsClick,
      editStudentClick,
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
      cancelDeleteSessionClick,
      confirmDeleteSessionClick,
      deleteSessionDialog,
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
      newStandardSeatArrangement,
    };
  },
});
</script>

<style scoped></style>
