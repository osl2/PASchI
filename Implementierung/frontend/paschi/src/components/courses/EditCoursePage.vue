<template>
  <navigation-bar extended>
    <template v-slot:extension>
      <v-btn @click="saveChangesClick">speichern</v-btn>
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
    <v-dialog v-model="seatArrangementDialog">
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
    <v-dialog v-model="roomSelectionDialog">
      <v-card>
        <v-list>
          <v-list-item v-for="room in rooms" @click="addSeatArrangement(room)">
            {{ room.name }}
          </v-list-item>
        </v-list>
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
import { Session } from "@/model/userdata/courses/Session";
import router from "@/plugins/router";
import { SeatArrangementController } from "@/controller/SeatArrangementController";

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
    const courseController = CourseController.getCourseController();
    const roomController = RoomController.getRoomController();
    const seatArrangementController = SeatArrangementController.getSeatArrangementController();
    const course: Ref<Course | undefined> = ref<Course | undefined>(
      courseController.getCourse(props.courseId)
    ) as Ref<Course | undefined>;
    const courseName: Ref<string> = ref<string>(getCourseName());
    const courseSubject: Ref<string> = ref<string>(getCourseSubject());
    const seatArrangements: Ref<SeatArrangement[]> = ref<SeatArrangement[]>(
      getSeatArrangements()
    ) as Ref<SeatArrangement[]>;
    const rooms: Ref<Room[]> = ref<Room[]>(getAllRooms()) as Ref<Room[]>;
    const seatArrangementDialog: Ref<boolean> = ref<boolean>(false);
    const roomSelectionDialog: Ref<boolean> = ref<boolean>(false);

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
    function getAllRooms(): Room[] {
      let rooms: undefined | Room[] = roomController.getAllRooms();
      if (rooms instanceof Array) {
        return rooms as Room[];
      }
      return [];
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
    function saveChangesClick() {
      courseController.updateCourse(
        props.courseId,
        courseName.value,
        courseSubject.value
      );
      router.push({
        name: "CourseDetailPage",
        params: { courseId: props.courseId },
      });
    }

    function addSeatArrangementClick() {
      roomSelectionDialog.value = true;
    }

    function editSeatArrangementClick() {
      seatArrangementDialog.value = true;
    }

    function addSeatArrangement(room: Room) {
      let seatArrangementId: string|undefined = seatArrangementController.createSeatArrangement("unbenannt", props.courseId, room.getId);
       //TODO Name des SeatArrangements hier festlegen?
      if (typeof seatArrangementId=="string") {
        //TODO push
      }
    }

    function editSeatArrangement(seatArrangement: SeatArrangement) {
      //TODO push
    }

    return {
      saveChangesClick,
      addSeatArrangementClick,
      editSeatArrangementClick,
      addSeatArrangement,
      editSeatArrangement,
      seatArrangementDialog,
      roomSelectionDialog,
      seatArrangements,
      rooms,
      courseName,
      courseSubject,
    };
  },
});
</script>

<style scoped></style>
