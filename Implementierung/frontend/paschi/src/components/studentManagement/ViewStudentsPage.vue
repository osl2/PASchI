<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="newStudentClick">Schüler erstellen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-list>
      <v-list-item>
        David M
        <v-btn @click="deleteStudentClick(student)">schüler löschen</v-btn>
        <v-btn @click="editStudentClick(student)">schüler bearbeiten</v-btn>
        <v-btn @click="showStatisticsClick(student)">Statistiken anzeigen</v-btn>
      </v-list-item>
      <v-list-item>
        Bob b
        <v-btn @click="deleteStudentClick(student)">schüler löschen</v-btn>
        <v-btn @click="editStudentClick(student)">schüler bearbeiten</v-btn>
        <v-btn @click="showStatisticsClick(student)">Statistiken anzeigen</v-btn>
      </v-list-item>
      <v-list-item v-for="student in students">
        {{student.firstName}} {{student.firstName}}
        <v-btn @click="deleteStudentClick(student)">schüler löschen</v-btn>
        <v-btn @click="editStudentClick(student)">schüler bearbeiten</v-btn>
        <v-btn @click="showStatisticsClick(student)">Statistiken anzeigen</v-btn>
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script lang="ts">
import {StudentController} from "@/controller/StudentController";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import {Student} from "@/model/userdata/interactions/Student";
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "ViewStudentsPage",
  components: {SideMenu, NavigationBar},

  setup() {
    const studentController = StudentController.getStudentConroller();
    const students = ref<Student[]>(studentController.getAllStudents());
    function newStudentClick() {

    }
    function editStudentClick(student: Student) {

    }

    function deleteStudentClick(student: Student) {

    }

    function showStatisticsClick(student: Student) {

    }
    return {
      newStudentClick,
      editStudentClick,
      deleteStudentClick,
      showStatisticsClick,
      students
    }
  }
})
</script>

<style scoped>

</style>
