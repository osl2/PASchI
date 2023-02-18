<template>
  <canvas width="100vw" height="100vh" ref="canvas"> </canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from "vue";

export default defineComponent({
  name: "LineOverlay",
  props: {
    lines: {
      type: Object as PropType<
        {
          x1: number;
          y1: number;
          x2: number;
          y2: number;
        }[]
      >,
      required: true,
    },
  },
  setup(props) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);
    const lines = props.lines;
    onMounted(() => {
      const context = canvas.value?.getContext("2d");
      for (let line of lines) {
        context?.beginPath();
        context?.moveTo(line.x1, line.y1);
        context?.lineTo(line.x2, line.y2);
        context?.stroke();
      }
    });
    return {
      canvas,
    };
  },
});
</script>

<style scoped></style>
