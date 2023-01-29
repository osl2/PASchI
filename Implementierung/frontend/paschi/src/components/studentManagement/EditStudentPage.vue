<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="saveChangesClick">speichern</v-btn>
      <v-btn @click="activateCardClick">Schüler löschen</v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <side-menu />
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
    <v-dialog v-model="deleteSudentDialog">
      <v-card>
        "Delete student?"
        <v-btn @click="cancelDeleteClick">cancel</v-btn>
        <v-btn @click="deleteStudentClick">confirm</v-btn>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { StudentController } from "@/controller/StudentController";
import { defineComponent, ref } from "vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
export default defineComponent({
  name: "editStudentPage.vue",
  components: {
    SideMenu,
    NavigationBar,
  },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const studentController = StudentController.getStudentConroller();

    const firstName = ref<String>(studentController.getStudent(props.studentId)!.firstName);
    const lastName = ref<String>(studentController.getStudent(props.studentId)!.lastName);
    const deleteSudentDialog = ref<boolean>(false);

    function activateCardClick() {
      deleteSudentDialog.value = true;
    }
    function saveChangesClick() {}

    function deleteStudentClick() {
      studentController.deleteStudent(props.studentId);
      deleteSudentDialog.value = false;
    }
    function cancelDeleteClick() {
      deleteSudentDialog.value = false;
    }

    return {
      activateCardClick,
      deleteStudentClick,
      cancelDeleteClick,
      saveChangesClick,
      firstName,
      lastName,
      deleteSudentDialog,
    };
  },
});
</script>

<style scoped></style>
