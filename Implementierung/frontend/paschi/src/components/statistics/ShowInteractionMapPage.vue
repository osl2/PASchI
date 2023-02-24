<template>
  <navigation-bar />
  <RoomDisplay no-drag :room-id="roomId">
    <template v-slot:main>
      <LineOverlay ref="overlay" :lines="interactionLines">
        <template v-slot:lineMiddle="lineMiddle">
          <v-avatar>
            {{ getInteractionBreakdown(lineMiddle.id) }}
          </v-avatar>
        </template>
      </LineOverlay>
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
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
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
      {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        curve: Boolean;
        id: String;
        from: String;
        to: String;
      }[]
    >([]);

    function getInteractionCount(id: String): {
      total: number;
      breakDown: { category: String; count: number }[];
    } {
      const relevantInteractions = interactions?.filter(
        (interaction) =>
          interaction.fromParticipant.getId +
            "#" +
            interaction.toParticipant.getId ===
          id
      );
      const categories = relevantInteractions?.map(
        (interaction) => interaction.category
      );
      categories?.filter(
        (category, index, array) =>
          category !== undefined && array.indexOf(category) === index
      );
      const interactionCount: {
        total: number;
        breakDown: { category: String; count: number }[];
      } = { total: relevantInteractions?.length ?? 0, breakDown: [] };
      if (!categories) {
        return interactionCount;
      }
      for (let category of categories) {
        interactionCount.breakDown.push({
          category: category.name,
          count: relevantInteractions?.filter(
            (interaction) => interaction.category === category
          ).length!,
        });
      }
      return interactionCount;
    }
    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    function setSeatLabelOrigin(seatLabelId: String, coordinate: Coordinate) {
      originSeatLabels.set(seatLabelId, coordinate);
    }

    onBeforeMount(() => {
      if (!interactions) {
        return;
      }

      for (let interaction of interactions) {
        if (
          interactionLines.value.find(
            (line) =>
              line.id ===
              interaction.fromParticipant.getId +
                "#" +
                interaction.toParticipant.getId
          )
        ) {
          continue;
        }
        interactionLines.value.push({
          x1: originSeatLabels.get(interaction.fromParticipant.getId)?.x!,
          y1: originSeatLabels.get(interaction.fromParticipant.getId)?.y!,
          x2: originSeatLabels.get(interaction.toParticipant.getId)?.x!,
          y2: originSeatLabels.get(interaction.toParticipant.getId)?.y!,
          curve: true,
          id:
            interaction.fromParticipant.getId +
            "#" +
            interaction.toParticipant.getId,
          from: interaction.fromParticipant.getId,
          to: interaction.toParticipant.getId,
        });
      }
    });

    onMounted(() => {
      overlay.value.renderLines();
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
      getInteractionBreakdown: getInteractionCount,
    };
  },
});
</script>

<style scoped></style>
