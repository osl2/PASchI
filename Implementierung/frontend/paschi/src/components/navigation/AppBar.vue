<template>
  <v-app-bar color="primary" elevation="0" border >
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
    <slot name="default">

    </slot>
    <template v-slot:append>
      <slot name="append" />
    </template>
    <template v-if="extended" v-slot:extension>
      <slot name="extension" />
    </template>
  </v-app-bar>
</template>

<script>
import {ref} from "vue";

export default {
  name: "AppBar",
  setup() {
    const extended = ref(false)
    return {
      extended
    }
  }
}
</script>

<style scoped>

</style>
