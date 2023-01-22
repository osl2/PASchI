<template>
  <v-main
    fluid
    :scrollable="false"
    style="touch-action: none"
    @dragover="dragOver"
  >
    <v-card
      key="1"
      class="ma-0"
      width="80"
      height="80"
      color="secondary"
      elevation="0"
      draggable="true"
      :style="{
        position: 'absolute',
        top: y + 'px',
        left: x + 'px',
      }"
      @touchstart="touchStart"
      @touchmove="moveTouch"
      @dragstart="dragStart"
      @dragend="moveDrag"
    >
      <v-card-title> main </v-card-title>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "InteractionMap.vue",
  setup: function () {
    const x = ref(100);
    const y = ref(100);

    const moveXStart = ref(0);
    const moveYStart = ref(0);

    function touchStart(event: TouchEvent) {
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function moveTouch(event: TouchEvent) {
      x.value = x.value + event.touches[0].clientX - moveXStart.value;
      y.value = y.value + event.touches[0].clientY - moveYStart.value;
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

    function moveDrag(event: DragEvent) {
      x.value = x.value + event.clientX - moveXStart.value;
      y.value = y.value + event.clientY - moveYStart.value;
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
    }

    return {
      x,
      y,
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
