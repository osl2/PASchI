<template>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <v-card
      @dragover="dragOver"
      @drop="moveDrag($event, lastUsedroomObject)"
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
    >
      <v-card
        v-for="roomObject in roomObjects"
        :key="roomObject.id"
        class="ma-0 v-row align-center justify-center"
        width="30"
        height="30"
        color="secondary"
        elevation="0"
        draggable="true"
        :style="getRoomObjectStyle(roomObject)"
        @touchstart="touchStart($event)"
        @touchmove="moveTouch($event, roomObject)"
        @dragstart="dragStart($event, roomObject)"
      >
        <v-icon
          class="v-col-auto"
          size="25px"
          color="white"
          icon="fas fa-chair"
        ></v-icon>
      </v-card>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, ref} from "vue";
import { RoomObject } from "@/model/userdata/rooms/roomObject";
import { Room } from "@/model/userdata/rooms/Room";
import { User } from "@/model/User";
import { Role } from "@/model/Role";
import {Position} from "@/model/userdata/rooms/Position";
import {Chair} from "@/model/userdata/rooms/Chair";

export default defineComponent({
  name: "RoomEditor.vue",
  setup() {

    const Gregor = ref<User>(
      new User(4, "Gregor", "Snelting", "f", true, Role.USER, "")
    );
    const room = ref<Room>(
      new Room(
        "123",
        Gregor.value,
        "Test"
      )
    );

    onBeforeMount(() => {
      room.value.addRoomObject( new Chair("0", Gregor.value, new Position("0", Gregor.value, 0, 0, 0)))
      room.value.addRoomObject( new Chair("1", Gregor.value, new Position("1", Gregor.value, 100, 100, 0)))
      room.value.addRoomObject( new Chair("2", Gregor.value, new Position("2", Gregor.value, 200, 200, 0)))
      room.value.addRoomObject( new Chair("3", Gregor.value, new Position("3", Gregor.value, 300, 300, 0)))
    });

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

    const lastUsedroomObject = ref<RoomObject>();

    const moveXStart = ref(0);
    const moveYStart = ref(0);

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };

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
      };
    }

    function touchStart(event: TouchEvent) {
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function screenCoordinatesDeltaToRoomCoordinatesDelta(
      x: number,
      y: number
    ) {
      return {
        x: x / roomScale,
        y: y / roomScale,
      };
    }

    function moveTouch(event: TouchEvent, roomObject: RoomObject) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.touches[0].clientX - moveXStart.value,
        event.touches[0].clientY - moveYStart.value
      );
      roomObject.position.xCoordinate = roomObject.position.xCoordinate + delta.x;
      roomObject.position.yCoordinate = roomObject.position.yCoordinate + delta.y;
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function dragOver(event: DragEvent) {
      event.dataTransfer ? (event.dataTransfer.dropEffect = "move") : null;
      event.preventDefault();
    }

    function dragStart(event: DragEvent, roomObject: RoomObject) {
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
      lastUsedroomObject.value = roomObject;
    }

    function moveDrag(event: DragEvent, roomObject: RoomObject) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.clientX - moveXStart.value,
        event.clientY - moveYStart.value
      );
      roomObject.position.xCoordinate = roomObject.position.xCoordinate + delta.x;
      roomObject.position.yCoordinate = roomObject.position.yCoordinate + delta.y;
    }

    return {
      roomObjects : room.value.roomObjects,
      dragStart,
      moveDrag,
      dragOver,
      touchStart,
      moveTouch,
      getRoomObjectStyle,
      roomDisplayStyle,
      lastUsedroomObject,
    };
  },
});
</script>

<style scoped></style>
