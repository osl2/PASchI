<template>
  <AppBar>
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
  </AppBar>

  <v-main>

  </v-main>
</template>

<script>
import AppBar from "@/components/navigation/AppBar.vue";
import {useUserStore} from "@/store/UserStore";

export default {
  name: "Dashboard",
  components: {AppBar},
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
