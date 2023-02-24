<template>
  <v-card color="primary-lighten-1">
    <v-card-title>
      <v-row class="ma-2"> Letzte Sitzungen </v-row>
    </v-card-title>
    <v-card-item v-for="session in sessions">
      <v-row class="ma-2">
        {{ session.name }} {{ session.date }}
        <v-spacer />
        <v-btn
          variant="tonal"
          color="white"
          @click="navigateToInteractionMap(session)"
          >InteraktionsKarte</v-btn
        >
        <v-btn
          class="ml-2"
          variant="tonal"
          color="white"
          @click="navigateToSessionStatistic(session)"
        >
          <v-icon> fas fa-chart-line </v-icon>
        </v-btn>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SessionController } from "@/controller/SessionController";
import { Session } from "@/model/userdata/courses/Session";
import router from "@/plugins/router";

export default defineComponent({
  name: "RecentSessionsCard",
  setup() {
    const sessionController = SessionController.getSessionController();
    const sessions = sessionController.getRecentSessions();

    /**
     * Methode, die zur Sitzungsstatistik leitet
     *
     * @param session Die Sitzung der Statistik
     */
    function navigateToSessionStatistic(session: Session) {
      router.push({
        name: "SessionStatisticPage",
        params: { sessionId: session.getId },
      });
    }

    /**
     * Methode, die zur Interaktionskarte leitet
     *
     * @param session Die Sitzung, die die Interaktionskarte abbildet
     */
    function navigateToInteractionMap(session: Session) {
      router.push({
        name: "ShowInteractionMapPage",
        params: { sessionId: session.getId },
      });
    }

    return {
      sessions,
      navigateToSessionStatistic,
      navigateToInteractionMap,
    };
  },
});
</script>

<style scoped></style>
