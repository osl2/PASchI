<template>
  <navigation-bar extended>
    <template v-slot:extension> </template>
  </navigation-bar>

  <v-main>
    <SideMenu />
    <v-text-field
      v-model="courseName"
      label="Kursname"
      type="input"
    ></v-text-field>
  </v-main>
</template>

<script lang="ts">
import { CourseController } from "@/controller/CourseController";
import {defineComponent, Prop} from "vue";
import {RoomController} from "@/controller/RoomController";

export default defineComponent({
  name: "editCoursePage",
  components: {},
  props: {
    courseId: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const courseController = CourseController.getCourseController();
    const roomController = RoomController.getRoomController();
    const seatArrangements = courseController.getSeatArrangements(props.courseId);
    const rooms = roomController.getAllRooms();
    return {
      seatArrangements,
      rooms
    };
  },
});
</script>

<style scoped></style>
