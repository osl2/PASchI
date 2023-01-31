<template>

</template>

<script lang="ts">
import { CourseController } from "@/controller/CourseController";
import {defineComponent} from "vue";
export default defineComponent({
  name: "CourseStatisticPage",
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
  }
});
</script>

<style scoped>

</style>
