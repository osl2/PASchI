<template>
  <v-card variant="flat" class="rounded-lg mb-4">
    <PDialog
      buttons-centered
      title="Fehler beim erstellen der Sitzung"
      :buttons="[
        {
          name: 'OK',
          click: closeErrorDialog,
        },
      ]"
      v-model="errorDialog"
    />
    <NewSeatArrangementDialog
      :course-id="courseId"
      v-model="showNewSeatArrangementDialog"
    />
    <v-card-title class="v-expansion-panel-title">
      <h2 class="ma-2">
        <v-icon>mdi mdi-plus</v-icon>
        <span class="ml-2">Neue Sitzung starten</span>
      </h2>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel elevation="5" class="rounded-lg">
          <v-expansion-panel-title name="newSessionListTitle">
            <v-card variant="text">
              <v-card-title>
                {{
                  lastSeatArrangement?.isVisible()
                    ? lastSeatArrangement?.name
                    : "Standardsitzordnung"
                }}
              </v-card-title>
              <v-card-subtitle> Sitzordnung auswählen </v-card-subtitle>
            </v-card>
            <v-spacer />
            <v-btn
              name="startLastSeatArrangement"
              height="50"
              width="80"
              variant="tonal"
              class="ma-2 rounded-lg"
              color="green"
              v-on:click.stop
              @click="newSessionClick(lastSeatArrangement)"
            >
              <v-icon> fas fa-arrow-right </v-icon>
              <v-tooltip activator="parent" location="start"
                >Sitzung starten
              </v-tooltip>
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-2">
            <v-btn
              v-if="!isMobile"
              block
              height="60"
              variant="elevated"
              color="primary"
              prepend-icon="fas fa-plus"
              @click="newSeatArrangementClick"
              >Neue Sitzordnung</v-btn
            >
            <v-list class="ma-0 mt-2">
              <v-list-item v-if="lastSeatArrangement?.isVisible()">
                Standardsitzordnung
                <template v-slot:append>
                  <v-btn
                    variant="tonal"
                    class="ma-2"
                    color="green"
                    v-on:click.stop
                    @click="newSessionClick(undefined)"
                  >
                    <v-icon>fas fa-arrow-right</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item
                v-for="(seatArrangement, index) in seatArrangements"
                rounded
                :key="index"
                @click="newSessionClick(seatArrangement)"
              >
                {{ seatArrangement.name }}
                <template v-slot:append>
                  <v-btn
                    v-if="!isMobile"
                    variant="tonal"
                    class="ma-2"
                    v-on:click.stop
                    @click="editSeatArrangementClick(seatArrangement)"
                  >
                    <v-icon>fas fa-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    color="green"
                    class="ma-2"
                    v-on:click.stop
                    @click="newSessionClick(seatArrangement)"
                  >
                    <v-icon>fas fa-arrow-right</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, ref } from "vue";
import { CourseController } from "@/controller/CourseController";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import router from "@/plugins/router";
import { SessionController } from "@/controller/SessionController";
import PDialog from "@/components/base/PDialog.vue";
import NewSeatArrangementDialog from "@/components/room/NewSeatArrangementDialog.vue";

export default defineComponent({
  name: "NewSessionCard",
  components: { NewSeatArrangementDialog, PDialog },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const courseId = props.courseId;
    const courseController = CourseController.getCourseController();
    const sessionController = SessionController.getSessionController();
    const seatArrangements = courseController.getSeatArrangements(courseId);
    const lastSession = courseController.getSessions(courseId)![0] ?? undefined;
    const lastSeatArrangement = lastSession?.seatArrangement ?? undefined;
    const showNewSeatArrangementDialog = ref(false);
    const errorDialog = ref(false);
    const isMobile: Ref<boolean> = inject("isMobile") as Ref<boolean>;

    function editSeatArrangementClick(seatArrangement: SeatArrangement) {
      router.push({
        name: "SeatArrangementPage",
        params: { seatArrangementId: seatArrangement.getId },
      });
    }

    async function newSessionClick(
      seatArrangement: SeatArrangement | undefined
    ) {
      const session = await sessionController.createSession(
        courseId,
        seatArrangement?.isVisible() ? seatArrangement!.getId : undefined,
        "Session"
      );
      if (!session) {
        activateErrorDialog();
        return;
      }
      await router.push({
        name: isMobile.value ? "SessionPage" : "SessionPageDesktop",
        params: { sessionId: session },
      });
    }

    function activateErrorDialog() {
      errorDialog.value = true;
    }

    function closeErrorDialog() {
      errorDialog.value = false;
    }

    function newSeatArrangementClick() {
      showNewSeatArrangementDialog.value = true;
    }

    return {
      showNewSeatArrangementDialog,
      lastSeatArrangement,
      seatArrangements,
      editSeatArrangementClick,
      newSeatArrangementClick,
      newSessionClick,
      closeErrorDialog,
      errorDialog,
      isMobile,
    };
  },
});
</script>

<style scoped></style>
