<template>
  <RoomDisplay :room-id="roomId">
    <template v-slot:chair="chair">
      <SeatLabel :chair="chair.chair" :participant="seatArrangement.getParticipantForSeat(chair.chair)" />
    </template>
  </RoomDisplay>
</template>

<script>
import { defineComponent } from 'vue';
import { SessionController } from '@/controller/SessionController';
import RoomDisplay from '@/components/room/RoomDisplay.vue'
import SeatLabel from "@/components/room/SeatLabel.vue";

export default defineComponent({
  name: 'SessionPageDesktop',
  components: {SeatLabel, RoomDisplay},
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sessionId = props.sessionId;
    const sessionController = SessionController.getSessionController();
    const session = sessionController.getSession(sessionId);
    const seatArrangement = sessionController.getSeatArrangementOfSession(sessionId);

    return {
      roomId: seatArrangement.room.getId,
      seatArrangement
    }

  },
});
</script>

<style scoped></style>
