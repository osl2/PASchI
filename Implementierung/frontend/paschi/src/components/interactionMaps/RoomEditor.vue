<template>
  <v-main
    fluid
    :scrollable="false"
    style="touch-action: none"
    @dragover="dragOver"
  >
    <v-card
      v-for="chair in chairs"
      :key="chair.id"
      class="ma-0 v-row align-center justify-center"
      width="80"
      height="80"
      color="secondary"
      elevation="0"
      draggable="true"
      :style="{
        position: 'absolute',
        top: chair.y + 'px',
        left: chair.x + 'px',
      }"
      @touchstart="touchStart"
      @touchmove="moveTouch($event, chair)"
      @dragstart="dragStart"
      @dragend="moveDrag($event, chair)"
    >
      <v-icon class="v-col-auto" size="40px" color="white" icon="fas fa-chair"></v-icon>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "RoomEditor.vue",
  setup: function () {
    const chairs = ref([
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 200, y: 200 },
      { id: 3, x: 300, y: 300 },
      { id: 4, x: 400, y: 400 },
      { id: 5, x: 500, y: 500 },
    ]);

    const moveXStart = ref(0);
    const moveYStart = ref(0);

    function touchStart(event: TouchEvent) {
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function moveTouch(event: TouchEvent, chair: any) {
      chair.x = chair.x + event.touches[0].clientX - moveXStart.value;
      chair.y = chair.y + event.touches[0].clientY - moveYStart.value;
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

    function moveDrag(event: DragEvent, chair: any) {
      chair.x = chair.x + event.clientX - moveXStart.value;
      chair.y = chair.y + event.clientY - moveYStart.value;
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
    };
  },
});
</script>

<style scoped></style>
