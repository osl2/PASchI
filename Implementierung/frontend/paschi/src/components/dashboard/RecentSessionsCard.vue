<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2"> Letzte Sitzungen </v-row>
    </v-card-title>
    <v-card-item v-for="session in sessions">
      <v-row class="ma-2">
        {{ session.name }}
        <v-spacer />
        <v-btn @click="navigateTo(session)"></v-btn>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SessionController } from "@/controller/SessionController";

export default defineComponent({
  name: "RecentSessionsCard",
  setup() {
    const sessionController = SessionController.getSessionController();

    //const sessions = sessionController.getAllSessions()
    const sessions = [
      {
        name: "Test",
      },
      {
        name: "Test2",
      },
      {
        name: "Test3",
      },
    ];

    return {
      sessions,
    };
  },
});
</script>

<style scoped></style>
