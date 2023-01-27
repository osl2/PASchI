<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn class="ml-15" variant="flat" color="green" rounded prepend-icon="mdi mdi-plus" @click="newStudentClick">Schüler erstellen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-container fluid>
      <v-list max-width="700">
        <v-list-item rounded v-for="student in students" @click="">
          <v-list-item-title>
            {{ student.name }}
          </v-list-item-title>
          <template v-slot:append>
            <v-btn
              variant="tonal"
              color="primary"
              @click="editStudentClick(undefined)"
              ><v-icon>fas fa-pencil</v-icon></v-btn
            >
            <v-btn class="ml-2" variant="tonal" color="primary" @click="showStatisticsClick(undefined)">
              <v-icon> fas fa-chart-line </v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { StudentController } from "@/controller/StudentController";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Student } from "@/model/userdata/interactions/Student";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ViewStudentsPage",
  components: { SideMenu, NavigationBar },

  setup() {
    const students = [{ name: "Hansi" }, { name: "Gudrun" }];

    const studentController = StudentController.getStudentConroller();
    //const students = ref<Student[]>(studentController.getAllStudents());

    function newStudentClick() {}

    function editStudentClick(student: Student) {}

    function showStatisticsClick(student: Student) {}

    return {
      newStudentClick,
      editStudentClick,
      showStatisticsClick,
      students,
    };
  },
});
</script>

<style scoped></style>
