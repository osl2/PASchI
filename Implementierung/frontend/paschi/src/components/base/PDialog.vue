<template>
  <v-dialog
    max-width="500"
    :model-value="modelValue"
    @update:model-value="updateDialog"
  >
    <v-card class="pa-4 rounded-lg">
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
      <v-form validate-on="submit" @submit.prevent>
        <slot />
        <v-row :justify="buttonsCentered ? 'center' : 'end'" class="mt-4 ma-0">
          <v-btn
            v-for="(button, index) in buttons"
            :type="button.submit ? 'submit' : 'button'"
            :key="index"
            variant="tonal"
            height="50"
            :color="button.color ?? undefined"
            :disabled="button.disabled ?? false"
            :prepend-icon="button.icon ?? undefined"
            @click="button.click() ?? undefined"
            class="ml-2"
            :name="button.name"
          >
            {{ button.name }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PDialog",
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
    buttons: {
      type: Array as () => (
        | String
        | {
            id?: String;
            name: String;
            icon?: String;
            color?: String;
            click?: Function;
            disabled?: Boolean;
            submit?: Boolean;
          }
      )[],
      required: false,
    },
    buttonsCentered: {
      type: Boolean,
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

    function click(name: String | undefined) {
      emit("click", name);
    }

    return {
      updateDialog,
      click,
    };
  },
});
</script>

<style scoped></style>
