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
        <v-btn prepend-icon="fas fa-check" color="primary" @click="" />
        <v-btn prepend-icon="fas fa-xmark" color="primary" @click="" />
      </v-row>
    </v-card-item>
  </v-card>
</template>



<script lang="ts">


  export default {
    data() {
      return {
        requests: [
          { name: "Hansi"},
          {name: "Gudrun"},
        ]
      }
    }
  }

</script>

<style scoped>

</style>
