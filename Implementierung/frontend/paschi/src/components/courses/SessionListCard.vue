<template>
  <v-expansion-panels>
    <PDialog
      v-model="deleteSessionDialog"
      title="Sitzung unwiderruflich löschen?"
      buttons-centered
      :buttons="[
        {
          name: 'Abbrechen',
          click: cancelDeleteSessionClick,
        },
        {
          name: 'Bestätigen',
          color: 'error',
          click: confirmDeleteSessionClick,
        },
      ]"
    >
    </PDialog>
    <v-expansion-panel eager elevation="0" class="rounded-lg">
      <v-expansion-panel-title>
        <h2 class="ma-2">Sitzungsliste</h2>
        <v-spacer />
        <v-btn
          min-width="228"
          class="ml-15 ma-2"
          variant="flat"
          color="green"
          rounded
          prepend-icon="mdi mdi-plus"
          v-on:click.stop
          @click="addSessionClick"
          >Sitzung starten</v-btn
        >
      </v-expansion-panel-title>
      <v-expansion-panel-text class="justify-center">
        <v-list>
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
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from "vue";
import PDialog from "@/components/base/PDialog.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { useRouter } from "vue-router";
import { CourseController } from "@/controller/CourseController";
import { SessionController } from "@/controller/SessionController";
import { Session } from "@/model/userdata/courses/Session";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";

export default defineComponent({
  name: "SessionListCard",
  components: { PDialog, SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isMobile: Ref<boolean> = inject("isMobile") as Ref<boolean>;

    const router = useRouter();

    const courseController: CourseController =
      CourseController.getCourseController();
    const sessionController: SessionController =
      SessionController.getSessionController();

    const deleteSessionBuffer: Ref<Session | undefined> = ref<
      Session | undefined
    >(undefined) as Ref<Session | undefined>;

    const sessionStatisticDialog: Ref<boolean> = ref<boolean>(false);
    const interactionMapSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const seatArrangementSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const deleteSessionDialog: Ref<boolean> = ref<boolean>(false);

    const seatArrangements: Ref<SeatArrangement[]> = ref<SeatArrangement[]>(
      getSeatArrangements()
    ) as Ref<SeatArrangement[]>;

    const sessions: Ref<Session[]> = ref<Session[]>(getSessions()) as Ref<
      Session[]
    >;

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

    /**
     * Methode zur Anzeige einer Sitzungsstatistik
     *
     * @param session Die Sitzung der Statistik
     */
    function sessionStatisticClick(session: Session) {
      router.push({
        name: "SessionStatisticPage",
        params: { sessionId: session.getId },
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
        params: { sessionId: session.getId },
      });
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

    async function newStandardSeatArrangement() {
      const sessionId = await sessionController.createSession(
        props.courseId,
        undefined,
        ""
      );
      await router.push({
        name: "SessionPageDesktop",
        params: {
          sessionId: sessionId,
        },
      });
    }

    return {
      showCourseStatisticsClick,
      editCourseDetailsClick,
      sessionStatisticClick,
      interactionMapClick,
      addSessionClick,
      startSessionClick,
      deleteSessionClick,
      cancelDeleteSessionClick,
      confirmDeleteSessionClick,
      deleteSessionDialog,
      sessionStatisticDialog,
      interactionMapSelectionDialog,
      seatArrangementSelectionDialog,
      sessions,
      seatArrangements,
      newStandardSeatArrangement,
    };
  },
});
</script>

<style scoped></style>
