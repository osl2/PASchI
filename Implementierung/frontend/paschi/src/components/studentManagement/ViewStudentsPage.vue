<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="newStudentClick">Schüler erstellen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu/>
    <v-list>
      <v-card-item v-for="student in students">
        <v-row class="ma-2">
          {{ student.name }}
          <v-spacer/>
          <v-btn class="mr-2" prepend-icon="fas fa-edit" color="primary" @click="editStudentClick(undefined)"/>
          <v-btn prepend-icon="fas fa-chart-line" color="primary" @click="showStatisticsClick(undefined)"/>
        </v-row>
      </v-card-item>
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

    const students = [
      {name: "Hansi"},
      {name: "Gudrun"},
    ]

    const studentController = StudentController.getStudentConroller();
    //const students = ref<Student[]>(studentController.getAllStudents());

    function newStudentClick() {

    }

    function editStudentClick(student: Student) {

    }

    function showStatisticsClick(student: Student) {

    }

    return {
      newStudentClick,
      editStudentClick,
      showStatisticsClick,
      students
    }
  }
})
</script>

<style scoped>

</style>
