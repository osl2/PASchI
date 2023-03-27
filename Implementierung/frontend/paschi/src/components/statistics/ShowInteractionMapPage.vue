<template>
  <navigation-bar extended>
    <template v-slot:append>
      <v-icon class="ma-2" @click="activateInteractionList">
        mdi mdi-view-list
      </v-icon>
    </template>
  </navigation-bar>
  <RoomDisplay no-drag :room-id="roomId">
    <template v-slot:main>
      <LineOverlay ref="overlay" z-index="5" :lines="interactionLines">
        <template v-slot:lineMiddle="lineMiddle">
          <v-avatar
            color="interaction"
            density="comfortable"
            class="font-weight-medium"
          >
            {{ getInteractionBreakdown(lineMiddle.id).total }}
            <v-icon :style="rotateStyle(lineMiddle.angle)">
              fas fa-arrow-right
            </v-icon>
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
        style="z-index: 12"
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
  <v-dialog v-model="interactionListDialog">
    <v-card cols="11">
      <v-card-title>
        <v-row>
          <v-col cols="11" no-gutters
          ><div class="v-col-11">Interaktionen</div></v-col
          >
          <v-col cols="1" no-gutters align-self="start">
            <v-row justify="end">
              <v-icon class="ma-2" @click="interactionListDialog = false">mdi mdi-close</v-icon>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-list class="ma-2 v-col-12">
        <v-row class="ma-2">
          <v-col><div>Von</div></v-col>
          <v-col><div>Nach</div></v-col>
          <v-col><div>Katetegorie</div></v-col>
          <v-col><div>Qualität</div></v-col>
          <v-col><div>Zeit</div></v-col>
        </v-row>
        <v-divider />
        <v-row
          class="ma-2"
          key="interaction.getId"
          v-for="interaction in interactions"
        >
          <v-col
          ><div>
            {{ interaction.fromParticipant.firstName }}
            {{ interaction.fromParticipant.lastName }}
          </div></v-col
          >
          <v-col
          ><div>
            {{ interaction.toParticipant.firstName }}
            {{ interaction.toParticipant.lastName }}
          </div></v-col
          >
          <v-col
          ><div>{{ interaction.category.name }}</div></v-col
          >
          <v-col>
            <template v-if="interaction.category.hasQuality()">
              <v-icon
                icon="mdi mdi-star"
                v-for="i in getStars(interaction.category.getQuality())"
              ></v-icon>
              <v-icon
                icon="mdi mdi-star-outline"
                v-for="i in 5 - (getStars(interaction.category.getQuality()))"
              ></v-icon>
            </template>
          </v-col>
          <v-col
          ><div>{{ interaction.timeStamp }}</div></v-col
          >
        </v-row>
      </v-list>
    </v-card>
  </v-dialog>
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
import {Quality} from "@/model/userdata/interactions/Quality";

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

    const interactionListDialog = ref(false);

    /**
     * Methode zur Rückgabe der Anzahl an Interaktionen
     * @param id Id eines Teilnehmers
     */
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

    function getStars(quality: Quality) {
      switch (quality) {
        case Quality.ONE_STAR:
          return 1;
        case Quality.TWO_STAR:
          return 2;
        case Quality.THREE_STAR:
          return 3;
        case Quality.FOUR_STAR:
          return 4;
        case Quality.FIVE_STAR:
          return 5;
        default:
          return 0
      }
    }

    /**
     * Methode zur Rückgabe des Teilnehmers, welcher auf dem übergebenen Stuhl sitzt
     * @param chair Stuhl
     */
    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    /**
     * Methode zum Setzen des SeatLabels
     * @param seatLabelId Id des SeatLabels
     * @param coordinate Koordinaten
     */
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

    /**
     * Methode zum Drehen
     * @param angle Winkel des Drehens
     */
    function rotateStyle(angle: number) {
      return {
        transform: "rotate(" + angle + "rad)",
      };
    }

    function activateInteractionList() {
      interactionListDialog.value = true;
    }

    return {
      activateInteractionList,
      interactionListDialog,
      getStars,
      click,
      roomId,
      overlay,
      getParticipant,
      interactionLines,
      interactions,
      setSeatLabelOrigin,
      rotateStyle,
      getInteractionBreakdown: getInteractionCount,
    };
  },
});
</script>

<style scoped></style>
