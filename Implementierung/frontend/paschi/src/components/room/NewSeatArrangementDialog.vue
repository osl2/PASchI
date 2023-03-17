<template>
  <PDialog
    :model-value="modelValue"
    @update:model-value="closeRoomSelectionDialogClick"
    :title="title"
    :elements="roomElements"
    :buttons="buttonElements"
  >
    <v-card v-if="noRooms" variant="text">
      <v-card-text class="d-flex justify-center mb-0">
        Keine Räume vorhanden.
      </v-card-text>
      <v-card-text class="d-flex justify-center mt-0">
        <v-btn color="primary" variant="tonal" height="50" @click="viewRoomsClick">
          Gehe zu Räume
        </v-btn>
      </v-card-text>
    </v-card>
    <PInput
      v-if="namingStage"
      v-model="seatArrangementName"
      label="Name der Sitzordnung"
      autofocus
    ></PInput>
  </PDialog>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { RoomController } from "@/controller/RoomController";
import { SeatArrangementController } from "@/controller/SeatArrangementController";
import { Room } from "@/model/userdata/rooms/Room";
import PDialog from "@/components/base/PDialog.vue";
import PInput from "@/components/base/PInput.vue";

export default defineComponent({
  name: "NewSeatArrangementDialog",
  components: { PInput, PDialog },
  props: {
    courseId: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const router = useRouter();
    const roomController = RoomController.getRoomController();
    const seatArrangementController =
      SeatArrangementController.getSeatArrangementController();
    const showRoomSelectionDialog = ref(false);
    const seatArrangementName = ref("");
    let selectedRoom: string | undefined = undefined;
    const rooms = ref<Room[]>(roomController.getAllRooms());
    const title = ref("Raum auswählen");
    const namingStage = ref(false);
    const noRooms = ref(rooms.value.length === 0);

    const buttonElements = ref([
      {
        name: "Abbrechen",
        click: closeRoomSelectionDialogClick,
      },
      {
        name: "Bestätigen",
        disabled: true,
        color: "primary",
        click: createSeatArrangementClick,
      },
    ]);

    const roomElements: Ref = ref(
      rooms.value.map((room) => {
        return {
          name: room.name,
          click: () => selectRoom(room.getId),
        };
      })
    );

    /**
     * Methode zur Anzeige des Raumauswahldialogs
     */
    function selectRoom(roomId: string) {
      selectedRoom = roomId;
      roomElements.value = [];
      buttonElements.value[1].disabled = false;
      namingStage.value = true;
      title.value = "Sitzordnung benennen";
    }

    /**
     * Methode zum Schließen des Raumauswahl-Popups
     */
    function closeRoomSelectionDialogClick() {
      emit("update:modelValue", false);
      namingStage.value = false;
      buttonElements.value[1].disabled = true;
      roomElements.value = rooms.value.map((room) => {
        return {
          name: room.name,
          click: () => selectRoom(room.getId),
        };
      });
      title.value = "Raum auswählen";
    }

    /**
     * Methode zum Erstellen einer Sitzordnung
     */
    async function createSeatArrangementClick() {
      const seatArrangementId =
        await seatArrangementController.createSeatArrangement(
          seatArrangementName.value,
          selectedRoom!,
          props.courseId
        );
      if (seatArrangementId) {
        await router.push({
          name: "SeatArrangementPage",
          params: { seatArrangementId: seatArrangementId },
        });
      }
    }

    /**
     * Methode zum Anzeigen eines Raumes
     */
    function viewRoomsClick() {
      router.push({ name: "RoomsPage" });
    }

    return {
      seatArrangementName,
      showRoomSelectionDialog,
      roomElements,
      title,
      namingStage,
      buttonElements,
      noRooms,
      viewRoomsClick,
      closeRoomSelectionDialogClick,
    };
  },
});
</script>

<style scoped></style>
