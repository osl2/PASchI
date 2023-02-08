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

<script>
import { Participant } from "@/model/userdata/interactions/Participant";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SeatLabel",
  props: {
    participant: Participant,
  },
  setup(props) {
    return {
      participant: props.participant,
    };
  },
});
</script>

<style scoped></style>
