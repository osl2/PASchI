<template>
  <v-main>
    <v-container fluid>
      <v-row justify="space-around" align-content="stretch">
        <v-col>
          <RequestListCard class="ma-3" />
        </v-col>
        <v-col>
          <UserListCard class="ma-3" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import UserListCard from "@/components/userManagement/UserListCard.vue";
import RequestListCard from "@/components/userManagement/RequestListCard.vue";
export default {
  name: "AdminPage",
  components: { AppBar, RequestListCard, UserListCard },
  setup() {
    return {
      router,
    };
  },
};
</script>

<style></style>
