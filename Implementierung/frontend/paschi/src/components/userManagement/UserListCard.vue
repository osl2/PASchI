<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
        Akzeptierte Accounts
      </v-row>
    </v-card-title>
    <v-card-item v-for="user in users">
      <v-row class="ma-2">
        {{ user.name }}
        <v-spacer />
        <v-btn prepend-icon="fas fa-trash" color="primary" @click="deleteUser(user)" />
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { AdminController } from "@/controller/AdminController";
import { User } from "@/model/User";
import {defineComponent, ref, Ref} from "vue";

export default defineComponent({
  name: "UserListCard",
  setup() {
    const adminController: AdminController = AdminController.getAdminController();
    const users: Ref<User[]> = ref<User[]>(adminController.getUsers()) as Ref<User[]>;

    function deleteUser(user: User) {
      adminController.deleteUser(user.getId);
    }
    return {
      deleteUser,
      //user,
      users: [
        { name: "Hansi"},
        {name: "Gudrun"},
        {name: "David"},
      ]
    }
  }
})
</script>

<style scoped>

</style>
