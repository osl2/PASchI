<template>
  <navigation-bar>
    <template v-slot:append>
      <v-btn class="ma-2" rounded variant="flat" color="green" @click="saveChangesClick"
      >speichern
      </v-btn>
      <v-btn v-if="snelting" class="ma-2" rounded variant="flat" color="error" prepend-icon="fas fa-trash-can"
             @click="activateCardClick">
        Schüler exmatrikulieren
      </v-btn>
      <v-btn v-else class="ma-2" rounded variant="flat" color="error" prepend-icon="fas fa-trash-can"
             @click="activateCardClick">
        Schüler löschen
      </v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <side-menu/>
    <BottomBar />
    <v-container class="v-row justify-center">
      <v-form class="mt-5 v-col" style="max-width: 1000px">
        <v-text-field
          v-model="firstName"
          class="mt-2"
          variant="outlined"
          label="Vorame"
          type="input"
        ></v-text-field>
        <v-text-field
          class="mt-2"
          variant="outlined"
          v-model="lastName"
          label="Nachname"
          type="input"
        ></v-text-field>
      </v-form>
    </v-container>
    <v-dialog max-width="700" v-model="deleteStudentDialog">
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title v-if="snelting" class="text-h5 text-center text-indigo-darken-4">
          Schüler unwiderruflich exmatrikulieren?
        </v-card-title>
        <v-card-title v-else class="text-h5 text-center text-indigo-darken-4">
          Schüler unwiderruflich löschen?
        </v-card-title>
        <v-card-actions class="row justify-center">
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="cancelDeleteClick"
          >Abbrechen
          </v-btn
          >
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="deleteStudentClick"
            color="error"
          >Bestätigen
          </v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import {StudentController} from "@/controller/StudentController";
import {defineComponent, Ref, ref} from "vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import {Student} from "@/model/userdata/interactions/Student";
import {useRouter} from "vue-router";
import {UserController} from "@/controller/UserController";
import BottomBar from "@/components/navigation/BottomBar.vue";

export default defineComponent({
  name: "editStudentPage.vue",
  components: {
    BottomBar,
    SideMenu,
    NavigationBar,
  },
  props: {
    studentId: {
      name: "studentId",
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const studentController = StudentController.getStudentConroller();

    const student: Ref<Student | undefined> = ref<Student | undefined>(
      studentController.getStudent(props.studentId)
    ) as Ref<Student | undefined>;
    const firstName = ref<string>(getStudentFirstName());
    const lastName = ref<string>(getStudentLastName());
    const snelting = ref<boolean>(isSnelting());

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

    function isSnelting(): boolean {
      return UserController.getUserController().getUser().lastName.toLowerCase() === "snelting";
    }

    //normale Methoden

    /**
     * Aktiviert den Dialog zum Löschen eines Schülers.
     */
    function activateCardClick() {
      deleteStudentDialog.value = true;
    }

    /**
     * Aktualisiert den Schüler mit den zuvor bestimmten Werten.
     */
    async function saveChangesClick() {
      await studentController.updateStudent(
        props.studentId,
        firstName.value,
        lastName.value
      );
      await router.push({name: "ViewStudentsPage"});
    }

    /**
     * Löscht den Schüler.
     */
    async function deleteStudentClick() {
      await studentController.deleteStudent(props.studentId);
      await router.push({name: "ViewStudentsPage"});
    }

    /**
     * Bricht das Löschen eines Schülers ab.
     */
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
      snelting,
      deleteStudentDialog,
    };
  },
});
</script>

<style scoped></style>
