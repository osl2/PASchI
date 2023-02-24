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
  <div v-for="slot in slots" :id="slot.id" :style="{
    position: 'absolute',
    top: slot.y,
    left: slot.x,
    zIndex: 1,
    transform: 'translate(-50%, -50%)'
  }">
    <slot name="lineMiddle" :id="slot.id" />
  </div>
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
  curve: Boolean;
  id: String;

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

    const slots = ref<{id: String, x: number, y: number}[]>([])

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
      const middle = {
        x: line.curve? line.x1 + vector.x / 2 + (normal.x * 3) / 16 : line.x1 + vector.x / 2,
        y: line.curve? line.y1 + vector.y / 2 + (normal.y * 3) / 16 : line.y1 + vector.y / 2,
      };

      slots.value.push({id: line.id, x: middle.x, y: middle.y});

      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      if (line.curve) {
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, line.x2, line.y2);
      }
      else {
        ctx.lineTo(line.x2, line.y2);
      }
      ctx.strokeStyle = "#0b738b";
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    let ctx: CanvasRenderingContext2D | null | undefined = null;

    onMounted(() => {
      ctx = canvas.value?.getContext("2d");
    });



    const renderLines = () => {
      if (ctx && props.lines && props.lines.length > 0) {
        slots.value = [];
        ctx.clearRect(0, 0, overlayWidth, overlayHeight);
        for (let line of props.lines) {
          drawBezierCurve(ctx, line);
        }
      }
    };

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
      slots,
      overlayWidth,
      overlayHeight,
    };
  },
});
</script>

<style scoped></style>
