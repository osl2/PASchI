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
    <v-dialog v-model="deleteStudentDialog">
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
import { defineComponent, Ref, ref } from "vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Student } from "@/model/userdata/interactions/Student";
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

    const student: Ref<Student | undefined> = ref<Student | undefined>(
      studentController.getStudent(props.studentId)
    ) as Ref<Student | undefined>;
    const firstName: Ref<string> = ref<string>(getStudentFirstName());
    const lastName: Ref<string> = ref<string>(getStudentLastName());

    const deleteStudentDialog = ref<boolean>(false);

    //Hilfsmethoden
    function getStudentFirstName(): string {
      if (student.value instanceof Student) {
        return student.value.firstName;
      }
      return "";
    }
    function getStudentLastName(): string {
      if (student.value instanceof Student) {
        return student.value.lastName;
      }
      return "";
    }

    //normale Methoden
    function activateCardClick() {
      deleteStudentDialog.value = true;
    }
    function saveChangesClick() {
      studentController.updateStudent(props.studentId, firstName.value, lastName.value)
    }

    function deleteStudentClick() {
      studentController.deleteStudent(props.studentId);
      deleteStudentDialog.value = false;
    }
    function cancelDeleteClick() {
      deleteStudentDialog.value = false;
    }

    return {
      activateCardClick,
      deleteStudentClick,
      cancelDeleteClick,
      saveChangesClick,
      firstName,
      lastName,
      deleteStudentDialog,
    };
  },
});
</script>

<style scoped></style>
