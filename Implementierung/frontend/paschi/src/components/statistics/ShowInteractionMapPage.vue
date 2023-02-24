<template>
  <navigation-bar />
  <RoomDisplay no-drag :room-id="roomId">
    <template v-slot:main>
      <LineOverlay ref="overlay" :lines="interactionLines">
        <template v-slot:lineMiddle="lineMiddle">
          <v-avatar
            color="interaction"
            density="compact"
            class="font-weight-medium"
          >
            {{ getInteractionBreakdown(lineMiddle.id).total }}
            <v-menu activator="parent" transition="slide-y-transition">
              <v-card
                min-width="250"
                class="pa-2"
                variant="flat"
                color="primary"
              >
                <v-list rounded>
                  <v-list-item
                    v-for="category in getInteractionBreakdown(
                      lineMiddle.id
                    ).breakDown.keys()"
                    rounded
                  >
                    <v-list-item-title> {{ category }}: </v-list-item-title>
                    <template v-slot:append>
                      {{
                        getInteractionBreakdown(lineMiddle.id).breakDown.get(
                          category
                        )
                      }}
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
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
import { defineComponent, onMounted, ref } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import LineOverlay from "@/components/room/LineOverlay.vue";
import { SessionController } from "@/controller/SessionController";
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
      breakDown: Map<String, number>;
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
        breakDown: Map<String, number>;
      } = { total: relevantInteractions?.length ?? 0, breakDown: new Map() };
      if (!categories) {
        return interactionCount;
      }
      for (let category of categories) {
        interactionCount.breakDown.set(
          category.name,
          relevantInteractions?.filter(
            (interaction) => interaction.category === category
          ).length!
        );
      }
      return interactionCount;
    }

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
      interactions,
      setSeatLabelOrigin,
      getInteractionBreakdown: getInteractionCount,
    };
  },
});
</script>

<style scoped></style>
