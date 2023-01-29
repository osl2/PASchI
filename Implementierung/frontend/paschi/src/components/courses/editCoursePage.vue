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
import { defineComponent, ref } from "vue";
import { RoomController } from "@/controller/RoomController";
import { Room } from "@/model/userdata/rooms/Room";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import {Course} from "@/model/userdata/courses/Course";

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
    const seatArrangements = courseController.getSeatArrangements(
      props.courseId
    );
    const course = ref<Course|undefined>(courseController.getCourse(props.courseId));
    const courseName = ref<string>(getCourseName());
    const courseSubject = ref<string>(getCourseSubject());
    const rooms = roomController.getAllRooms();
    const seatArrangementDialog = ref<boolean>(false);
    const roomSelectionDialog = ref<boolean>(false);


    function getCourseName(): string {
      if (typeof (course.value) == typeof Course) {
        return course.value!.name;
      }
      return "";
    }
    function getCourseSubject(): string {
      if (typeof (course.value) == typeof Course) {
        return course.value!.subject;
      }
      return "";
    }

    function saveChangesClick() {
      courseController.updateCourse(props.courseId, courseName.value, courseSubject.value);
    }

    function addSeatArrangementClick() {
      roomSelectionDialog.value = true;
    }

    function editSeatArrangementClick() {
      seatArrangementDialog.value = true;
    }

    function addSeatArrangement(room: Room) {}

    function editSeatArrangement(seatArrangement: SeatArrangement) {}

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
