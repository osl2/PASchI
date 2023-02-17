<template>
  <RoomDisplay :room-id="roomId">
    <template v-slot:chair="chair">
      <SeatLabel
        :chair="chair.chair"
        :participant="seatArrangement.getParticipantForSeat(chair.chair)"
        @click="selectStudent(seatArrangement.getParticipantForSeat(chair.chair))"
      />
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SessionController } from "@/controller/SessionController";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import {Participant} from "@/model/userdata/interactions/Participant";

export default defineComponent({
  name: "SessionPageDesktop",
  components: { SeatLabel, RoomDisplay },
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

    let selectedStudent: Participant | undefined = undefined;

    function selectStudent(participant: Participant) {
      if (participant) {
      }
    }

    return {
      roomId: seatArrangement?.room.getId,
      seatArrangement,
      selectStudent,
    };
  },
});
</script>

<style scoped></style>
