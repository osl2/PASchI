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
      name="room"
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseleave="mouseUp"
    >
      <slot name="main" />
      <div
        v-for="chair in chairs"
        :key="chair.getId"
        :style="getRoomObjectStyle(chair)"
        :class="[
          chair === selectedRoomObject && roomObjectOverlaps
            ? 'error'
            : 'notError',
        ]"
        @mousedown="mouseDown($event, chair)"
        @mouseenter="mouseEnter($event, chair)"
        @touchstart="touchStart($event, chair)"
        @touchmove="touchMove($event, chair)"
        @touchend="touchEnd($event)"
      >
        <slot name="chair" :chair="chair" :origin="getRoomObjectDisplayOrigin(chair)">
          <v-card
            name="chair"
            class="ma-0 v-row align-center justify-center"
            color="secondary-lighten-2"
            elevation="0"
            draggable="false"
            :width="getRoomObjectWidth(chair)"
            :height="getRoomObjectHeight(chair)"

          >
            <v-icon
              class="v-col-auto"
              size="25px"
              color="white"
              icon="fas fa-chair"
            ></v-icon>
          </v-card>
        </slot>
      </div>
      <div
        v-for="table in tables"
        :style="getRoomObjectStyle(table)"
        :key="table.getId"
        :class="[
          table === selectedRoomObject && roomObjectOverlaps
            ? 'error'
            : 'notError',
        ]"
        @mousedown="mouseDown($event, table)"
        @mouseenter="mouseEnter($event, table)"
        @touchstart="touchStart($event, table)"
        @touchmove="touchMove($event, table)"
        @touchend="touchEnd($event)"
      >
        <slot name="table" :table="table" :origin="getRoomObjectDisplayOrigin(table)">
          <v-card
            name="table"
            class="ma-0 v-row align-center justify-center"
            color="secondary-lighten-1"
            elevation="0"
            draggable="false"
            :width="getRoomObjectWidth(table)"
            :height="getRoomObjectHeight(table)"

          >
            <v-icon
              class="v-col-auto"
              size="25px"
              color="white"
              icon="mdi mdi-desk"
            ></v-icon>
          </v-card>
        </slot>
      </div>
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
import { useRoomObjectUtilities } from "@/components/room/RoomObjectUtilities";

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
    noDrag: {
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
      const origin = roomObjectUtilities.getRoomObjectOrigin(roomObject);
      const displayCoordinates = roomToDisplayCoordinates(
        origin.x,
        origin.y
      );
      return {
        position: "absolute",
        top: displayCoordinates.y + "px",
        left: displayCoordinates.x + "px",
        transform: `rotate(${roomObject.position.orientation}rad) translate(-50%, -50%)`,
        transformOrigin: "0 0",
      };
    }

    function getRoomObjectHeight(roomObject: RoomObject) {
      return roomObject.dimensions.length * roomScale;
    }

    function getRoomObjectWidth(roomObject: RoomObject) {
      return roomObject.dimensions.width * roomScale;
    }

    function getRoomObjectDisplayOrigin(roomObject: RoomObject): Coordinate {
      const roomCoordinates = roomObjectUtilities.getRoomObjectOrigin(roomObject);
      const displayCoordinates = roomToDisplayCoordinates(roomCoordinates.x, roomCoordinates.y);
      return {
        x: displayCoordinates.x + roomDisplayLeftMargin,
        y: displayCoordinates.y + roomDisplayTopMargin
      }
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

    function mouseEnter(event: MouseEvent, roomObject: RoomObject) {
      if (selectedRoomObject.value && selectedRoomObject.value !== roomObject && props.noDrag) {
        selectedRoomObject.value = roomObject;
      }
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

    function touchMove(event: TouchEvent, roomObject: RoomObject) {
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
        props.noDrag ? roomObject : selectedRoomObject.value,
        roomCoordinate,
        displayCoordinate
      );
    }

    function touchEnd(event: TouchEvent) {
      const displayCoordinate: Coordinate = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
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
      mouseEnter,
      mouseUp,
      getRoomObjectStyle,
      getRoomObjectHeight,
      getRoomObjectWidth,
      roomDisplayStyle,
      selectedRoomObject,
      roomId,
      getRoomObjectDisplayOrigin,
    };
  },
});
</script>

<style scoped>
.error {
  border: 2px solid red;
  z-index: 3;
}

.not-error {
  z-index: 2;
}
</style>
