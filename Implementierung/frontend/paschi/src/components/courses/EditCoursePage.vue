<template>
  <navigation-bar>
    <template v-slot:append>
      <v-btn class="ma-2" variant="flat" color="green" rounded @click="saveChangesClick" name="save"
        >speichern</v-btn
      >
      <v-btn
        class="ma-2"
        variant="flat"
        color="error"
        rounded
        prepend-icon="fas fa-trash-can"
        @click="activateDeleteCardClick"
        >Kurs löschen</v-btn
      >
    </template>
  </navigation-bar>

  <v-main class="v-row justify-center">
    <SideMenu />
    <ButtomBar />
    <v-form class="mt-5 v-col" style="max-width: 1000px">
      <v-text-field
        name="name"
        v-model="courseName"
        class="mt-2 mr-0"
        variant="outlined"
        label="Kursname"
        type="input"
      ></v-text-field>
      <v-text-field
        name="subject"
        class="mt-2 mr-0"
        variant="outlined"
        v-model="courseSubject"
        label="Fach"
        type="input"
      ></v-text-field>
      <v-row justify="end" class="ma-0">
        <v-btn
          class="mr-2"
          variant="tonal"
          color="secondary"
          v-if="!isMobile"
          @click="editSeatArrangementClick()"
          >Sitzordnungen bearbeiten</v-btn
        >
        <v-btn
          class="mr-0"
          variant="tonal"
          color="primary"
          v-if="!isMobile"
          @click="addSeatArrangementClick"
          >Sitzordung hinzufügen</v-btn
        >
      </v-row>
      <v-dialog max-width="700" v-model="seatArrangementDialog">
        <v-card>
          <v-list>
            <v-list-item
              v-for="seatArrangement in seatArrangements"
              @click="editSeatArrangement(seatArrangement)"
            >
              {{ seatArrangement.name }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
      <v-dialog max-width="700" v-model="roomSelectionDialog">
        <v-card>
          <v-list>
            <v-list-item
              v-for="room in rooms"
              @click="addSeatArrangement(room)"
            >
              {{ room.name }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-form>
    <PDialog
      v-model="deleteCourseDialog"
      title="Kurs unwiderruflich löschen?"
      buttons-centered
      :buttons="[
        {
          name: 'Abbrechen',
          click: cancelDeleteClick,
        },
        {
          name: 'Bestätigen',
          color: 'error',
          click: deleteCourseClick,
        },
      ]"
    >
    </PDialog>
    <v-dialog max-width="700" v-model="newSeatArrangementNameDialog" persistent>
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Sitzordnung benennen
        </v-card-title>
        <v-text-field
          v-model="newSetArrangementName"
          class="mt-2"
          variant="outlined"
          label="Name der Sitzordnung"
          type="input"
        ></v-text-field>
        <v-card-actions class="row justify-center">
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="cancelAddSeatArrangement"
            >Abbrechen</v-btn
          >
          <v-btn
            height="50"
            width="150"
            variant="tonal"
            @click="confirmAddSeatArrangement"
            color="primary"
            >Bestätigen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import { CourseController } from "@/controller/CourseController";
import { defineComponent, inject, Ref, ref } from "vue";
import { RoomController } from "@/controller/RoomController";
import { Room } from "@/model/userdata/rooms/Room";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Course } from "@/model/userdata/courses/Course";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { useRouter } from "vue-router";
import PDialog from "@/components/base/PDialog.vue";

