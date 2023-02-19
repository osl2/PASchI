<template>
  <canvas style="width: 100vw; height: 100vh; top: 0; left: 0; position: fixed" :width="overlayWidth" :height="overlayHeight" ref="canvas"> </canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from "vue";
interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default defineComponent({
  name: "LineOverlay",
  props: {
    lines: {
      type: Array as PropType<
        Line[]
      >,
      required: true,
    },
  },
  setup(props) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);
    const lines = props.lines;

    const overlayWidth = window.innerWidth;
    const overlayHeight = window.innerHeight;

    function drawBezierCurve(context: CanvasRenderingContext2D, line: Line) {
      const vector = {
        x: line.x2 - line.x1,
        y: line.y2 - line.y1,
      };
      const normal = {
        x: -vector.y,
        y: vector.x,
      };
      const c1 = {
        x: line.x1 + vector.x / 4 + normal.x / 4,
        y: line.y1 + vector.y / 4 + normal.y / 4,
      };
      const c2 = {
        x: line.x2 - vector.x / 4 + normal.x / 4,
        y: line.y2 - vector.y / 4 + normal.y / 4,
      };

      context.beginPath();
      context.moveTo(line.x1, line.y1);
      context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, line.x2, line.y2);
      context.strokeStyle = "red";
      context.lineWidth = 5;
      context.stroke();
    }

    onMounted(() => {
      const context = canvas.value?.getContext("2d");

      if (context) {
        for (let line of lines) {
          drawBezierCurve(context, line);
        }
      }
    });
    return {
      canvas,
      overlayWidth,
      overlayHeight,
    };
  },
});
</script>

<style scoped></style>
