<template>
  <navigation-bar>
    <v-app-bar-title> Schüler ansehen </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        name="createStudent"
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-plus"
        @click="newStudentClick"
        >Schüler erstellen</v-btn
      >
    </template>
  </navigation-bar>

  <SideMenu />
  <v-main class="ma-0 v-row justify-center align-content-xl-space-around">
    <SideMenu />
    <BottomBar />
    <v-container fluid class="v-col-11" style="max-width: 700px">
      <v-list rounded v-if="students.length > 0">
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
      <v-card v-else class="pa-2" variant="text">
        <v-card-title
          class="text-h5 text-center text-indigo-darken-4 text-wrap"
        >
          Es wurden noch keine Schüler erstellt.
        </v-card-title>
        <v-card-item class="justify-center">
          <v-btn
            max-width="450"
            height="50"
            variant="tonal"
            prepend-icon="fas fa-plus"
            color="primary"
            @click="newStudentClick"
            >Schüler erstellen!
          </v-btn>
        </v-card-item>
      </v-card>
    </v-container>
    <PDialog
      v-model="enterStudentNameDialog"
      title="Neuen Schüler erstellen"
      :buttons="[
        { name: 'Abbrechen', click: abortNewStudentClick },
        {
          name: 'Bestätigen',
          click: confirmNewStudentClick,
          color: 'primary',
          submit: true,
        },
      ]"
    >
      <PInput
        v-model="studentFirstName"
        label="Vorname"
        type="input"
        autofocus
      ></PInput>
      <PInput v-model="studentLastName" label="Nachname"></PInput>
    </PDialog>
  </v-main>
</template>

<script lang="ts">
import { StudentController } from "@/controller/StudentController";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Student } from "@/model/userdata/interactions/Student";
import { defineComponent, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import PDialog from "@/components/base/PDialog.vue";
import PInput from "@/components/base/PInput.vue";
import BottomBar from "@/components/navigation/BottomBar.vue";

export default defineComponent({
  name: "ViewStudentsPage",
  components: {BottomBar, PInput, PDialog, SideMenu, NavigationBar },

  computed:{
    isDisabled(){
      return !(this.studentFirstName)
    }
  },


  setup() {
    const router = useRouter();

    const studentController = StudentController.getStudentConroller();
    const students: Ref<Student[]> = ref<Student[]>(
      studentController.getAllStudents()
    ) as Ref<Student[]>;
    const enterStudentNameDialog: Ref<boolean> = ref(false);
    const studentFirstName: Ref<string> = ref("");
    const studentLastName: Ref<string> = ref("");

    /**
     * Öffnet Dialog zum Erstellen eines neuen Schülers.
     */
    function newStudentClick() {
      studentFirstName.value = "";
      studentLastName.value = "";
      enterStudentNameDialog.value = true;
    }

    /**
     * Bricht das Erstellen eines neuen Schülers ab.
     */
    function abortNewStudentClick() {
      enterStudentNameDialog.value = false;
    }

    /**
     * Erstellt einen neuen Schüler mit den zuvor bestimmten Parametern.
     */
    async function confirmNewStudentClick() {
      await studentController.createStudent(
        studentFirstName.value,
        studentLastName.value
      );
      students.value = studentController.getAllStudents();
      enterStudentNameDialog.value = false;
    }

    /**
     * Leitet zur Schülerbearbeitungsseite weiter.
     *
     * @param student Der Schüler der bearbeitet wird.
     */
    function editStudentClick(student: Student) {
      router.push({
        name: "EditStudentPage",
        params: { studentId: student.getId },
      });
    }

    /**
     * Leitet zur Schülerstatistikseite weiter.
     *
     * @param student Der Schüler der Statistik.
     */
    function showStatisticsClick(student: Student) {
      router.push({
        name: "StudentStatisticPage",
        params: { studentId: student.getId },
      });
    }

    return {
      newStudentClick,
      editStudentClick,
      showStatisticsClick,
      abortNewStudentClick,
      confirmNewStudentClick,
      students,
      enterStudentNameDialog,
      studentFirstName,
      studentLastName,
    };
  },
});
</script>

<style scoped></style>
