<template>
  <v-main
    fluid
    :scrollable="false"
    style="touch-action: none"
  >
    <v-card @dragover="dragOver" @drop="moveDrag($event, lastUsedChair)" key="background" color="primary" :style="roomDisplayStyle">
      <v-card
        v-for="chair in chairs"
        :key="chair.id"
        class="ma-0 v-row align-center justify-center"
        width="30"
        height="30"
        color="secondary"
        elevation="0"
        draggable="true"
        :style="getChairStyle(chair)"
        @touchstart="touchStart($event)"
        @touchmove="moveTouch($event, chair)"
        @dragstart="dragStart($event, chair)"
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
import { defineComponent, ref } from "vue";
import { Chair } from "@/model/userdata/rooms/Chair";

export default defineComponent({
  name: "RoomEditor.vue",
  setup() {
    const chairs = ref([
      { id: 1, position: { xCoordinate: 400, yCoordinate: 400 } },
      { id: 2, position: { xCoordinate: 500, yCoordinate: 500 } },
      { id: 3, position: { xCoordinate: 600, yCoordinate: 600 } },
    ]);

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

    const lastUsedChair = ref<Chair>();

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

    function getChairStyle(chair: Chair) {
      const { x, y } = roomToDisplayCoordinates(
        chair.position.xCoordinate,
        chair.position.yCoordinate
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

    function moveTouch(event: TouchEvent, chair: Chair) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.touches[0].clientX - moveXStart.value,
        event.touches[0].clientY - moveYStart.value
      );
      chair.position.xCoordinate = chair.position.xCoordinate + delta.x;
      chair.position.yCoordinate = chair.position.yCoordinate + delta.y;
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function dragOver(event: DragEvent) {
      event.dataTransfer ? (event.dataTransfer.dropEffect = "move") : null;
      event.preventDefault();
    }

    function dragStart(event: DragEvent, chair: Chair) {
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
      lastUsedChair.value = chair
    }

    function moveDrag(event: DragEvent, chair: Chair) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.clientX - moveXStart.value,
        event.clientY - moveYStart.value
      );
      chair.position.xCoordinate =
        chair.position.xCoordinate + delta.x;
      chair.position.yCoordinate =
        chair.position.yCoordinate + delta.y;
    }

    return {
      chairs,
      dragStart,
      moveDrag,
      dragOver,
      touchStart,
      moveTouch,
      getChairStyle,
      roomDisplayStyle,
      lastUsedChair,
    };
  },
});
</script>

<style scoped></style>
