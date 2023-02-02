<template>
  <v-card color="primary">
    <v-card-title>
      <v-row class="ma-2">
       Accountanträge
      </v-row>
    </v-card-title>

    <v-card-item v-for="request in requests">
      <v-row class="ma-2">
        {{ request.name }}
        <v-spacer />
        <v-btn prepend-icon="fas fa-check" color="primary" @click="authUser(request)" />
        <v-btn prepend-icon="fas fa-xmark" color="primary" @click="deleteUser(request)" />
      </v-row>
    </v-card-item>
  </v-card>
</template>



<script lang="ts">

import {defineComponent, ref, Ref} from "vue";
import {AdminController} from "@/controller/AdminController";
import {User} from "@/model/User";

export default defineComponent({
  name: "RequestListCard",
  setup() {
    const adminController: AdminController = AdminController.getAdminController();
    const requests: Ref<User[]> = ref<User[]>(adminController.getUsersNotAuthenticated()) as Ref<User[]>;

    function authUser(user: User) {
      adminController.authUser(user.getId);
    }
    function deleteUser(user: User) {
      adminController.deleteUser(user.getId);
    }
    return {
      authUser,
      deleteUser,
      //request,
      requests: [
        { name: "Hansi"},
        {name: "Gudrun"},
        { name: "Hansi"}
      ]
    }
  }
})

</script>

<style scoped>

</style>
