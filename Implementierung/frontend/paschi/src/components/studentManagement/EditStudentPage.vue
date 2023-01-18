<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="saveChangesClick">speichern</v-btn>
      <v-btn @click="activateCardClick">Schüler löschen</v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <v-container>
      <v-text-field
        v-model="firstName"
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
import {ref} from "vue";
export default {
  name: "editStudentPage.vue",
  components: {
    NavigationBar
  },
  props: {
    studentId: {
      type: String
    }
  },
  setup(props) {
    const studentController = StudentController.getStudentConroller();
    const firstName = ref<String>(studentController.getStudent(props.studentId).firstName)
    const lastName = ref<String>(studentController.getStudent(props.studentId).firstName)
    const deleteSudentDialog = ref<Boolean>false

    function activateCardClick() {
      this.deleteSudentDialog.value = true;
    }
    function saveChangesClick() {

    }

    function deleteStudentClick(){
      studentController.deleteStudent(props.studentId);
      this.deleteSudentDialog=false;
    }
    function cancelDeleteClick() {
      this.deleteSudentDialog=false;
    }

    return {
      activateCardClick,
      deleteStudentClick,
      cancelDeleteClick,
      saveChangesClick,
      firstName,
      lastName,
      deleteSudentDialog
    }
  },
}
</script>

<style scoped>

</style>
