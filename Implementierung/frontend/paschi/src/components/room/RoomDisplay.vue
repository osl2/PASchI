<template>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <slot name="top"></slot>
    <slot name="bottom"></slot>
    <slot name="left"></slot>
    <slot name="right"></slot>
    <v-card
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseleave="mouseUp"
    >
      <slot name="chair" v-for="chair in chairs" :key="chair.getId">
        <v-card
          class="ma-0 v-row align-center justify-center"
          :class="[
            chair === selectedRoomObject && roomObjectOverlaps
              ? 'error'
              : 'notError',
          ]"
          color="secondary-lighten-2"
          elevation="0"
          draggable="false"
          :style="getRoomObjectStyle(chair)"
          @mousedown="mouseDown($event, chair)"
          @touchstart="touchStart($event, chair)"
          @touchmove="touchMove"
          @touchend="touchEnd"
        >
          <v-icon
            class="v-col-auto"
            size="25px"
            color="white"
            icon="fas fa-chair"
          ></v-icon>
        </v-card>
      </slot>
      <slot name="table" v-for="table in tables" :key="table.getId">
        <v-card
          class="ma-0 v-row align-center justify-center"
          :class="[
            table === selectedRoomObject && roomObjectOverlaps
              ? 'error'
              : 'notError',
          ]"
          color="secondary-lighten-1"
          elevation="0"
          draggable="false"
          :style="getRoomObjectStyle(table)"
          @mousedown="mouseDown($event, table)"
          @touchstart="touchStart($event, table)"
          @touchmove="touchMove"
          @touchend="touchEnd"
        >
          <v-icon
            class="v-col-auto"
            size="25px"
            color="white"
            icon="mdi mdi-desk"
          ></v-icon>
        </v-card>
      </slot>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { RoomController } from "@/controller/RoomController";
import { Coordinate } from "@/components/room/Coordinate";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { Chair } from "@/model/userdata/rooms/Chair";
import { Table } from "@/model/userdata/rooms/Table";
import {useRoomObjectUtilities} from "@/components/room/RoomObjectUtilities";

export default defineComponent({
  name: "RoomDisplay.vue",
  components: { NavigationBar },
  props: {
    roomId: {
      type: String,
      required: true,
    },
    roomObjectOverlaps: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["selectRoomObject", "dragRoomObject", "deselectRoomObject"],
  setup(props, { emit }) {
    const roomController = RoomController.getRoomController();

    const roomObjectUtilities = useRoomObjectUtilities();

    const roomId = props.roomId;

    const roomObjects = computed(() => roomController.getRoomObjects(roomId));

    const chairs = computed(() =>
      roomObjects.value?.filter((roomObject) => roomObject instanceof Chair)
    );
    const tables = computed(() =>
      roomObjects.value?.filter((roomObject) => roomObject instanceof Table)
    );

    const roomWidth = roomObjectUtilities.roomWidth;
    const roomHeight = roomObjectUtilities.roomHeight;

    const maxRoomDisplayWidth = 0.9 * window.innerWidth;
    const maxRoomDisplayHeight = 0.9 * window.innerHeight;

    const roomScale = Math.min(
      maxRoomDisplayWidth / roomWidth,
      maxRoomDisplayHeight / roomHeight
    );

    const roomDisplayWidth = roomWidth * roomScale;
    const roomDisplayHeight = roomHeight * roomScale;

    const roomDisplayTopMargin = 70;
    const roomDisplayLeftMargin = (window.innerWidth - roomDisplayWidth) / 2;

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };

    const selectedRoomObject = ref<RoomObject | undefined>(undefined);
    function roomToDisplayCoordinates(x: number, y: number) {
      return {
        x: x * roomScale,
        y: y * roomScale,
      };
    }

    function displayToRoomCoordinates(x: number, y: number) {
      return {
        x: (x - roomDisplayLeftMargin) / roomScale,
        y: (y - roomDisplayTopMargin) / roomScale,
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

    function mouseDown(event: MouseEvent, roomObject: RoomObject) {
      selectedRoomObject.value = roomObject;
      const displayCoordinate: Coordinate = {
        x: event.clientX,
        y: event.clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit("selectRoomObject", roomObject, roomCoordinate, displayCoordinate);
    }

    function mouseMove(event: MouseEvent) {
      if (!selectedRoomObject.value) {
        return;
      }
      const displayCoordinate: Coordinate = {
        x: event.clientX,
        y: event.clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit(
        "dragRoomObject",
        selectedRoomObject.value,
        roomCoordinate,
        displayCoordinate
      );
    }

    function mouseUp(event: MouseEvent) {
      if (!selectedRoomObject.value) {
        return;
      }
      const displayCoordinate: Coordinate = {
        x: event.clientX,
        y: event.clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit(
        "deselectRoomObject",
        selectedRoomObject.value,
        roomCoordinate,
        displayCoordinate
      );
      selectedRoomObject.value = undefined;
    }

    function touchStart(event: TouchEvent, roomObject: RoomObject) {
      selectedRoomObject.value = roomObject;
      const displayCoordinate: Coordinate = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit("selectRoomObject", roomObject, roomCoordinate, displayCoordinate);
    }

    function touchMove(event: TouchEvent) {
      const displayCoordinate: Coordinate = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit(
        "dragRoomObject",
        selectedRoomObject.value,
        roomCoordinate,
        displayCoordinate
      );
    }

    function touchEnd(event: TouchEvent) {
      const displayCoordinate: Coordinate = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      const roomCoordinate: Coordinate = displayToRoomCoordinates(
        displayCoordinate.x,
        displayCoordinate.y
      );
      emit(
        "deselectRoomObject",
        selectedRoomObject.value,
        roomCoordinate,
        displayCoordinate
      );
      selectedRoomObject.value = undefined;
    }

    return {
      chairs,
      tables,
      touchStart,
      touchMove,
      touchEnd,
      mouseDown,
      mouseMove,
      mouseUp,
      getRoomObjectStyle,
      roomDisplayStyle,
      selectedRoomObject,
      roomId,
    };
  },
});
</script>

<style scoped>
.error {
  border: 2px solid red;
  z-index: 2;
}

.not-error {
  z-index: 1;
}
</style>
