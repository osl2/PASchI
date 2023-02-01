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
    <v-dialog v-model="enterRoomNameDialog">
      <v-card>
        <v-text-field
          v-model="newRoomName"
          label="Raumname"
          type="input"
        ></v-text-field>
        <v-btn @click="abortNewRoomClick">abbrechen</v-btn>
        <v-btn @click="confirmNewRoomClick">bestätigen</v-btn>
      </v-card>
    </v-dialog>
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
    const newRoomName: Ref<string> = ref("");
    const enterRoomNameDialog: Ref<boolean> = ref(false);

    function abortNewRoomClick() {
      enterRoomNameDialog.value=false;
    };
    function confirmNewRoomClick() {
      router.push({
        name: "RoomArrangementPage",
        params: { roomId: roomController.createRoom(newRoomName.value) },
      });
    }
    function newRoomClick() {
      newRoomName.value="";
      enterRoomNameDialog.value=true;
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
      confirmNewRoomClick,
      abortNewRoomClick,
      rooms,
      newRoomName,
      enterRoomNameDialog
    };
  },
});
</script>

<style scoped></style>
