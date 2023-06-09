<template>
  <navigation-bar>
    <v-app-bar-title> Räume ansehen </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        name="createRoom"
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-plus"
        @click="newRoomClick"
        >Raum erstellen</v-btn
      >
    </template>
  </navigation-bar>

  <SideMenu />
  <BottomBar />

  <v-main class="ma-0 v-row justify-center align-content-xl-space-around">
    <v-container fluid class="v-col-11" style="max-width: 700px">
      <v-list rounded v-if="rooms.length > 0">
        <v-list-item
          rounded
          v-for="room in rooms"
          :key="room.getId"
          @click="editRoom(room)"
        >
          <v-list-item-title>
            {{ room.name }}

          </v-list-item-title>
          <template v-slot:append>
            <v-btn
              class="ml-2"
              variant="tonal"
              color="red"
              @click="deleteRoom(room)"
              v-on:click.stop
            >
              <v-icon>mdi mdi-trash-can</v-icon>
            </v-btn>
          </template>
          <v-tooltip
            activator="parent"
            location="start"
          >Raum bearbeiten
          </v-tooltip>
        </v-list-item>
      </v-list>
      <v-card v-else class="pa-2" variant="text">
        <v-card-title
          class="text-h5 text-center text-indigo-darken-4 text-wrap"
        >
          Es wurden noch keine Räume erstellt.
        </v-card-title>
        <v-card-item class="justify-center">
          <v-btn
            max-width="450"
            height="50"
            variant="tonal"
            prepend-icon="fas fa-plus"
            color="primary"
            @click="newRoomClick"
            >Raum erstellen!
          </v-btn>
        </v-card-item>
      </v-card>
    </v-container>
    <PDialog
      v-model="enterRoomNameDialog"
      title="Neuen Raum erstellen"
      :buttons="[
        {
          name: 'Abbrechen',
          click: abortNewRoomClick,
        },
        {
          name: 'Bestätigen',
          disabled: newRoomName === '',
          color: 'primary',
          click: confirmNewRoomClick,
          submit: true,
        },
      ]"
    >
      <PInput
        name="name"
        class="mt-2"
        v-model="newRoomName"
        variant="outlined"
        label="Raumname"
        type="input"
        autofocus
      ></PInput>
    </PDialog>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, ref, Ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Room } from "@/model/userdata/rooms/Room";
import { RoomController } from "@/controller/RoomController";
import { useRouter } from "vue-router";
import PDialog from "@/components/base/PDialog.vue";
import PInput from "@/components/base/PInput.vue";
import BottomBar from "@//components/navigation/BottomBar.vue";
export default defineComponent({
  name: "ViewRoomsPage",
  components: {BottomBar, PInput, PDialog, SideMenu, NavigationBar },
  setup() {
    const router = useRouter();

    const roomController: RoomController = RoomController.getRoomController();
    const rooms: Ref<Room[]> = ref(roomController.getAllRooms()) as Ref<Room[]>;
    const newRoomName: Ref<string> = ref("");
    const enterRoomNameDialog: Ref<boolean> = ref(false);

    function abortNewRoomClick() {
      enterRoomNameDialog.value = false;
    }
    async function confirmNewRoomClick() {
      await roomController.createRoom(newRoomName.value).then((res) => {
        router.push({
          name: "RoomEditor",
          params: { roomId: res },
        });
      });
    }
    function newRoomClick() {
      newRoomName.value = "";
      enterRoomNameDialog.value = true;
    }
    function editRoom(room: Room) {
      router.push({
        name: "RoomEditor",
        params: { roomId: room.getId },
      });
    }

    /**
     * Funktion, die einen Raum löscht. Sendet die Anfrage an den Controller.
     * @param room der Raum der gelöscht werden soll.
     */
    async function deleteRoom(room: Room){
      await roomController.deleteRoom(room.getId);
      rooms.value = roomController.getAllRooms();
    }

    return {
      editRoom,
      newRoomClick,
      confirmNewRoomClick,
      abortNewRoomClick,
      rooms,
      newRoomName,
      enterRoomNameDialog,
      deleteRoom,
    };
  },
});
</script>

<style scoped></style>
