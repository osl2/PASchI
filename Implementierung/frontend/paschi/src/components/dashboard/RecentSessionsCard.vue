<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
        Letzte Sitzungen
      </v-row>
    </v-card-title>
    <v-card-item v-for="session in sessions">
      {{session.name}}
      <v-btn @click="navigateTo(session)"></v-btn>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/plugins/router";

export default defineComponent({
  name: "RecentSessionsCard",
  setup() {

    return {
    }
  }
})
</script>

<style scoped>

</style>
