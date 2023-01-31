<template></template>

<script lang="ts">
import { defineComponent } from "vue";
import { SessionController } from "@/controller/SessionController";

export default defineComponent({
  name: "SessionStatisticPage",
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
  },
});
</script>

<style scoped></style>