export default defineComponent({
  name: "editCoursePage",
  components: { PDialog, SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isMobile: Ref<boolean> = inject("isMobile") as Ref<boolean>;

    const router = useRouter();

    const courseController = CourseController.getCourseController();
    const roomController = RoomController.getRoomController();
    const seatArrangementController =
      SeatArrangementController.getSeatArrangementController();
    const course: Ref<Course | undefined> = ref<Course | undefined>(
      courseController.getCourse(props.courseId)
    ) as Ref<Course | undefined>;
    const courseName: Ref<string> = ref<string>(getCourseName());
    const courseSubject: Ref<string> = ref<string>(getCourseSubject());
    const seatArrangements: Ref<SeatArrangement[]> = ref<SeatArrangement[]>(
      getSeatArrangements()
    ) as Ref<SeatArrangement[]>;
    const rooms: Ref<Room[]> = ref<Room[]>(roomController.getAllRooms()) as Ref<
      Room[]
    >;
    const seatArrangementDialog: Ref<boolean> = ref<boolean>(false);
    const roomSelectionDialog: Ref<boolean> = ref<boolean>(false);
    const deleteCourseDialog: Ref<boolean> = ref<boolean>(false);
    const newSeatArrangementNameDialog: Ref<boolean> = ref<boolean>(false);
    const newSetArrangementName: Ref<string> = ref<string>("");
    const newSeatArrangementRoom: Ref<Room | undefined> = ref<Room | undefined>(
      undefined
    ) as Ref<Room | undefined>;
    //Hilfsmethoden
    function getCourseName(): string {
      if (course.value instanceof Course) {
        return course.value.name;
      }
      return "";
    }
    function getCourseSubject(): string {
      if (course.value instanceof Course) {
        return course.value.subject;
      }
      return "";
    }
    function getSeatArrangements(): SeatArrangement[] {
      let seatArrangements: undefined | SeatArrangement[] =
        courseController.getSeatArrangements(props.courseId);
      if (seatArrangements instanceof Array) {
        return seatArrangements as SeatArrangement[];
      }
      return [];
    }

    //normale Methoden
    /**
     * Methode, die den Dialog zum Löschen des Kurses aktiviert.
     */
    function activateDeleteCardClick() {
      deleteCourseDialog.value = true;
    }

    /**
     * Methode, die den Kurs endgültig löscht.
     */
    async function deleteCourseClick() {
      await courseController.deleteCourse(props.courseId);
      await router.push({
        name: "ViewCoursesPage",
      });
    }

    /**
     * Methode, die das Löschen eines Schülers abbricht.
     */
    function cancelDeleteClick() {
      deleteCourseDialog.value = false;
    }

    /**
     * Methode, die die Änderungen in den Textfeldern speichern.
     */
    function saveChangesClick() {
      courseController.updateCourse(
        props.courseId,
        courseName.value,
        courseSubject.value
      );
      router.push({
        name: "CourseDetailsPage",
        params: { courseId: props.courseId },
      });
    }

    /**
     * Methode, die eine Liste von Räumen öffnet, zu der eine Sitzordnung angelegt werden kann
     */
    function addSeatArrangementClick() {
      roomSelectionDialog.value = true;
    }

    /**
     * Methode, die eine Liste von Sitzordnungen öffnet, die bearbeitet werden können.
     */
    function editSeatArrangementClick() {
      seatArrangementDialog.value = true;
    }

    /**
     * Methode zum Erstellen einer Sitzordnung mit zuvor ausgewähltem Raum und Namen.
     */
    async function confirmAddSeatArrangement() {
      let seatArrangementId: string | undefined;
      await seatArrangementController
        .createSeatArrangement(
          newSetArrangementName.value,
          newSeatArrangementRoom.value!.getId,
          props.courseId
        )
        .then((res) => (seatArrangementId = res));
      if (seatArrangementId) {
        await router.push({
          name: "SeatArrangementPage",
          params: { seatArrangementId: seatArrangementId },
        });
      }
    }

    /**
     * Methode zum Abbruch des Erstellens einer Sitzordnung.
     */
    function cancelAddSeatArrangement() {
      newSeatArrangementRoom.value = undefined;
      newSetArrangementName.value = "";
      newSeatArrangementNameDialog.value = false;
    }
    function addSeatArrangement(room: Room) {
      newSeatArrangementRoom.value = room;
      newSetArrangementName.value = "";
      newSeatArrangementNameDialog.value = true;
    }

    /**
     * Methode zum Aufruf der Bearbeitungsseite einer Sitzordnung
     *
     * @param seatArrangement Die Sitzordnung
     */
    function editSeatArrangement(seatArrangement: SeatArrangement) {
      router.push({
        name: "SeatArrangementPage",
        params: { seatArrangementId: seatArrangement.getId },
      });
    }

    return {
      saveChangesClick,
      deleteCourseClick,
      cancelDeleteClick,
      activateDeleteCardClick,
      addSeatArrangementClick,
      editSeatArrangementClick,
      addSeatArrangement,
      editSeatArrangement,
      confirmAddSeatArrangement,
      cancelAddSeatArrangement,
      deleteCourseDialog,
      seatArrangementDialog,
      roomSelectionDialog,
      seatArrangements,
      rooms,
      courseName,
      courseSubject,
      newSeatArrangementNameDialog,
      newSetArrangementName,
      isMobile,
    };
  },
});
</script>

<style scoped></style>
