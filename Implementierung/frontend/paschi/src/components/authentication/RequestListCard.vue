<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
        Neue, noch nicht bestätigte Accounts:
        <v-spacer />
        <v-btn color="secondary" @click="navigateToCourses()" class="primary-text" >Alle anzeigen</v-btn>
      </v-row>
    </v-card-title>
    <v-card-item v-for="request in requests">
      {{request.name}}
      <v-btn @click="navigateTo(course)"></v-btn>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/plugins/router";

export default defineComponent({
  name: "RequestListCard",
})
</script>

<style scoped>

</style>
