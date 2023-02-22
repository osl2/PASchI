<template>
  <NavigationBar/>
  <RoomDisplay :room-id="seatArrangement.room.getId">
    <template v-slot:chair="chair">
      <SeatLabel :participant="getParticipant(chair.chair)">
      </SeatLabel>
    </template>
  </RoomDisplay>
  <v-main>
    <LineOverlay :lines="lines"/>
  </v-main>

</template>

<script lang="ts">
import LineOverlay from "@/components/room/LineOverlay.vue";
import {defineComponent} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";

export default defineComponent({
  name: "InteractionMap",
  components: {NavigationBar, LineOverlay},
  props: {},
  setup() {
    const lines = [{x1: 100, y1: 100, x2: 300, y2: 500}, {x1: 300, y1: 500, x2: 100, y2: 100}];
    return {lines};
  },
});
</script>

<style scoped></style>
