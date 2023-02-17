<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="saveChangesClick">speichern</v-btn>
      <v-btn @click="activateDeleteCardClick">löschen</v-btn>
    </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-text-field
      v-model="courseName"
      label="Kursname"
      type="input"
    ></v-text-field>
    <v-text-field
      v-model="courseSubject"
      label="Fach"
      type="input"
    ></v-text-field>
    <v-btn @click="editSeatArrangementClick()">Sitzordnungen bearbeiten</v-btn>
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
    <v-btn @click="addSeatArrangementClick">Sitzordung hinzufügen</v-btn>
    <v-dialog max-width="700" v-model="roomSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="room in rooms" @click="addSeatArrangement(room)">
            {{ room.name }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog max-width="700" v-model="deleteCourseDialog">
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Kurs unwiederruflich löschen?
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
            @click="deleteCourseClick"
            color="primary"
            >Bestätigen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="700" v-model="newSeatArrangementNameDialog" persistent>
      <v-card variant="flat" class="pa-2 rounded-lg">
        <v-card-title class="text-h5 text-center text-indigo-darken-4">
          Sitzordnung benennen
        </v-card-title>
        <v-text-field
          v-model="newSetArrangementName"
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
import { defineComponent, Ref, ref } from "vue";
import { RoomController } from "@/controller/RoomController";
import { Room } from "@/model/userdata/rooms/Room";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Course } from "@/model/userdata/courses/Course";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "editCoursePage",
  components: { SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
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
    const newSeatArrangementRoom: Ref<Room|undefined> = ref<Room|undefined>(undefined) as Ref<Room|undefined>
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
    function activateDeleteCardClick() {
      deleteCourseDialog.value = true;
    }
    function deleteCourseClick() {
      courseController.deleteCourse(props.courseId);
      router.push({
        name:"ViewCoursesPage"
      })
    }
    function cancelDeleteClick() {
      deleteCourseDialog.value = false;
    }
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

    function addSeatArrangementClick() {
      roomSelectionDialog.value = true;
    }

    function editSeatArrangementClick() {
      seatArrangementDialog.value = true;
    }
    function confirmAddSeatArrangement() {
      let seatArrangementId: string | undefined =
        seatArrangementController.createSeatArrangement(
          newSetArrangementName.value,
          newSeatArrangementRoom.value!.getId,
          props.courseId
        );
      if (typeof seatArrangementId == "string") {
        router.push({
          name: "SeatArrangementPage",
          params: { seatArrangementId: seatArrangementId },
        });
      }
    }
    function cancelAddSeatArrangement() {
      newSeatArrangementRoom.value = undefined
    }
    function addSeatArrangement(room: Room) {
      newSeatArrangementRoom.value = room
      newSetArrangementName.value = ""
      newSeatArrangementNameDialog.value = true
    }

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
      newSetArrangementName
    };
  },
});
</script>

<style scoped></style>
