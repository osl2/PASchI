<template>
  <v-main
    fluid
    :scrollable="false"
    style="touch-action: none"
    @dragover="dragOver"
  >
    <v-card>
    <v-card
      v-for="chair in chairs"
      :key="chair.id"
      class="ma-0 v-row align-center justify-center"
      width="80"
      height="80"
      color="secondary"
      elevation="0"
      draggable="true"
      :style="getChairStyle(chair)"
      @touchstart="touchStart"
      @touchmove="moveTouch($event, chair)"
      @dragstart="dragStart"
      @dragend="moveDrag($event, chair)"
    >
      <v-icon class="v-col-auto" size="40px" color="white" icon="fas fa-chair"></v-icon>
    </v-card>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {Chair} from "@/model/userdata/rooms/Chair";

export default defineComponent({
  name: "RoomEditor.vue",
  setup() {
    const chairs = ref([
      { id: 1, position: { xCoordinate: 400, yCoordinate: 400 } },
      { id: 2, position: { xCoordinate: 500, yCoordinate: 500 } },
      { id: 3, position: { xCoordinate: 600, yCoordinate: 600 } },
    ]);

    const roomWidth = 16180
    const roomHeight = 10000

    const maxRoomDisplayWidth = 0.9 * window.innerWidth
    const maxRoomDisplayHeight = 0.9 * window.innerHeight

    const roomScale = Math.min(maxRoomDisplayWidth / roomWidth, maxRoomDisplayHeight / roomHeight)

    const roomDisplayWidth = roomWidth * roomScale
    const roomDisplayHeight = roomHeight * roomScale

    const roomDisplayTopMargin = (maxRoomDisplayHeight - roomDisplayHeight) / 2
    const roomDisplayLeftMargin = (maxRoomDisplayWidth - roomDisplayWidth) / 2

    const moveXStart = ref(0);
    const moveYStart = ref(0);

    function roomToDisplayCoordinates(x: number, y: number) {
      return {
        x: roomDisplayLeftMargin + x * roomScale,
        y: roomDisplayTopMargin + y * roomScale
      }
    }

    function displayToRoomCoordinates(x: number, y: number) {
      return {
        x: (x - roomDisplayLeftMargin) / roomScale,
        y: (y - roomDisplayTopMargin) / roomScale
      }
    }

    function getChairStyle(chair: Chair) {
      const { x, y } = roomToDisplayCoordinates(chair.position.xCoordinate, chair.position.yCoordinate)
      return {
        position: 'absolute',
        top: y + 'px',
        left: x + 'px',
      }
    }

    function touchStart(event: TouchEvent) {
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function screenCoordinatesDeltaToRoomCoordinatesDelta(x: number, y: number) {
      return {
        x: x / roomScale,
        y: y / roomScale
      }
    }

    function moveTouch(event: TouchEvent, chair: Chair) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(event.touches[0].clientX - moveXStart.value, event.touches[0].clientY - moveYStart.value)
      chair.position.xCoordinate = chair.position.xCoordinate + delta.x;
      chair.position.yCoordinate = chair.position.yCoordinate + delta.y;
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function dragOver(event: DragEvent) {
      event.dataTransfer ? (event.dataTransfer.dropEffect = "move") : null;
      event.preventDefault();
    }

    function dragStart(event: DragEvent) {
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
    }

    function moveDrag(event: DragEvent, chair: Chair) {
      chair.position.xCoordinate = chair.position.xCoordinate + event.clientX - moveXStart.value;
      chair.position.yCoordinate = chair.position.yCoordinate + event.clientY - moveYStart.value;
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
    }

    return {
      chairs,
      dragStart,
      moveDrag,
      dragOver,
      touchStart,
      moveTouch,
      getChairStyle,
    };
  },
});
</script>

<style scoped></style>
