<template>
  <v-card color="primary-lighten-1" name="recentCoursesCard">
    <v-card-title>
      <v-row class="ma-2"> Letzte Sitzungen </v-row>
    </v-card-title>
    <v-list-item v-for="session in sessions" class="pa-2 ma-1">
      <v-list-item-title>
        <div>{{ session.name }} {{ session.date }}</div>
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          name="interactionMap"
          variant="tonal"
          color="white"
          @click="navigateToInteractionMap(session)"
        >
          <v-icon>mdi mdi-map</v-icon>
          <v-tooltip
            activator="parent"
            location="end"
          >Interaktionskarte
          </v-tooltip>
        </v-btn>
        <v-btn
          name="statistics"
          class="ml-2"
          variant="tonal"
          color="white"
          @click="navigateToSessionStatistic(session)"
        >
          <v-icon> fas fa-chart-line </v-icon>
          <v-tooltip
            activator="parent"
            location="end"
          >Sitzungsstatistiken
          </v-tooltip>
        </v-btn>
      </template>
    </v-list-item>
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
