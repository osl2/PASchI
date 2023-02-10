<template>
  <div
    v-if="participant"
    class="flex-column align-content-center justify-center"
  >
    <div class="d-flex align center justify-center">
      <v-avatar class="justify-center" color="primary">
        <v-icon> far fa-circle-user </v-icon>
        <slot />
      </v-avatar>
    </div>
    <div class="col text-center font-weight-medium">
      {{ participant.firstName }}
      {{ participant.lastName }}
    </div>
  </div>
  <v-avatar v-else color="grey-lighten-4">
    <v-icon color="grey-darken-3"> fas fa-user-slash </v-icon>
    <slot />
  </v-avatar>
</template>

<script lang="ts">
import { Participant } from "@/model/userdata/interactions/Participant";
import { computed, defineComponent, ref } from "vue";
import { Ref } from "vue";

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
      participant,
    };
  },
});
</script>

<style scoped></style>
