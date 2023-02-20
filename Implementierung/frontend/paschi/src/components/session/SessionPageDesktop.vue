<template>
  <LineOverlay :lines="interactionLines" style="z-index: 10" />
  <RoomDisplay style="z-index: 5" :room-id="roomId" @selectRoomObject="selectStudent" @dragRoomObject="drag" @deselectRoomObject="selectTargetStudent">
    <template v-slot:chair="chair">
      <SeatLabel
        :ref="(el) => (seatLabels[getParticipant(chair.chair)?.getId ?? undefined] = el)"
        :chair="chair.chair"
        :participant="getParticipant(chair.chair)"
      />
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import {computed, defineComponent, Ref, ref} from "vue";
import { SessionController } from "@/controller/SessionController";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { Participant } from "@/model/userdata/interactions/Participant";
import { Chair } from "@/model/userdata/rooms/Chair";
import LineOverlay from "@/components/room/LineOverlay.vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { Coordinate } from "@/components/room/Coordinate";

export default defineComponent({
  name: "SessionPageDesktop",
  components: { LineOverlay, SeatLabel, RoomDisplay },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sessionController = SessionController.getSessionController();
    const sessionId = props.sessionId;
    const seatArrangement =
      sessionController.getSeatArrangementOfSession(sessionId);
    const roomId = seatArrangement?.room.getId;
    const interactions = sessionController.getInteractionsOfSession(sessionId);
    const session = sessionController.getSession(sessionId);

    let selectedStudent: Participant | undefined = undefined;

    let targetStudent: Participant | undefined = undefined;

    const dragPosition: Ref<Coordinate | undefined> = ref(undefined);

    const dragStart: Ref<Coordinate | undefined> = ref(undefined);

    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    const seatLabels = ref([]);


    function selectStudent(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject)) {
        selectedStudent = getParticipant(roomObject);
        dragStart.value = displayCoordinates;
      }
    }

    function selectTargetStudent(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject)) {
        targetStudent = getParticipant(roomObject);
        dragPosition.value = displayCoordinates;
      }
    }

    function drag(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject)) {
        dragPosition.value = displayCoordinates;
        interactionLines.value = [
          {
            x1: dragStart.value?.x,
            y1: dragStart.value?.y,
            x2: dragPosition.value?.x,
            y2: dragPosition.value?.y,
          },
        ];
      }
    }

    const interactionLines = ref();

    return {
      roomId,
      seatLabels,
      getParticipant,
      selectStudent,
      selectTargetStudent,
      interactionLines,
      drag
    };
  },
});
</script>

<style scoped></style>
