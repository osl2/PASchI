<template>
  <v-avatar v-if="participant" color="primary">
    <v-icon> far fa-circle-user </v-icon>
    {{ participant.firstName }}
    {{ participant.lastName }}
    <slot />
  </v-avatar>
  <v-avatar v-else color="grey-lighten-4">
    <v-icon color="grey-darken-3"> fas fa-user-slash </v-icon>
    <slot />
  </v-avatar>
</template>

<script lang="ts">
import { Participant } from "@/model/userdata/interactions/Participant";
import {computed, defineComponent, ref} from "vue";
import {Ref} from "vue";

export default defineComponent({
  name: "SeatLabel",
  props: {
    participant: {
      type: Object as () => Participant,
      required: false,
    },
  },
  setup(props) {
    const participant = computed(() => props.participant);

    return {
      participant
    };
  },
});
</script>

<style scoped></style>
