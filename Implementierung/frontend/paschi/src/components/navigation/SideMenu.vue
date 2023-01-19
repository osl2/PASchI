<template>
  <v-navigation-drawer expand-on-hover rail elevation="12" color="primary">
    <v-list nav density="compact" class="mt-12">
      <v-list-item :active="subRouteOf('Dashboard')" prepend-icon="fas fa-gauge" @click="router().push('/dashboard')" >
        <v-list-item-title>
          Dashboard
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/plugins/router";
import {useRoute} from "vue-router";

export default defineComponent({
  name: "SideMenu",
  methods: {
    router() {
      return router
    },
  },
  setup() {
    function subRouteOf(route: string): boolean {
      return useRoute().matched.some(({name}) => name === route)
    }
    return {
      subRouteOf
    }
  }
})
</script>

<style scoped>

</style>
