<template>
  <v-dialog
    max-width="500"
    :model-value="modelValue"
    @update:model-value="updateDialog"
  >
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h5 text-center text-indigo-darken-4 text-wrap">
        {{ title }}
      </v-card-title>
      <v-list v-if="elements" class="ma-0">
        <v-list-item
          rounded
          v-for="(element, index) in elements"
          :key="index"
          :prepend-icon="element.icon ?? undefined"
          :color="element.color ?? undefined"
          @click="element.click() ?? undefined"
        >
          <v-list-item-title>{{ element.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-if="inputs">
        <v-list-item v-for="(input, index) in inputs" :key="index">
          <v-text-field
            class="mt-2"
            v-model="input.name"
            variant="outlined"
            :label="input.name"
            type="input"
            autofocus
          ></v-text-field>
        </v-list-item>
      </v-list>

      <v-row justify="space-around" class="ma-2">
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          variant="tonal"
          height="50"
          :color="button.color ?? undefined"
          :prepend-icon="button.icon ?? undefined"
          @click="button.click() ?? undefined"
        >
          {{ button.name }}
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "Dialog",
  props: {
    title: {
      type: String,
      required: false,
    },
    elements: {
      type: Array as () => (
        | String
        | {
            id?: String;
            name?: String;
            icon?: String;
            color?: String;
            click: Function;
          }
      )[],
      required: false,
    },
    inputs: {
      type: Array as () => (
        | String
        | { id?: String; name?: String; icon?: String; color?: String }
      )[],
      required: false,
    },
    buttons: {
      type: Array as () => (
        | String
        | {
            id?: String;
            name: String;
            icon?: String;
            color?: String;
            click?: Function;
          }
      )[],
      required: false,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue", "update:inputs", "click"],
  setup(props, { emit }) {
    function updateDialog(value: boolean) {
      emit("update:modelValue", value);
    }

    const inputs = ref(props.inputs);
    watch(inputs, (value) => {
      emit("update:inputs", value);
    });

    function click(name: String | undefined) {
      emit("click", name);
    }

    return {
      updateDialog,
      click,
      title: props.title,
      elements: props.elements,
      inputs: props.inputs,
      buttons: props.buttons,
    };
  },
});
</script>

<style scoped></style>
