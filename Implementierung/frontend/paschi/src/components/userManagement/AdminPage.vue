<template>
  <v-main>
    <v-container fluid>
      <v-row justify="space-around" align-content="stretch">
        <v-col>
          <RequestListCard :requests="requests" @update-requests="updateUsers" class="ma-3" />
        </v-col>
        <v-col>
          <UserListCard :users="users" @update-users="updateUsers" class="ma-3" />
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
import {AdminController} from "@/controller/AdminController";
import {onBeforeMount, ref} from "vue";
import {User} from "@/model/User";
export default {
  name: "AdminPage",
  components: { AppBar, RequestListCard, UserListCard },
  setup() {
    const adminController = AdminController.getAdminController();

    const users = ref<User[]>([]);
    const requests = ref<User[]>([]);


    async function updateUsers() {
      await adminController.getUsersNotAuthenticated().then((res) => requests.value = res);
      await adminController.getUsers().then((res) => users.value = res);

    }

    onBeforeMount(() => {
      updateUsers();
    });

    return {
      router,
      updateUsers,
      users,
      requests,
    };
  },
};
</script>

<style></style>
