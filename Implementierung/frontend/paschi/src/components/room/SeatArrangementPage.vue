<template>
  <navigation-bar />
  <RoomDisplay :room-id="seatArrangement.room.getId">
    <template v-slot:chair="chair">
      <SeatLabel :participant="getParticipant(chair.chair)">
        <v-menu activator="parent" transition="slide-x-transition">
          <v-card>
            <v-list>
              <v-list-item prepend-icon="fas fa-user-slash">
                <v-list-item-title>Kein Schüler ausgewählt</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-list>
              <v-list-item
                v-for="participant in seatArrangement.course.participants"
                :key="participant.getId"
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
import {computed, defineComponent, Ref, ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {Chair} from "@/model/userdata/rooms/Chair";
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

    const seatArrangementController = SeatArrangementController.getSeatArrangementController();

    const seatArrangement = ref<SeatArrangement | undefined>(
      seatArrangementController.getSeatArrangement(
        props.seatArrangementId
      )
    ) as Ref<SeatArrangement>;

    function getParticipant(chair: Chair) {
        return seatArrangement.value?.getParticipantForSeat(chair);
      };
    return { seatArrangement, getParticipant };
  },
});
</script>

<style scoped></style>
