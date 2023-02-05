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
    <v-dialog max-width="700" v-model="deleteStudentDialog">
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Schüler unwiederruflich löschen?
        </v-card-title>
        <v-card-actions class="row justify-center">
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="cancelDeleteClick"
          >Abbrechen</v-btn
          >
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="deleteStudentClick"
            color="primary"
          >Bestätigen</v-btn
          >
        </v-card-actions>
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
import { useRouter } from "vue-router";
export default defineComponent({
  name: "editStudentPage.vue",
  components: {
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
      studentController.updateStudent(
        props.studentId,
        firstName.value,
        lastName.value
      );
      router.push({ name: "ViewStudentsPage" });
    }

    function deleteStudentClick() {
      studentController.deleteStudent(props.studentId);
      router.push({ name: "ViewStudentsPage" });
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
