<template>
  <navigation-bar extended="true">
    <template v-slot:extension>
      <v-btn @click="saveChangesClick">speichern</v-btn>
      <v-btn @click="activateCardClick">Schüler löschen</v-btn>
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
        <v-btn @click="cancelDeleteClick">cancel</v-btn>
        <v-btn @click="deleteStudentClick">confirm</v-btn>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import {StudentController} from "@/controller/StudentController";
export default {
  name: "editStudentPage.vue",
  components: {
    NavigationBar
  },
  props: {
    studentId: {
      type: String,
    }
  },
  setup() {
    let firstName=studentController.getStudent(this.studentId).firstName
    let lastName='Snelting'
    let deleteSudentDialog=false
    const studentController=StudentController.getStudentConroller();

    function activateCardClick() {
      this.deleteSudentDialog=true;
    }
    function saveChangesClick() {

    }

    function deleteStudentClick(){
      studentController.deleteStudent(this.studentId);
      this.deleteSudentDialog=false;
    }
    function cancelDeleteClick() {
      this.deleteSudentDialog=false;
    }

    return {
      activateCardClick,
      deleteStudentClick,
      cancelDeleteClick,
      saveChangesClick
    }
  },
}
</script>

<style scoped>

</style>
