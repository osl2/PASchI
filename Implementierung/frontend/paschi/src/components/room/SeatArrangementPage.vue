<template>
  <navigation-bar></navigation-bar>
  <v-main>
    <side-menu> </side-menu>
  </v-main>
</template>

<script lang="ts">
export default {
  name: "SeatArrangementPage",
  props: {
    seatArrangementId: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
