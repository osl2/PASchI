<template>
  <LineOverlay :lines="interactionLines" />
  <RoomDisplay :room-id="roomId">
    <template v-slot:chair="chair">
      <SeatLabel
        :chair="chair.chair"
        :participant="getParticipant(chair.chair)"
        @click="selectStudent(getParticipant(chair.chair))"
      />
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";
import { SessionController } from "@/controller/SessionController";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import {Participant} from "@/model/userdata/interactions/Participant";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {Chair} from "@/model/userdata/rooms/Chair";
import LineOverlay from "@/components/room/LineOverlay.vue";

export default defineComponent({
  name: "SessionPageDesktop",
  components: {LineOverlay, SeatLabel, RoomDisplay },
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
    const seatArrangement: SeatArrangement | undefined = sessionController.getSeatArrangementOfSession(sessionId);

    let selectedStudent: Participant | undefined = undefined;

    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    function selectStudent(participant: Participant) {
      if (participant) {
      }
    }

    return {
      roomId: seatArrangement?.room.getId,
      seatArrangement,
      getParticipant,
      selectStudent,
    };
  },
});
</script>

<style scoped></style>
