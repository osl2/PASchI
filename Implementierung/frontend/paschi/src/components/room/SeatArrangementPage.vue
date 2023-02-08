<template>
  <navigation-bar />
  <RoomDisplay :room-id="seatArrangement.room.getId">
    <template v-slot:chair="chair">
      <SeatLabel :participant="seatArrangement.getParticipantForSeat(chair.chair)" />
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
export default defineComponent({
  name: "SeatArrangementPage",
  components: { SeatLabel, RoomDisplay, NavigationBar },
  props: {
    seatArrangementId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const seatArrangement = ref<SeatArrangement | undefined>(
      SeatArrangementController.getSeatArrangementController().getSeatArrangement(
        props.seatArrangementId
      )
    ) as Ref<SeatArrangement>;
    return { seatArrangement };
  },
});
</script>

<style scoped></style>
