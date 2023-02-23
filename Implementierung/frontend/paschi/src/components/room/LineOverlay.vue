<template>
  <canvas
    style="
      z-index: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      position: fixed;
      pointer-events: none;
    "
    :width="overlayWidth"
    :height="overlayHeight"
    ref="canvas"
  >
  </canvas>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  PropType,
  Ref,
  ref,
  watch,
} from "vue";
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
      type: Array as PropType<Line[]>,
      required: true,
    },
  },
  setup: function (props, context) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);

    const overlayWidth = window.innerWidth;
    const overlayHeight = window.innerHeight;

    function drawBezierCurve(ctx: CanvasRenderingContext2D, line: Line) {
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

      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx./*bezierCurveTo*/ lineTo(
        /*c1.x, c1.y, c2.x, c2.y,*/ line.x2,
        line.y2
      );
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    let ctx: CanvasRenderingContext2D | null | undefined = null;

    onMounted(() => {
      ctx = canvas.value?.getContext("2d");
    });

    const renderLines = () => {
      if (ctx && props.lines && props.lines.length > 0) {
        ctx.clearRect(0, 0, overlayWidth, overlayHeight);
        for (let line of props.lines) {
          drawBezierCurve(ctx, line);
        }
      }
    }

    context.expose({
      renderLines,
    });

    onBeforeUpdate(() => {
      if (ctx && props.lines && props.lines.length > 0) {
        ctx.clearRect(0, 0, overlayWidth, overlayHeight);
        for (let line of props.lines) {
          drawBezierCurve(ctx, line);
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
