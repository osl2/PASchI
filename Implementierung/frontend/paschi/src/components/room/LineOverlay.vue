<template>
  <canvas style="z-index: 10; width: 100vw; height: 100vh; top: 0; left: 0; position: fixed; pointer-events: none" :width="overlayWidth" :height="overlayHeight" ref="canvas"> </canvas>
</template>

<script lang="ts">
import {defineComponent, onBeforeUpdate, onMounted, onUpdated, PropType, Ref, ref, watch} from "vue";
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
  setup: function (props) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);

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

    let context: CanvasRenderingContext2D | null | undefined = null;

    onMounted(() => {
      context = canvas.value?.getContext("2d")
    });

    onBeforeUpdate(() => {
      if (context && props.lines && props.lines.length > 0) {
        context.clearRect(0, 0, canvas.value?.width ?? 0,canvas.value?.height ?? 0);
        for (let line of props.lines) {
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
