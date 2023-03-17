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
      <v-expansion-panel-title name="sessionListTitle">
        <h2 class="ma-2">Sitzungsliste</h2>
        <v-spacer />
      </v-expansion-panel-title>
      <v-expansion-panel-text class="justify-center">
        <v-list>
          <v-row class="ma-2" v-for="session in sessions"
            >Sitzung am {{ session.date }}
            <v-spacer />
            <v-btn
              variant="tonal"
              color="primary"
              @click="interactionMapClick(session)"
            >
              <v-icon>mdi mdi-map</v-icon>
              <v-tooltip
                activator="parent"
                location="start"
              >Interaktionskarte
              </v-tooltip>
            </v-btn>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="primary"
              @click="sessionStatisticClick(session)"
            >
              <v-icon> fas fa-chart-line </v-icon>
              <v-tooltip
                activator="parent"
                location="end"
              >Sitzungsstatistiken
              </v-tooltip>
            </v-btn>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="red"
              @click="deleteSessionClick(session)"
            >
              <v-icon>fas fa-trash-can</v-icon>
              <v-tooltip
                activator="parent"
                location="end"
              >Sitzung löschen
              </v-tooltip>
            </v-btn>
          </v-row>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import PDialog from "@/components/base/PDialog.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { useRouter } from "vue-router";
import { CourseController } from "@/controller/CourseController";
import { Session } from "@/model/userdata/courses/Session";

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

    const router = useRouter();

    const courseController: CourseController =
      CourseController.getCourseController();

    const deleteSessionBuffer: Ref<Session | undefined> = ref<
      Session | undefined
    >(undefined) as Ref<Session | undefined>;

    const interactionMapSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const deleteSessionDialog: Ref<boolean> = ref<boolean>(false);
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

    return {
      showCourseStatisticsClick,
      editCourseDetailsClick,
      sessionStatisticClick,
      interactionMapClick,
      deleteSessionClick,
      cancelDeleteSessionClick,
      confirmDeleteSessionClick,
      deleteSessionDialog,
      interactionMapSelectionDialog,
      sessions,
    };
  },
});
</script>

<style scoped></style>
