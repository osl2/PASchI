<template>
  <NavigationBar>
    <template v-slot:prepend> Sitzordnung bearbeiten </template>
    <template v-slot:default class="row justify-center w-100">
      <v-app-bar-title class="v-col-auto">
        {{ seatArrangementName }}
      </v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-btn color="green" variant="flat" rounded @click="saveClick()"
        >speichern</v-btn
      >
    </template>
  </NavigationBar>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <v-card
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
    >
      <v-card
        v-for="chair in chairs"
        :key="chair.getId"
        class="ma-0 v-row align-center justify-center"
        color="secondary-lighten-2"
        elevation="0"
        draggable="false"
        :style="getRoomObjectStyle(chair)"
      >
        <v-icon
          class="v-col-auto"
          size="25px"
          color="white"
          icon="fas fa-chair"
        ></v-icon>
      </v-card>
      <v-card
        v-for="table in tables"
        :key="table.getId"
        class="ma-0 v-row align-center justify-center"
        color="secondary-lighten-1"
        elevation="0"
        draggable="false"
        :style="getRoomObjectStyle(table)"
      >
        <v-icon
          class="v-col-auto"
          size="25px"
          color="white"
          icon="mdi mdi-desk"
        ></v-icon>
      </v-card>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, ref, Ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import { Chair } from "@/model/userdata/rooms/Chair";
import {Table} from "@/model/userdata/rooms/Table";
export default defineComponent({
  name: "SeatArrangementPage",
  components: { NavigationBar },
  props: {
    seatArrangementId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const seatArrangementController: SeatArrangementController =
      SeatArrangementController.getSeatArrangementController();
    const seatArrangement: Ref<SeatArrangement | undefined> = ref(
      seatArrangementController.getSeatArrangement(props.seatArrangementId)
    ) as Ref<SeatArrangement | undefined>;
    const seatArrangementName = ref(getSeatArrangementName())
    const chairs: Ref<RoomObject[]> = ref(getChairs()) as Ref<
      Chair[]
    >;
    const tables: Ref<RoomObject[]> = ref(getTables()) as Ref<
      Table[]
    >;
    const roomWidth = 16180;
    const roomHeight = 10000;

    const maxRoomDisplayWidth = 0.9 * window.innerWidth;
    const maxRoomDisplayHeight = 0.9 * window.innerHeight;

    const roomScale = Math.min(
      maxRoomDisplayWidth / roomWidth,
      maxRoomDisplayHeight / roomHeight
    );

    const roomDisplayWidth = roomWidth * roomScale;
    const roomDisplayHeight = roomHeight * roomScale;

    const roomDisplayTopMargin = (window.innerHeight - roomDisplayHeight) / 2;
    const roomDisplayLeftMargin = (window.innerWidth - roomDisplayWidth) / 2;

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };
    function getChairs(): Chair[] {
      if (seatArrangement.value instanceof SeatArrangement) {
        return seatArrangement.value.room.roomObjects.filter((roomObject) => {
          return roomObject instanceof Chair
        });
      }
      return [];
    }
    function getTables(): Table[] {
      if (seatArrangement.value instanceof SeatArrangement) {
        return seatArrangement.value.room.roomObjects.filter((roomObject) => {
          return roomObject instanceof Table
        });
      }
      return [];
    }
    function getSeatArrangementName(): string {
      if (seatArrangement.value instanceof SeatArrangement) {
        return seatArrangement.value.name;
      }
      return "";
    }
    function saveClick() {}
    function roomToDisplayCoordinates(x: number, y: number) {
      return {
        x: x * roomScale,
        y: y * roomScale,
      };
    }
    function getRoomObjectStyle(roomObject: RoomObject) {
      const { x, y } = roomToDisplayCoordinates(
        roomObject.position.xCoordinate,
        roomObject.position.yCoordinate
      );
      return {
        position: "absolute",
        top: y + "px",
        left: x + "px",
        width: roomObject.dimensions.width * roomScale + "px",
        height: roomObject.dimensions.length * roomScale + "px",
        transform: `rotate(${roomObject.position.orientation}rad)`,
      };
    }
    return {
      seatArrangementName,
      roomDisplayStyle,
      chairs,
      tables,
      getRoomObjectStyle,
      saveClick,
    };
  },
});
</script>

<style scoped></style>
