<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
        Bereits akzeptierte Accounts:
      </v-row>
    </v-card-title>
    <v-card-item v-for="user in users">
      {{user.name}}
      <!-- TODO Hier kommt ein delte-Icon hin -->
      <v-btn @click="navigateTo(course)"></v-btn>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/plugins/router";

export default defineComponent({
  name: "UserListCard",
})
</script>

<style scoped>

</style>
