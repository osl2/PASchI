<template>
  <navigation-bar extended>
    <v-app-bar-title> Schüler ansehen </v-app-bar-title>
    <template v-slot:extension>
      <v-btn
        class="ml-15"
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-plus"
        @click="newStudentClick"
        >Schüler erstellen</v-btn
      >
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-container fluid class="v-col-11" style="max-width: 700px">
      <v-list rounded>
        <v-list-item rounded v-for="student in students" :key="student.getId">
          <v-list-item-title>
            {{ student.firstName }} {{ student.lastName }}
          </v-list-item-title>
          <template v-slot:append>
            <v-btn
              variant="tonal"
              color="primary"
              @click="editStudentClick(student)"
              ><v-icon>fas fa-pencil</v-icon></v-btn
            >
            <v-btn
              class="ml-2"
              variant="tonal"
              color="primary"
              @click="showStatisticsClick(student)"
            >
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
import {defineComponent, Ref, ref, UnwrapRef} from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "ViewStudentsPage",
  components: { SideMenu, NavigationBar },

  setup() {
    /*const students = [
      { name: "Hansi" },
      { name: "Gudrun" },
      { name: "Kunibert" },
      { name: "Melanie" },
      { name: "Günther" },
      { name: "Ingo Stolz" },
      { name: "Peter Petersilie" },
      { name: "Henrik Olafson" },
      { name: "Magnus Köder" },
      { name: "Severus Snape" },
      { name: "Christiana Krise" },
    ];*/

    const studentController = StudentController.getStudentConroller();
    const students: Ref<Student[]> = ref<Student[]>(studentController.getAllStudents()) as Ref<Student[]>;

    const router = useRouter();

    function newStudentClick() {
      const studentId = studentController.createStudent("", "");
      router.push({
        name: "EditStudentPage",
        params: { studentId: studentId },
      });
    }

    function editStudentClick(student: Student) {
      router.push({
        name: "EditStudentPage",
        params: { studentId: student.getId },
      })
    }

    function showStatisticsClick(student: Student) {
      router.push({
        name: "StudentStatisticPage",
        params: {studentId: student.getId},
      })
    }

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
