<template>
  <navigation-bar>
    <template v-slot:extension>
      <v-btn>speichern</v-btn>
      <v-btn>Schüler löschen</v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <v-container>
      <v-text-field
        v-model="preName"
        label="Vorame"
        type="input"
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        label="Nachname"
        type="input"
      ></v-text-field>
    </v-container>
    <v-dialog
      v-model="deleteSudentDialog"
    >
      <v-card>
        "Delete student?"
        <v-btn>cancel</v-btn>
        <v-btn>confirm</v-btn>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import NavigationBar from "@/components/navigation/NavigationBar.vue";

export default {
  name: "editStudentPage.vue",
  components: {
  NavigationBar
  },
  props:['studentId'],
  data: () => ({
    preName: 'Gregor',
    lastName: 'Snelting',
    deleteSudentDialog: true,
  }),
}
</script>

<style scoped>

</style>
