<template>
  <NavigationBar>
    <template #default>
      <v-toolbar-title>
        Willkommen zurück, {{userStore.getFirstName}} {{ userStore.getSurName }}
      </v-toolbar-title>
    </template>
    <template #append>
      <v-btn variant="outlined" rounded="pill">
        Abmelden
      </v-btn>
    </template>
  </NavigationBar>

  <v-main>
    <v-container fluid>
      <v-row justify="space-around" align-content="stretch">
        <v-col>
          <RecentCoursesCard class="ma-3" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import AppBar from "@/components/navigation/NavigationBar.vue";
import {useUserStore} from "@/store/UserStore";
import RecentCoursesCard from "@/components/dashboard/RecentCoursesCard.vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";

export default {
  name: "Dashboard",
  components: {NavigationBar, RecentCoursesCard},
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  }
}
</script>

<style scoped>

</style>
