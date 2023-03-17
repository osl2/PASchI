<template>
  <v-expansion-panels>
    <PDialog
      v-model="addStudentSelectionDialog"
      title="Schüler hinzufügen"
      :elements="studentsNotInCourseElements"
    >
    </PDialog>
    <v-expansion-panel eager elevation="0" class="rounded-lg">
      <v-expansion-panel-title>
        <h2 class="ma-2">Schülerliste</h2>
        <v-spacer />
        <v-btn
          name="addStudent"
          class="ma-2 mr-4"
          variant="tonal"
          color="green"
          prepend-icon="mdi mdi-plus"
          min-width="228"
          v-on:click.stop
          @click="activateStudentCard"
          >Schüler hinzufügen
        </v-btn>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="justify-center">
        <v-list>
          <v-row class="ma-2" v-for="student in studentsInCourse"
            >{{ student.firstName }} {{ student.lastName }}
            <v-spacer />
            <v-btn
              variant="tonal"
              color="primary"
              @click="editStudentClick(student)"
            >
              <v-icon>fas fa-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="primary"
              @click="studentStatisticClick(student)"
            >
              <v-icon> fas fa-chart-line</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="red"
              @click="removeStudentFromCourse(student)"
            >
              <v-icon>mdi mdi-minus</v-icon>
            </v-btn>
          </v-row>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import PDialog from "@/components/base/PDialog.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { useRouter } from "vue-router";
import { CourseController } from "@/controller/CourseController";
import { SessionController } from "@/controller/SessionController";
import { Student } from "@/model/userdata/interactions/Student";

export default defineComponent({
  name: "AddStudentsCard",
  components: { PDialog, SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const courseController: CourseController =
      CourseController.getCourseController();
    SessionController.getSessionController();

    const addStudentSelectionDialog: Ref<boolean> = ref<boolean>(false);

    const studentsNotInCourse = computed(() => getStudentsNotInCourse());

    const studentsNotInCourseElements = computed(() => {
      return computed(() =>
        studentsNotInCourse.value.map((student) => {
          return {
            id: student.getId,
            name: student.firstName + " " + student.lastName,
            icon: "mdi mdi-account",
            click: () => addStudent(student),
          };
        })
      );
    });

    const studentsInCourse: Ref<Student[]> = ref<Student[]>(
      getStudentsOfCourse()
    ) as Ref<Student[]>;

    //Hilfsmethoden

    function getStudentsOfCourse(): Student[] {
      let students: undefined | Student[] =
        courseController.getStudentsOfCourse(props.courseId);
      if (students instanceof Array) {
        return students as Student[];
      }
      return [];
    }

    function getStudentsNotInCourse(): Student[] {
      let students: undefined | Student[] =
        courseController.getStudentsNotInCourse(props.courseId);
      if (students instanceof Array) {
        return students as Student[];
      }
      return [];
    }

    //normale Methoden

    /**
     * Methode um einen Schüler aus dem Kurs zu entfernen
     *
     * @param student Der zu entfernende Schüler
     */
    function removeStudentFromCourse(student: Student) {
      courseController.removeStudentFromCourse(props.courseId, student.getId);
    }

    /**
     * Methode um die Bearbeitungsseite eines Schülers aufzurufen.
     *
     * @param student
     */
    function editStudentClick(student: Student) {
      router.push({
        name: "EditStudentPage",
        params: { studentId: student.getId },
      });
    }

    /**
     * Methode zum Hinzufügen eines Schülers zu einem Kurs
     *
     * @param student Der Schüler der hinzugefügt werden soll
     */
    function addStudent(student: Student) {
      courseController.addStudentToCourse(props.courseId, student.getId);
      if (studentsNotInCourse.value.length == 0) {
        addStudentSelectionDialog.value = false;
      }
    }

    /**
     * Methode zum Aktivieren der Anzeige der SchülerListe
     */
    function activateStudentCard() {
      addStudentSelectionDialog.value = true;
    }

    /**
     * Methode zur Anzeige der Schülerstatistik.
     *
     * @param student Schüler der Statistik
     */
    function studentStatisticClick(student: Student) {
      router.push({
        name: "StudentStatisticPage",
        params: { studentId: student.getId },
      });
    }

    return {
      editStudentClick,
      addStudent,
      activateStudentCard,
      studentStatisticClick,
      removeStudentFromCourse,
      addStudentSelectionDialog,
      studentsNotInCourseElements,
      studentsInCourse,
    };
  },
});
</script>

<style scoped></style>
