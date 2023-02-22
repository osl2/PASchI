<template>
  <navigation-bar />
  <RoomDisplay
    style="z-index: 5"
    no-drag
    :room-id="roomId"
  >
    <template v-slot:chair="chair">
      <SeatLabel
        :chair="chair.chair"
        :participant="getParticipant(chair.chair)"
        :ref="
          (el) =>
            (seatLabels.set(getParticipant(chair.chair)?.getId ?? undefined, el))
        "
      />
    </template>
  </RoomDisplay>
  <LineOverlay lines="interactionLines"/>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue"
import LineOverlay from "@/components/room/LineOverlay.vue";
import {SessionController} from "@/controller/SessionController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {Chair} from "@/model/userdata/rooms/Chair";
import SeatLabel from "@/components/room/SeatLabel.vue";
export default defineComponent({
  name: "ShowInteractionMapPage",
  components: {SeatLabel, LineOverlay, SideMenu, RoomDisplay, NavigationBar },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sessionController = SessionController.getSessionController();
    const seatArrangementController = SeatArrangementController.getSeatArrangementController();
    const session = sessionController.getSession(props.sessionId);
    const interactions = sessionController.getInteractionsOfSession(props.sessionId);
    const seatArrangement = sessionController.getSeatArrangementOfSession(props.sessionId)
    const roomId = seatArrangement?.room.getId;
    const seatLabels = ref<Map<String, HTMLElement>>(new Map());

    const interactionLines = ref<{x1: number, y1: number, x2: number, y2: number}[]>([]);

    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    onBeforeMount(() => {
      if (!interactions) {
        return
      }
      for(let interaction of interactions) {
        interactionLines.value.push({
          x1: seatLabels.value.get(interaction.fromParticipant.getId)?.getBoundingClientRect().x!,
          y1: seatLabels.value.get(interaction.fromParticipant.getId)?.getBoundingClientRect().y!,
          x2: seatLabels.value.get(interaction.toParticipant.getId)?.getBoundingClientRect().x!,
          y2: seatLabels.value.get(interaction.toParticipant.getId)?.getBoundingClientRect().y!
        })
      }
    })

    return {
      roomId,
      getParticipant,
      seatLabels
    }
  },
});
</script>

<style scoped></style>
