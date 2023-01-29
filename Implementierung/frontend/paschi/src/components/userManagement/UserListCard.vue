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
        <v-btn prepend-icon="fas fa-trash" color="primary" @click="" />
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
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
