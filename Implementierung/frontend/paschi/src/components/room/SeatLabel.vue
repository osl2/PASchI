<template>
  <div
    v-if="participant"
    class="flex-column align-content-center justify-center"
  >
    <div class="d-flex align center justify-center" style="user-select: none; -webkit-user-select: none">
      <v-avatar class="font-weight-medium text-lg-button" color="primary">
        {{ participant.firstName.charAt(0) + " " + participant.lastName.charAt(0) }}
        <slot />
      </v-avatar>
    </div>
    <div class="col text-center font-weight-medium" style="user-select: none; -webkit-user-select: none">
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
