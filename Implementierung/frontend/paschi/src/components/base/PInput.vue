<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="updateInput"
    variant="outlined"
    class="mt-2 ma-0 pa-0"
    type="input"
  ></v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PInput",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    function updateInput(value: string) {
      emit("update:modelValue", value);
    }
    return {
      updateInput,
    };
  },
});
</script>

<style scoped></style>
