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

export default {
  name: "NavigationBar",
  props: {
    extended: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
