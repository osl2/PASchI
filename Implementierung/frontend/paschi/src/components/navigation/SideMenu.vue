<template>
  <v-navigation-drawer expand-on-hover rail elevation="12" color="primary">
    <v-list nav>
      <v-list-item prepend-icon="fas fa-tachometer-alt" @click="router.push('/dashboard')" >
        <v-list-item-title>
          Dashboard
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "SideMenu",
  methods: {
    Dashboard() {
      return Dashboard
    }
  }
})
</script>

<style scoped>

</style>
