<template>
  <navigation-bar extended>
    <v-app-bar-title> Räume ansehen </v-app-bar-title>
    <template v-slot:extension>
      <v-btn
        class="ml-15"
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-plus"
        @click="newRoomClick"
        >Raum erstellen</v-btn
      >
    </template>
  </navigation-bar>
  <v-main>
    <side-menu />
    <v-container fluid class="v-col-11" style="max-width: 700px">
      <v-list rounded>
        <v-list-item
          rounded
          v-for="room in rooms"
          @click="editRoom(room)"
        >
          <v-list-item-title>
            {{ room.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, ref, Ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Room } from "@/model/userdata/rooms/Room";
import { RoomController } from "@/controller/RoomController";
import router from "@/plugins/router";
export default defineComponent({
  name: "ViewRoomsPage",
  components: { SideMenu, NavigationBar },
  setup() {
    const roomController: RoomController = RoomController.getRoomController();
    const rooms: Ref<Room[]> = ref(roomController.getAllRooms()) as Ref<Room[]>
    function newRoomClick() {
      router.push({
        name: "RoomArrangementPage",
        params: { roomId: roomController.createRoom("") },
      });
    }
    function editRoom(room: Room) {
      router.push({
        name: "RoomArrangementPage",
        params: { roomId: room.getId },
      });
    }
    return {
      editRoom,
      newRoomClick,
      rooms
    };
  },
});
</script>

<style scoped></style>
