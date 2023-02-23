<template>
  <navigation-bar />
  <RoomDisplay no-drag :room-id="roomId">
    <template v-slot:main>
      <LineOverlay ref="overlay" :lines="interactionLines" />
    </template>
    <template v-slot:chair="chair">
      <SeatLabel
        style="z-index: 2"
        :chair="chair.chair"
        @click="click"
        :participant="getParticipant(chair.chair)"
        :ref="
          () => {
            setSeatLabelOrigin(
              getParticipant(chair.chair)?.getId ?? undefined,
              chair.origin
            );
          }
        "
      />
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import LineOverlay from "@/components/room/LineOverlay.vue";
import { SessionController } from "@/controller/SessionController";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { Chair } from "@/model/userdata/rooms/Chair";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { Coordinate } from "@/components/room/Coordinate";
export default defineComponent({
  name: "ShowInteractionMapPage",
  components: { SeatLabel, LineOverlay, SideMenu, RoomDisplay, NavigationBar },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sessionController = SessionController.getSessionController();
    const seatArrangementController =
      SeatArrangementController.getSeatArrangementController();
    const session = sessionController.getSession(props.sessionId);
    const interactions = sessionController.getInteractionsOfSession(
      props.sessionId
    );
    const seatArrangement = sessionController.getSeatArrangementOfSession(
      props.sessionId
    );
    const roomId = seatArrangement?.room.getId;
    let originSeatLabels: Map<String, Coordinate> = new Map();

    const overlay = ref();

    const interactionLines = ref<
      { x1: number; y1: number; x2: number; y2: number }[]
    >([]);

    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    function setSeatLabelOrigin(seatLabelId: String, coordinate: Coordinate) {
      originSeatLabels.set(seatLabelId, coordinate);
    }

    onMounted(() => {
      if (!interactions) {
        return;
      }

      for (let interaction of interactions) {
        interactionLines.value.push({
          x1: originSeatLabels.get(interaction.fromParticipant.getId)?.x!,
          y1: originSeatLabels.get(interaction.fromParticipant.getId)?.y!,
          x2: originSeatLabels.get(interaction.toParticipant.getId)?.x!,
          y2: originSeatLabels.get(interaction.toParticipant.getId)?.y!,
        });
      }
    });

    function click() {
      console.log(overlay.value);
      overlay.value.renderLines();
      console.log("click");
    }

    return {
      click,
      roomId,
      overlay,
      getParticipant,
      interactionLines,
      setSeatLabelOrigin,
    };
  },
});
</script>

<style scoped></style>
