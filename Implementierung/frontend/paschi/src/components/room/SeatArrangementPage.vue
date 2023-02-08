<template>
  <navigation-bar />
  <RoomDisplay :room-id="seatArrangement.room.getId">
    <template v-slot:chair="chair">
      <SeatLabel :participant="getParticipant(chair.chair)">
        <v-menu activator="parent" transition="slide-x-transition">
          <v-card min-width="450" class="ma-2" variant="flat" color="primary">
            <v-list variant="plain" bg-color="transparent">
              <v-list-item
                v-if="getParticipant(chair.chair)"
                prepend-icon="fas fa-user"
              >
                <v-list-item-title
                  >{{ getParticipant(chair.chair).firstName }}
                  {{ getParticipant(chair.chair).lastName }}</v-list-item-title
                >
                <template v-slot:append>
                  <v-btn
                    variant="tonal"
                    icon="mdi mdi-minus-circle"
                    @click="emptySeat(chair.chair)"
                  />
                </template>
              </v-list-item>
              <v-list-item v-else disabled prepend-icon="fas fa-user-slash">
                <v-list-item-title>Kein Schüler ausgewählt</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-list variant="flat">
              <v-list-subheader> Schüler auswählen </v-list-subheader>
              <v-list-item
                v-for="participant in seatArrangement.course.participants"
                :key="participant.getId"
                rounded
                prepend-icon="fas fa-circle-user"
                @click="seatArrangement.setSeat(chair.chair, participant)"
              >
                <v-list-item-title>
                  {{ participant.firstName }}
                  {{ participant.lastName }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </SeatLabel>
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import { Chair } from "@/model/userdata/rooms/Chair";
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
    const seatArrangementController =
      SeatArrangementController.getSeatArrangementController();

    const seatArrangement = ref<SeatArrangement | undefined>(
      seatArrangementController.getSeatArrangement(props.seatArrangementId)
    ) as Ref<SeatArrangement>;

    function getParticipant(chair: Chair) {
      return seatArrangement.value?.getParticipantForSeat(chair);
    }

    function emptySeat(chair: Chair) {
      seatArrangement.value?.removeSeat(chair);
    }

    const participants = computed(() => {
      return seatArrangement.value?.course.participants;
    });

    return { emptySeat, seatArrangement, getParticipant };
  },
});
</script>

<style scoped></style>
