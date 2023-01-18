<template>
  <v-main>
    v-main>
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

import {useUserStore} from "@/store/UserStore";
import AppBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
export default {
  name: "AdminPage",
  components: {AppBar},
  setup() {
    const userStore = useUserStore()

    return {
      userStore,
      router
    }
  }
}
</script>

<style>

</style>
