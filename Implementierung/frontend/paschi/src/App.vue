<template>
  <v-app>
    <v-layout>
      <router-view />
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">

import {onBeforeMount} from "vue";
import {UserController} from "@/controller/UserController";

onBeforeMount(async() => {
  await UserController.getUserController().loginWithToken()
});
</script>
